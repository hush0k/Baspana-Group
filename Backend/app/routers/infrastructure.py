from typing import List

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.infrastructure import (
    create_infrastructure,
    delete_infrastructure,
    get_infrastructure_by_id,
    get_infrastructures_by_complex,
    update_infrastructure,
)
from app.database import get_db
from app.models import Role, User
from app.schemas import (
    InfrastructureCreate,
    InfrastructureResponse,
    InfrastructureUpdate,
)

router = APIRouter()


# GET Infrastructure by Complex
@router.get("/complex/{complex_id}", response_model=List[InfrastructureResponse])
def get_infrastructures_by_complex_endpoint(
    complex_id: int, db: Session = Depends(get_db)
):
    """Получить всю инфраструктуру для конкретного жилого комплекса"""
    return get_infrastructures_by_complex(db, complex_id)


# GET Infrastructure by ID
@router.get("/{infrastructure_id}", response_model=InfrastructureResponse)
def get_infrastructure_by_id_endpoint(
    infrastructure_id: int, db: Session = Depends(get_db)
):
    """Получить конкретный объект инфраструктуры по ID"""
    infrastructure = get_infrastructure_by_id(db, infrastructure_id)
    if infrastructure is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Infrastructure not found",
        )
    return infrastructure


# POST Infrastructure
@router.post("/", response_model=InfrastructureResponse)
def create_infrastructure_endpoint(
    infrastructure: InfrastructureCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    """Создать новый объект инфраструктуры"""
    return create_infrastructure(db, infrastructure)


# PATCH Infrastructure
@router.patch("/{infrastructure_id}", response_model=InfrastructureResponse)
def update_infrastructure_endpoint(
    infrastructure_id: int,
    infrastructure: InfrastructureUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    """Обновить объект инфраструктуры"""
    existing_infrastructure = get_infrastructure_by_id(db, infrastructure_id)
    if existing_infrastructure is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Infrastructure not found",
        )
    return update_infrastructure(db, infrastructure_id, infrastructure)


# DELETE Infrastructure
@router.delete("/{infrastructure_id}", response_model=InfrastructureResponse)
def delete_infrastructure_endpoint(
    infrastructure_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    """Удалить объект инфраструктуры"""
    existing_infrastructure = get_infrastructure_by_id(db, infrastructure_id)
    if existing_infrastructure is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Infrastructure not found",
        )
    return delete_infrastructure(db, infrastructure_id)
