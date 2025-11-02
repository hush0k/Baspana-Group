from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.residential_complex import create_residential_complex, delete_residential_complex, \
	get_residential_complex_by_id, get_residential_complex_by_name,get_residential_complexes_filtered, \
	update_residential_complex
from app.database import get_db
from app.models import BuildingClass, BuildingStatus, City, MaterialType, Role, User
from app.schemas import PaginatedResidentialComplexResponse, ResidentialComplexCreate, ResidentialComplexResponse, \
	ResidentialComplexUpdate

router = APIRouter()

#GET Routers
@router.get("/", response_model=PaginatedResidentialComplexResponse)
def get_residential_complexes_endpoint(
	city: Optional[City] = None,
    building_class: Optional[BuildingClass] = None,
    building_status: Optional[BuildingStatus] = None,
    material: Optional[MaterialType] = None,
    has_security: Optional[bool] = None,
    min_apartment_area: Optional[float] = None,
    max_apartment_area: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: str = "name",
    order: str = "asc",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
	return get_residential_complexes_filtered (
		db = db,
		city = city,
		building_class = building_class,
		building_status = building_status,
		material = material,
		has_security = has_security,
		min_apartment_area = min_apartment_area,
		max_apartment_area = max_apartment_area,
		search = search,
		sort_by = sort_by,
		order = order,
		limit = limit,
		offset = offset
	)

@router.get("/by-id/{id}", response_model=ResidentialComplexResponse)
def get_residential_complex(id: int, db: Session = Depends(get_db)):
	residential_complex = get_residential_complex_by_id(db, id)
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
@router.patch("/{id}", response_model=ResidentialComplexUpdate)
def update_residential_complex_endpoint(complex_id: int,
                                        update_complex: ResidentialComplexUpdate,
                                        db: Session = Depends(get_db),
                                        _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_complex = get_residential_complex_by_id(db, complex_id)
	if existing_complex is None:
		raise HTTPException(status_code=400, detail="Residential complex with this ID does not exist")

	updated_complex = update_residential_complex(db, complex_id, update_complex)
	return updated_complex

#DELETE Residential Complex
@router.delete("/{id}", response_model=ResidentialComplexResponse)
def delete_residential_complex_endpoint(complex_id: int, db: Session = Depends(get_db),
                                        _: User = Depends(require_role([Role.admin, Role.manager]))):
	existing_complex = get_residential_complex_by_id(db, complex_id)
	if existing_complex is None:
		raise HTTPException(status_code=400, detail="Complex with this ID does not exist")
	delete_residential_complex(db, complex_id)
	return existing_complex

