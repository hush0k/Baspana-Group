from sqlalchemy.orm import Session

from app.models import Building, BuildingClass, BuildingStatus, City, MaterialType, ResidentialComplex
from app.schemas import ResidentialComplexCreate, ResidentialComplexUpdate


#GET Residential Complex
def get_residential_complexes(db: Session):
	return db.query(ResidentialComplex).all()

def get_residential_complex_by_class(db: Session, building_class: BuildingClass):
	return db.query(ResidentialComplex).filter(ResidentialComplex.building_class == building_class).all()

def get_residential_complex_by_status(db: Session, status: BuildingStatus):
	return db.query(ResidentialComplex).filter(ResidentialComplex.building_status == status).all()

def get_residential_complex_by_city(db: Session, city: City):
	return db.query(ResidentialComplex).filter(ResidentialComplex.city == city).all()

def get_residential_complex_by_material(db: Session, material: MaterialType):
	return db.query(ResidentialComplex).filter(ResidentialComplex.material == material).all()

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
def update_residential_complex(db: Session, residential_id: int,  db_complex: ResidentialComplexUpdate):
	db_complex = db.query(ResidentialComplex).filter(ResidentialComplex.id == residential_id).first()

	if not db_complex:
		return None

	update_data = db_complex.model_dump(exclude_unset = True)

	for field, value in update_data.items():
		setattr(db_complex, field, value)

	db.commit()
	db.refresh(db_complex)
	return db_complex


#DELETE Residential Complex
def delete_residential_complex(db: Session, residential_id: int):
	db_complex = db.query(ResidentialComplex).filter(ResidentialComplex.id == residential_id).first()

	if not residential_id:
		return None

	db.delete(db_complex)
	db.commit()
	return True


