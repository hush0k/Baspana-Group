from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from cloudinary import uploader

from app.auth import require_role
from app.cruds.promotion import (
    create_promotion,
    delete_promotion,
    get_promotion_by_id,
    get_promotions_filtered,
    update_promotion,
)
from app.database import get_db
from app.models import ApartmentType, Role, User
from app.schemas import (
    PromotionCreate,
    PromotionResponse,
    PromotionUpdate,
)

router = APIRouter()


@router.get("/")
def get_promotions_endpoint(
    residential_complex_id: Optional[int] = None,
    apartment_type: Optional[ApartmentType] = None,
    is_active: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_promotions_filtered(
        db=db,
        residential_complex_id=residential_complex_id,
        apartment_type=apartment_type,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )


@router.get("/{id}", response_model=PromotionResponse)
def get_promotion_by_id_endpoint(id: int, db: Session = Depends(get_db)):
    promotion = get_promotion_by_id(db, id)
    if not promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found"
        )
    return promotion


@router.post("/", response_model=PromotionResponse)
def create_promotion_endpoint(
    promotion: PromotionCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    return create_promotion(db, promotion)


@router.patch("/{id}", response_model=PromotionResponse)
def update_promotion_endpoint(
    id: int,
    promotion: PromotionUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    db_promotion = get_promotion_by_id(db, id)
    if not db_promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found"
        )
    return update_promotion(db, id, promotion)


@router.delete("/{id}", response_model=PromotionResponse)
def delete_promotion_endpoint(
    id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    db_promotion = get_promotion_by_id(db, id)
    if not db_promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Promotion not found"
        )
    delete_promotion(db, db_promotion)
    return db_promotion


@router.post("/upload-image")
async def upload_promotion_image(
    file: UploadFile = File(...),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    """Upload promotion image to Cloudinary and return URL"""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="File must be an image",
        )

    try:
        result = uploader.upload(
            file.file,
            folder="baspana/promotions",
            resource_type="image",
        )
        return {"image_url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
