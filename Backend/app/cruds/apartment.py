from decimal import Decimal
from http import HTTPStatus

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Apartment, ApartmentType, Direction, FinishingType, PropertyStatus
from app.schemas import ApartmentCreate, ApartmentUpdate


#GET Apartment
def get_apartments_filtered(db: Session,
                            min_floor: int = None,
                            max_floor: int = None,
                            min_apartment_area: Decimal = None,
                            max_apartment_area: Decimal = None,
                            apartment_type: ApartmentType = None,
                            has_balcony: bool = None,
                            bathroom_count: int = None,
                            min_kitchen_area: Decimal = None,
                            max_kitchen_area: Decimal = None,
                            min_ceiling_height: Decimal = None,
                            max_ceiling_height: Decimal = None,
                            finishing_type: FinishingType = None,
                            min_per_sqr: Decimal = None,
                            max_per_sqr: Decimal = None,
                            min_total_price: Decimal = None,
                            max_total_price: Decimal = None,
                            status: PropertyStatus = None,
                            orientation: Direction = None,
                            isCorner: bool = None,
                            order_by: str = "asc",
                            sort_by: str = "floor",
                            limit: int = 100,
                            offset: int = 0
):
	query = db.query(Apartment)

	if min_floor is not None:
		query = query.filter (Apartment.floor >= min_floor)
	if max_floor is not None:
		query = query.filter (Apartment.floor <= max_floor)
	if min_apartment_area is not None:
		query = query.filter (Apartment.apartment_area >= min_apartment_area)
	if max_apartment_area is not None:
		query = query.filter (Apartment.apartment_area <= max_apartment_area)
	if apartment_type is not None:
		query = query.filter (Apartment.apartment_type == apartment_type)
	if has_balcony is not None:
		query = query.filter (Apartment.has_balcony == has_balcony)
	if bathroom_count is not None:
		query = query.filter (Apartment.bathroom_count == bathroom_count)
	if min_kitchen_area is not None:
		query = query.filter (Apartment.kitchen_area >= min_kitchen_area)
	if max_kitchen_area is not None:
		query = query.filter (Apartment.kitchen_area <= max_kitchen_area)
	if min_ceiling_height is not None:
		query = query.filter (Apartment.ceiling_height >= min_ceiling_height)
	if max_ceiling_height is not None:
		query = query.filter (Apartment.ceiling_height <= max_ceiling_height)
	if finishing_type is not None:
		query = query.filter (Apartment.finishing_type == finishing_type)
	if min_per_sqr is not None:
		query = query.filter (Apartment.price_per_sqr >= min_per_sqr)
	if max_per_sqr is not None:
		query = query.filter (Apartment.price_per_sqr <= max_per_sqr)
	if min_total_price is not None:
		query = query.filter (Apartment.total_price >= min_total_price)
	if max_total_price is not None:
		query = query.filter (Apartment.total_price <= max_total_price)
	if status is not None:
		query = query.filter (Apartment.status == status)
	if orientation is not None:
		query = query.filter (Apartment.orientation == orientation)
	if isCorner is not None:
		query = query.filter (Apartment.isCorner == isCorner)

	if hasattr (Apartment, sort_by):
		sort_column = getattr (Apartment, sort_by)
		query = query.order_by (sort_column.desc () if order_by == "desc" else sort_column.asc ())

	total = query.count()
	results = query.offset(offset).limit(limit).all()

	return {"total": total, "results": results, "limit": limit, "offset": offset}

def get_apartment_by_id(db: Session, apartment_id: int):
	return db.query(Apartment).filter(Apartment.id == apartment_id).first()

def get_apartment_by_number(db: Session, number: int, building_id: int):
	return db.query(Apartment).filter(Apartment.number == number).filter(Apartment.building_id == building_id).first()



#POST Apartment
def create_apartment(db: Session, apartment: ApartmentCreate):
	if apartment.total_price is None:
		total_price = apartment.price_per_sqr * apartment.apartment_area
	else:
		calculated_price = apartment.price_per_sqr * apartment.apartment_area
		min_price = calculated_price * Decimal(0.6)
		max_price = calculated_price * Decimal(2)

		if apartment.total_price <= min_price or apartment.total_price >= max_price:
			raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Apartment price must in range {min_price} to {max_price}")

		total_price = apartment.total_price



	new_apartment = Apartment(
		building_id = apartment.building_id,
		number = apartment.number,
		floor = apartment.floor,
		apartment_area = apartment.apartment_area,
		apartment_type = apartment.apartment_type,
		has_balcony = apartment.has_balcony,
		bathroom_count = apartment.bathroom_count,
		kitchen_area = apartment.kitchen_area,
		ceiling_height = apartment.ceiling_height,
		finishing_type = apartment.finishing_type,
		price_per_sqr = apartment.price_per_sqr,
		total_price = total_price,
		status = apartment.status,
		orientation = apartment.orientation,
		isCorner = apartment.isCorner,
	)

	db.add(new_apartment)
	db.commit()
	db.refresh(new_apartment)
	return new_apartment


def update_apartment(db: Session, apartment_id: int, apartment_update: ApartmentUpdate):
	db_apartment = get_apartment_by_id(db, apartment_id)
	if not db_apartment:
		return None

	updated_data = apartment_update.model_dump(exclude_unset = True)
	for field, value in updated_data.items():
		setattr(db_apartment, field, value)

	db.commit()
	db.refresh(db_apartment)
	return db_apartment


def delete_apartment(db: Session, apartment_id: int):
	db_apartment = get_apartment_by_id(db, apartment_id)
	if not db_apartment:
		return None

	db.delete(db_apartment)
	db.commit()
	return True





