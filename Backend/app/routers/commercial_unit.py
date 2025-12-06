from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.commercial_unit import (
    create_commercial,
    delete_commercial,
    get_commercial_by_id,
    get_commercial_by_number,
    get_commercials_filtered,
    update_commercial,
)

from app.cruds.commercial_unit import (
    create_commercial,
    get_commercial_by_id,
    get_commercial_by_number,
)
from app.database import get_db
from app.models import Direction, FinishingType, PropertyStatus, Role, User
from app.schemas import (
    CommercialUnitResponse,
    CommercialUnitUpdate,
    CommercialUnitCreate,
    PaginatedCommercialUnitResponse,
)

router = APIRouter()


@router.get("/", response_model=PaginatedCommercialUnitResponse)
def get_commercials_endpoint(
    min_floor: Optional[int] = None,
    max_floor: Optional[int] = None,
    min_space_area: Optional[Decimal] = None,
    max_space_area: Optional[Decimal] = None,
    min_ceiling_height: Optional[Decimal] = None,
    max_ceiling_height: Optional[Decimal] = None,
    finishing_type: Optional[FinishingType] = None,
    min_per_sqr: Optional[Decimal] = None,
    max_per_sqr: Optional[Decimal] = None,
    min_total_price: Optional[Decimal] = None,
    max_total_price: Optional[Decimal] = None,
    status: Optional[PropertyStatus] = None,
    orientation: Optional[Direction] = None,
    isCorner: Optional[bool] = None,
    order_by: str = "asc",
    sort_by: str = "floor",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_commercials_filtered(
        db=db,
        min_floor=min_floor,
        max_floor=max_floor,
        min_space_area=min_space_area,
        max_space_area=max_space_area,
        min_ceiling_height=min_ceiling_height,
        max_ceiling_height=max_ceiling_height,
        finishing_type=finishing_type,
        min_per_sqr=min_per_sqr,
        max_per_sqr=max_per_sqr,
        min_total_price=min_total_price,
        max_total_price=max_total_price,
        status=status,
        orientation=orientation,
        isCorner=isCorner,
        order_by=order_by,
        sort_by=sort_by,
        limit=limit,
        offset=offset,
    )


@router.get("/{id}", response_model=CommercialUnitResponse)
def get_commercial_by_id_endpoint(commercial_id: int, db: Session = Depends(get_db)):
    existing_commercial = get_commercial_by_id(db, commercial_id)
    if existing_commercial is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="commercial not found"
        )
    return existing_commercial


# POST commercial
@router.post("/", response_model=CommercialUnitCreate)
def create_commercial_endpoint(
    commercial: CommercialUnitCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_commercial = get_commercial_by_number(
        db, commercial.number, commercial.building_id
    )
    if existing_commercial:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="commercial already exists",
        )
    return create_commercial(db, commercial)


# PUT commercial
@router.patch("/{id}", response_model=CommercialUnitUpdate)
def update_commercial_endpoint(
    commercial_id: int,
    commercial: CommercialUnitUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_commercial = get_commercial_by_id(db, commercial_id)
    if not existing_commercial:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="commercial not found"
        )
    updated_data = update_commercial(db, commercial_id, commercial)
    return updated_data


# DELETE commercial
@router.delete("/{id}", response_model=CommercialUnitResponse)
def delete_commercial_endpoint(
    commercial_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_commercial = get_commercial_by_id(db, commercial_id)
    if not existing_commercial:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="commercial not found"
        )
    delete_commercial(db, commercial_id)
    return existing_commercial
