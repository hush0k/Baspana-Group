from datetime import date

from sqlalchemy import asc, desc
from sqlalchemy.orm import Query, Session

from app.models import Building, BuildingStatus
from app.schemas import BuildingCreate, BuildingUpdate


def _apply_building_filters(
		query: Query,
		complex_id: int = None,
		min_floor: int = None,
		max_floor: int = None,
		floor: int = None,
		min_apartments_count: int = None,
		max_apartments_count: int = None,
		min_commercials_count: int = None,
		max_commercials_count: int = None,
		min_parking_count: int = None,
		max_parking_count: int = None,
		min_gross_area: int = None,
		max_gross_area: int = None,
		min_elevators_count: int = None,
		max_elevators_count: int = None,
		building_status: BuildingStatus = None,
		construction_start: date = None,
		construction_end: date = None,
) -> Query:
	if complex_id:
		query = query.filter(Building.residential_complex_id == complex_id)
	if min_floor:
		query = query.filter(Building.floor_count >= min_floor)
	if max_floor:
		query = query.filter(Building.floor_count <= max_floor)
	if floor:
		query = query.filter(Building.floor_count == floor)
	if min_apartments_count:
		query = query.filter(Building.apartments_count >= min_apartments_count)
	if max_apartments_count:
		query = query.filter(Building.apartments_count <= max_apartments_count)
	if min_commercials_count:
		query = query.filter(Building.commercials_count >= min_commercials_count)
	if max_commercials_count:
		query = query.filter(Building.commercials_count <= max_commercials_count)
	if min_parking_count:
		query = query.filter(Building.parking_count >= min_parking_count)
	if max_parking_count:
		query = query.filter(Building.parking_count <= max_parking_count)
	if min_gross_area:
		query = query.filter(Building.gross_area >= min_gross_area)
	if max_gross_area:
		query = query.filter(Building.gross_area <= max_gross_area)
	if min_elevators_count:
		query = query.filter(Building.elevators_count >= min_elevators_count)
	if max_elevators_count:
		query = query.filter(Building.elevators_count <= max_elevators_count)
	if building_status:
		query = query.filter(Building.status == building_status)
	if construction_start:
		query = query.filter(Building.construction_start >= construction_start)
	if construction_end:
		query = query.filter(Building.construction_end <= construction_end)

	return query


def _apply_building_sorting(
		query: Query,
		order_by: str = "asc",
        sort_by: str = "construction_end",
) -> Query:
	if hasattr(Building, sort_by):
		if order_by == "desc":
			query = query.order_by(desc(getattr(Building, sort_by)))
		else:
			query = query.order_by(asc(getattr(Building, sort_by)))

	return query



#GET Buildings
def get_buildings_filtered (
		db: Session,
		complex_id: int = None,
		min_floor: int = None,
		max_floor: int = None,
		floor: int = None,
		min_apartments_count: int = None,
		max_apartments_count: int = None,
		min_commercials_count: int = None,
		max_commercials_count: int = None,
		min_parking_count: int = None,
		max_parking_count: int = None,
		min_gross_area: int = None,
		max_gross_area: int = None,
		min_elevators_count: int = None,
		max_elevators_count: int = None,
		building_status: BuildingStatus = None,
		construction_start: date = None,
		construction_end: date = None,
		order_by: str = "asc",
		sort_by: str = "construction_end",
		limit: int = 100,
		offset: int = 0,
):

	query = db.query (Building)

	query = _apply_building_filters (
		query = query,
		complex_id = complex_id,
		min_floor = min_floor,
		max_floor = max_floor,
		floor = floor,
		min_apartments_count = min_apartments_count,
		max_apartments_count = max_apartments_count,
		min_commercials_count = min_commercials_count,
		max_commercials_count = max_commercials_count,
		min_parking_count = min_parking_count,
		max_parking_count = max_parking_count,
		min_gross_area = min_gross_area,
		max_gross_area = max_gross_area,
		min_elevators_count = min_elevators_count,
		max_elevators_count = max_elevators_count,
		building_status = building_status,
		construction_start = construction_start,
		construction_end = construction_end,
	)

	query = _apply_building_sorting (query, sort_by, order_by)

	total = query.count ()
	results = query.offset (offset).limit (limit).all ()

	return {
		"total": total,
		"results": results,
		"limit": limit,
		"offset": offset
	}



def get_building_by_id(db: Session, building_id: int):
	return db.query(Building).filter(Building.id == building_id).first()


#POST Buildings
def create_building(db: Session, building: BuildingCreate):
	new_building = Building(
		residential_complex_id=building.residential_complex_id,
		block = building.block,
		description = building.description,
		floor_count = building.floor_count,
		apartments_count = building.apartments_count,
		commercials_count = building.commercials_count,
		parking_count = building.parking_count,
		gross_area = building.gross_area,
		elevators_count = building.elevators_count,
		status = building.status,
		construction_start = building.construction_start,
		construction_end = building.construction_end,
	)

	db.add(new_building)
	db.commit()
	db.refresh(new_building)
	return new_building


#PUT Building
def update_building(db: Session, building_id: int, building_update: BuildingUpdate):
	db_building = db.query(Building).filter(Building.id == building_id).first()

	if not db_building:
		return None

	update_data = building_update.model_dump(exclude_unset = True)

	for field, value in update_data.items():
		setattr(db_building, field, value)

	db.commit()
	db.refresh(db_building)
	return db_building


#DELETE Building
def delete_building(db: Session, building_id: int):
	db_building = db.query(Building).filter(Building.id == building_id).first()
	if not db_building:
		return None

	db.delete(db_building)
	db.commit()
	return True



