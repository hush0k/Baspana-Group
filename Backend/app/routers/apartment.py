from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.apartment import create_apartment, delete_apartment, get_apartment_by_id, get_apartment_by_number, \
	get_apartments_filtered, \
	update_apartment
from app.database import get_db
from app.models import Apartment, ApartmentType, Direction, FinishingType, PropertyStatus, Role, User
from app.schemas import ApartmentCreate, ApartmentResponse, ApartmentUpdate, PaginatedApartmentResponse

router = APIRouter()

@router.get("/", response_model=PaginatedApartmentResponse)
def get_apartments_endpoint(
    min_floor: Optional[int] = None,
    max_floor: Optional[int] = None,
    min_apartment_area: Optional[Decimal] = None,
    max_apartment_area: Optional[Decimal] = None,
    apartment_type: Optional[ApartmentType] = None,
    has_balcony: Optional[bool] = None,
    bathroom_count: Optional[int] = None,
    min_kitchen_area: Optional[Decimal] = None,
    max_kitchen_area: Optional[Decimal] = None,
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
    db: Session = Depends(get_db)
):
    return get_apartments_filtered(
        db=db,
        min_floor=min_floor,
        max_floor=max_floor,
        min_apartment_area=min_apartment_area,
        max_apartment_area=max_apartment_area,
        apartment_type=apartment_type,
        has_balcony=has_balcony,
        bathroom_count=bathroom_count,
        min_kitchen_area=min_kitchen_area,
        max_kitchen_area=max_kitchen_area,
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
        offset=offset
    )


@router.get("/{id}", response_model=ApartmentResponse)
def get_apartment_by_id_endpoint(apartment_id: int, db: Session = Depends(get_db)):
	existing_apartment = get_apartment_by_id(db, apartment_id)
	if existing_apartment is None:
		raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Apartment not found")
	return existing_apartment


#POST Apartment
@router.post("/", response_model=ApartmentCreate)
def create_apartment_endpoint(apartment: ApartmentCreate,
                              db: Session = Depends(get_db),
                              _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_apartment = get_apartment_by_number(db, apartment.number, apartment.building_id)
	if existing_apartment:
		raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST, detail = "Apartment already exists")
	return create_apartment(db, apartment)


#PUT Apartment
@router.patch("/{id}", response_model=ApartmentUpdate)
def update_apartment_endpoint(apartment_id: int, apartment: ApartmentUpdate, db: Session = Depends(get_db),
                              _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_apartment = get_apartment_by_id(db, apartment_id)
	if not existing_apartment:
		raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Apartment not found")
	updated_data = update_apartment(db, apartment_id, apartment)
	return updated_data


#DELETE Apartment
@router.delete("/{id}", response_model=ApartmentResponse)
def delete_apartment_endpoint(apartment_id: int, db: Session = Depends(get_db),
                              _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_apartment = get_apartment_by_id(db, apartment_id)
	if not existing_apartment:
		raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = "Apartment not found")
	delete_apartment(db, existing_apartment)
	return existing_apartment
