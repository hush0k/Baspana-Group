# backend/app/api/v1/endpoints/panoramas.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import cloudinary
import cloudinary.uploader

from app.auth import get_current_user, require_role
from app.cruds.panorama import panorama as crud_panorama
from app.database import get_db
from app.schemas import PanoramaResponse, PanoramaCreate
from app.models import PanoramaType, Role

router = APIRouter()

@router.post("/", response_model=PanoramaResponse)
async def create_panorama(
        file: UploadFile = File(...),
        residential_complex_id: Optional[int] = Form(None),
        apartment_id: Optional[int] = Form(None),
        type: PanoramaType = Form(PanoramaType.IMAGE_360),
        title: Optional[str] = Form(None),
        db: Session = Depends(get_db),
        current_user = Depends(require_role([Role.admin, Role.manager]))
):
    # Upload to Cloudinary
    upload_result = cloudinary.uploader.upload(
        file.file,
        folder="panoramas",
        resource_type="auto"
    )

    panorama_data = PanoramaCreate(
        residential_complex_id=residential_complex_id,
        apartment_id=apartment_id,
        file_url=upload_result['secure_url'],
        type=type,
        title=title
    )
    return crud_panorama.create(db=db, obj_in=panorama_data)

@router.get("/complex/{complex_id}", response_model=List[PanoramaResponse])
def get_complex_panoramas(complex_id: int, db: Session = Depends(get_db)):
    return crud_panorama.get_by_complex(db=db, complex_id=complex_id)

@router.get("/apartment/{apartment_id}", response_model=List[PanoramaResponse])
def get_apartment_panoramas(apartment_id: int, db: Session = Depends(get_db)):
    return crud_panorama.get_by_apartment(db=db, apartment_id=apartment_id)

@router.delete("/{panorama_id}")
def delete_panorama(
        panorama_id: int,
        db: Session = Depends(get_db),
        current_user = Depends(require_role([Role.admin, Role.manager]))
):
    result = crud_panorama.delete(db=db, panorama_id=panorama_id)
    if not result:
        raise HTTPException(status_code=404, detail="Panorama not found")
    return {"message": "Panorama deleted successfully"}