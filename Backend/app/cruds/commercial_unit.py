from decimal import Decimal
from http import HTTPStatus

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import CommercialUnit, Direction, FinishingType, PropertyStatus
from app.schemas import CommercialUnitCreate, CommercialUnitUpdate


#GET Commercials
def get_commercials_filtered(db: Session,
                            min_floor: int = None,
                            max_floor: int = None,
                            min_space_area: Decimal = None,
                            max_space_area: Decimal = None,
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
	query = db.query(CommercialUnit)

	if min_floor is not None:
		query = query.filter (CommercialUnit.floor >= min_floor)
	if max_floor is not None:
		query = query.filter (CommercialUnit.floor <= max_floor)
	if min_space_area is not None:
		query = query.filter (CommercialUnit.space_area >= min_space_area)
	if max_space_area is not None:
		query = query.filter (CommercialUnit.space_area <= max_space_area)
	if min_ceiling_height is not None:
		query = query.filter (CommercialUnit.ceiling_height >= min_ceiling_height)
	if max_ceiling_height is not None:
		query = query.filter (CommercialUnit.ceiling_height <= max_ceiling_height)
	if finishing_type is not None:
		query = query.filter (CommercialUnit.finishing_type == finishing_type)
	if min_per_sqr is not None:
		query = query.filter (CommercialUnit.price_per_sqr >= min_per_sqr)
	if max_per_sqr is not None:
		query = query.filter (CommercialUnit.price_per_sqr <= max_per_sqr)
	if min_total_price is not None:
		query = query.filter (CommercialUnit.total_price >= min_total_price)
	if max_total_price is not None:
		query = query.filter (CommercialUnit.total_price <= max_total_price)
	if status is not None:
		query = query.filter (CommercialUnit.status == status)
	if orientation is not None:
		query = query.filter (CommercialUnit.orientation == orientation)
	if isCorner is not None:
		query = query.filter (CommercialUnit.isCorner == isCorner)

	if hasattr (CommercialUnit, sort_by):
		sort_column = getattr (CommercialUnit, sort_by)
		query = query.order_by (sort_column.desc () if order_by == "desc" else sort_column.asc ())

	total = query.count()
	results = query.offset(offset).limit(limit).all()

	return {"total": total, "results": results, "limit": limit, "offset": offset}

def get_commercial_by_id(db: Session, commercial_id: int):
	return db.query(CommercialUnit).filter(CommercialUnit.id == commercial_id).first()

def get_commercial_by_number(db: Session, number: int, building_id: int):
	return db.query(CommercialUnit).filter(CommercialUnit.number == number).filter(CommercialUnit.building_id == building_id).first()



#POST CommercialUnit
def create_commercial(db: Session, commercialUnit: CommercialUnitCreate):
	if commercialUnit.total_price is None:
		total_price = commercialUnit.price_per_sqr * commercialUnit.space_area
	else:
		calculated_price = commercialUnit.price_per_sqr * commercialUnit.space_area
		min_price = calculated_price * Decimal(0.6)
		max_price = calculated_price * Decimal(2)

		if commercialUnit.total_price <= min_price or commercialUnit.total_price >= max_price:
			raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"CommercialUnit price must in range {min_price} to {max_price}")

		total_price = commercialUnit.total_price



	new_commercial = CommercialUnit(
		building_id = commercialUnit.building_id,
		number = commercialUnit.number,
		floor = commercialUnit.floor,
		space_area = commercialUnit.space_area,
		ceiling_height = commercialUnit.ceiling_height,
		finishing_type = commercialUnit.finishing_type,
		price_per_sqr = commercialUnit.price_per_sqr,
		total_price = total_price,
		status = commercialUnit.status,
		orientation = commercialUnit.orientation,
		isCorner = commercialUnit.isCorner,
	)

	db.add(new_commercial)
	db.commit()
	db.refresh(new_commercial)
	return new_commercial


def update_commercial(db: Session, commercial_id: int, commercial_update: CommercialUnitUpdate):
	db_commercial = get_commercial_by_id(db, commercial_id)
	if not db_commercial:
		return None

	updated_data = commercial_update.model_dump(exclude_unset = True)
	for field, value in updated_data.items():
		setattr(db_commercial, field, value)

	db.commit()
	db.refresh(db_commercial)
	return db_commercial


def delete_commercial(db: Session, commercial_id: int):
	db_commercial = get_commercial_by_id(db, commercial_id)
	if not db_commercial:
		return None

	db.delete(db_commercial)
	db.commit()
	return True







