from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models import Building, BuildingClass, BuildingStatus, City, MaterialType, ResidentialComplex
from app.schemas import ResidentialComplexCreate, ResidentialComplexUpdate


#GET Residential Complex
def get_residential_complexes_filtered(
		db: Session,
		city: City = None,
		building_class: BuildingClass = None,
		building_status: BuildingStatus = None,
		material: MaterialType = None,
		has_security: bool = None,
		min_apartment_area: float = None,
		max_apartment_area: float = None,
		search: str = None,
		sort_by: str = "name",
		order: str = "asc",
		limit: int = 100,
		offset: int = 0,
):
	query = db.query(ResidentialComplex)

	if city:
		query = query.filter(ResidentialComplex.city == city)
	if building_class:
		query = query.filter(ResidentialComplex.building_class == building_class)
	if building_status:
		query = query.filter(ResidentialComplex.building_status == building_status)
	if material:
		query = query.filter(ResidentialComplex.material == material)
	if has_security is not None:
		query = query.filter(ResidentialComplex.has_security == has_security)
	if min_apartment_area:
		query = query.filter(ResidentialComplex.apartment_area >= min_apartment_area)
	if max_apartment_area:
		query = query.filter(ResidentialComplex.apartment_area <= max_apartment_area)

	if search:
		query = query.filter(
			(ResidentialComplex.name.ilike(f"%{search}%")) |
			(ResidentialComplex.description.ilike(f"%{search}%"))
		)

	if hasattr(ResidentialComplex, sort_by):
		if order == "desc":
			query = query.order_by(desc(getattr(ResidentialComplex, sort_by)))
		else:
			query = query.order_by(asc(getattr(ResidentialComplex, sort_by)))

	total = query.count()
	results = query.offset(offset).limit(limit).all()

	return {"total": total, "results": results, "limit": limit, "offset": offset}



def get_residential_complex_by_id(db: Session, rdc_id: int):
	return db.query(ResidentialComplex).filter(ResidentialComplex.id == rdc_id).first()

def get_residential_complex_by_name(db: Session, name: str):
	return db.query(ResidentialComplex).filter(ResidentialComplex.name == name).first()


#POST Residential Complex
def create_residential_complex(db: Session, residential_complex: ResidentialComplexCreate):
	db_complex = ResidentialComplex(
		name=residential_complex.name,
		description=residential_complex.description,
		block_counts = residential_complex.block_counts,
		playground_area = residential_complex.playground_area,
		apartment_area = residential_complex.apartment_area,
		commercial_area = residential_complex.commercial_area,
		parking_area = residential_complex.parking_area,
		landing_area = residential_complex.landing_area,
		material = residential_complex.material,
		city = residential_complex.city,
		address = residential_complex.address,
		longitude = residential_complex.longitude,
		latitude = residential_complex.latitude,

		has_security = residential_complex.has_security,
		building_status = residential_complex.building_status,
		building_class = residential_complex.building_class
	)

	db.add(db_complex)
	db.commit()
	db.refresh(db_complex)
	return db_complex


#PUT/PATCH Residential Complex
def update_residential_complex(db: Session, residential_id: int,  complex_update: ResidentialComplexUpdate):
	db_complex = db.query(ResidentialComplex).filter(ResidentialComplex.id == residential_id).first()

	if not db_complex:
		return None
	update_data = complex_update.model_dump(exclude_unset = True)

	for field, value in update_data.items():
		setattr(db_complex, field, value)

	db.commit()
	db.refresh(db_complex)
	return db_complex


#DELETE Residential Complex
def delete_residential_complex(db: Session, residential_id: int):
	db_complex = db.query(ResidentialComplex).filter(ResidentialComplex.id == residential_id).first()

	if not db_complex:
		return None

	db.delete(db_complex)
	db.commit()
	return True


