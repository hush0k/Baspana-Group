from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds import residential_complex
from app.cruds.residential_complex import create_residential_complex, delete_residential_complex, \
	get_residential_complex_by_city, \
	get_residential_complex_by_class, \
	get_residential_complex_by_id, \
	get_residential_complex_by_material, get_residential_complex_by_name, \
	get_residential_complex_by_status, get_residential_complexes, update_residential_complex
from app.cruds.user import get_user_by_id
from app.database import get_db
from app.models import BuildingClass, BuildingStatus, City, MaterialType, Role, User
from app.schemas import ResidentialComplexCreate, ResidentialComplexResponse, ResidentialComplexUpdate

router = APIRouter()

#GET Routers
@router.get("/", response_model=List[ResidentialComplexResponse])
def get_residential_complexes_endpoint(db: Session = Depends(get_db)):
	residential_complex = get_residential_complexes(db)
	return residential_complex


@router.get ("/by-class/{building_class}", response_model = List[ResidentialComplexResponse])
def get_residential_complex_by_class_endpoint (building_class: BuildingClass, db: Session = Depends (get_db)):
	residential_complex = get_residential_complex_by_class(db, building_class)
	return residential_complex

@router.get("/by-status/{status}", response_model=List[ResidentialComplexResponse])
def get_residential_complex_by_status_endpoint(status: BuildingStatus, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_status(db, status)
	return residential_complex

@router.get("/by-city/{city}", response_model=List[ResidentialComplexResponse])
def get_residential_complex_by_city_endpoint(city: City, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_city(db, city)
	return residential_complex

@router.get("by-material/{material}", response_model=List[ResidentialComplexResponse])
def get_residential_complex_by_material_endpoint(material: MaterialType, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_material(db, material)
	return residential_complex

@router.get("/by-id/{complex_id}", response_model=ResidentialComplexResponse)
def get_residential_complex(complex_id: int, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_id(db, complex_id)
	if residential_complex is None:
		raise HTTPException(status_code=404, detail="Residential Complex not found")

	return residential_complex

@router.get("/by-name/{name}", response_model=ResidentialComplexResponse)
def get_residential_complex_by_name_endpoint(name: str, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_name(db, name)
	if residential_complex is None:
		raise HTTPException(status_code=404, detail="Residential Complex not found")

	return residential_complex


#POST Residential Complex
@router.post("/", response_model=ResidentialComplexCreate)
def create_residential_complex_endpoint(create_complex: ResidentialComplexCreate,
                                        db: Session = Depends(get_db),
                                        _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_complex = get_residential_complex_by_name(db, create_complex.name)
	if existing_complex:
		raise HTTPException(status_code=400, detail="Residential with this name already exists")

	return create_residential_complex(db, create_complex)


#PUT Residential Complex
@router.put("/{id}", response_model=ResidentialComplexUpdate)
def update_residential_complex_endpoint(complex_id: int,
                                        update_complex: ResidentialComplexUpdate,
                                        db: Session = Depends(get_db),
                                        _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_user = get_user_by_id(db, complex_id)
	if existing_user is None:
		raise HTTPException(status_code=400, detail="User with this ID does not exist")

	updated_complex = update_residential_complex(db, complex_id, update_complex)
	return updated_complex


#DELETE Residential Complex
@router.delete("/{id}", response_model=ResidentialComplexResponse)
def delete_residential_complex_endpoint(complex_id: int, db: Session = Depends(get_db),
                                        _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_user = get_residential_complex_by_id(db, complex_id)
	if existing_user is None:
		raise HTTPException(status_code=400, detail="Complex with this ID does not exist")
	delete_residential_complex(db, complex_id)
	return existing_user

