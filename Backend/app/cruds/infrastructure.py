from typing import List

from sqlalchemy.orm import Session

from app.models import Infrastructure
from app.schemas import InfrastructureCreate, InfrastructureUpdate


def get_infrastructures_by_complex(
    db: Session, residential_complex_id: int
) -> List[Infrastructure]:
    """Получить всю инфраструктуру для конкретного жилого комплекса"""
    return (
        db.query(Infrastructure)
        .filter(Infrastructure.residential_complex_id == residential_complex_id)
        .all()
    )


def get_infrastructure_by_id(db: Session, infrastructure_id: int) -> Infrastructure:
    """Получить конкретный объект инфраструктуры по ID"""
    return (
        db.query(Infrastructure).filter(Infrastructure.id == infrastructure_id).first()
    )


def create_infrastructure(
    db: Session, infrastructure: InfrastructureCreate
) -> Infrastructure:
    """Создать новый объект инфраструктуры"""
    db_infrastructure = Infrastructure(**infrastructure.model_dump())
    db.add(db_infrastructure)
    db.commit()
    db.refresh(db_infrastructure)
    return db_infrastructure


def update_infrastructure(
    db: Session, infrastructure_id: int, infrastructure: InfrastructureUpdate
) -> Infrastructure:
    """Обновить объект инфраструктуры"""
    db_infrastructure = get_infrastructure_by_id(db, infrastructure_id)
    if db_infrastructure:
        update_data = infrastructure.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_infrastructure, key, value)
        db.commit()
        db.refresh(db_infrastructure)
    return db_infrastructure


def delete_infrastructure(db: Session, infrastructure_id: int) -> Infrastructure:
    """Удалить объект инфраструктуры"""
    db_infrastructure = get_infrastructure_by_id(db, infrastructure_id)
    if db_infrastructure:
        db.delete(db_infrastructure)
        db.commit()
    return db_infrastructure
