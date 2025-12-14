from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.building import (
    create_building,
    delete_building,
    get_building_by_id,
    get_buildings_filtered,
    update_building,
)
from app.database import get_db
from app.models import Building, BuildingStatus, Role, User
from app.schemas import (
    BuildingCreate,
    BuildingResponse,
    BuildingUpdate,
    PaginatedBuildingResponse,
)

router = APIRouter()


# GET Building
@router.get("/", response_model=PaginatedBuildingResponse)
def get_buildings_endpoint(
    complex_id: Optional[int] = None,
    min_floor: Optional[int] = None,
    max_floor: Optional[int] = None,
    floor: Optional[int] = None,
    min_apartments_count: Optional[int] = None,
    max_apartments_count: Optional[int] = None,
    min_commercials_count: Optional[int] = None,
    max_commercials_count: Optional[int] = None,
    min_parking_count: Optional[int] = None,
    max_parking_count: Optional[int] = None,
    min_gross_area: Optional[int] = None,
    max_gross_area: Optional[int] = None,
    min_elevators_count: Optional[int] = None,
    max_elevators_count: Optional[int] = None,
    building_status: Optional[BuildingStatus] = None,
    construction_start: Optional[date] = None,
    construction_end: Optional[date] = None,
    order_by: str = "asc",
    sort_by: str = "construction_end",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_buildings_filtered(
        db=db,
        complex_id=complex_id,
        min_floor=min_floor,
        max_floor=max_floor,
        floor=floor,
        min_apartments_count=min_apartments_count,
        max_apartments_count=max_apartments_count,
        min_commercials_count=min_commercials_count,
        max_commercials_count=max_commercials_count,
        min_parking_count=min_parking_count,
        max_parking_count=max_parking_count,
        min_gross_area=min_gross_area,
        max_gross_area=max_gross_area,
        min_elevators_count=min_elevators_count,
        max_elevators_count=max_elevators_count,
        building_status=building_status,
        construction_start=construction_start,
        construction_end=construction_end,
        order_by=order_by,
        sort_by=sort_by,
        limit=limit,
        offset=offset,
    )


@router.get("/{id}", response_model=BuildingResponse)
def get_building_by_id_endpoint(id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == id).first()
    if not building:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Building not found"
        )

    return building


# POST Building
@router.post("/", response_model=BuildingCreate)
def create_building_endpoint(
    building: BuildingCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_building = (
        db.query(Building)
        .filter(
            (Building.residential_complex_id == building.residential_complex_id)
            & (Building.block == building.block)
        )
        .first()
    )
    if existing_building:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Building with this ID already exists",
        )

    return create_building(db, building)


# PUT Building
@router.patch("/{id}", response_model=BuildingUpdate)
def update_building_endpoint(
    id: int,
    building: BuildingUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_building = get_building_by_id(db, id)
    if not existing_building:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Building not found"
        )

    updated_building = update_building(db, id, building)
    return updated_building


# DELETE Building
@router.delete("/{id}", response_model=BuildingResponse)
def delete_building_endpoint(
    id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_building = get_building_by_id(db, id)
    if not existing_building:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Building not found"
        )
    delete_building(db, id)
    return existing_building
