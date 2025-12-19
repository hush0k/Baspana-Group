from datetime import date
from typing import Optional
from sqlalchemy.orm import Session
from app.models import Promotion, ApartmentType
from app.schemas import PromotionCreate, PromotionUpdate


def get_promotion_by_id(db: Session, promotion_id: int):
    return db.query(Promotion).filter(Promotion.id == promotion_id).first()


def get_promotions_filtered(
    db: Session,
    residential_complex_id: Optional[int] = None,
    apartment_type: Optional[ApartmentType] = None,
    is_active: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
):
    query = db.query(Promotion)

    if residential_complex_id is not None:
        query = query.filter(Promotion.residential_complex_id == residential_complex_id)

    if apartment_type is not None:
        query = query.filter(Promotion.apartment_type == apartment_type)

    if is_active is not None:
        query = query.filter(Promotion.is_active == is_active)

    total = query.count()
    promotions = query.offset(offset).limit(limit).all()

    return {"total": total, "results": promotions}


def get_active_promotions_for_apartment(
    db: Session,
    residential_complex_id: int,
    apartment_type: ApartmentType,
):
    today = date.today()

    return db.query(Promotion).filter(
        Promotion.is_active == True,
        Promotion.start_date <= today,
        Promotion.end_date >= today,
        Promotion.residential_complex_id == residential_complex_id,
        (
            (Promotion.apartment_type == apartment_type) |
            (Promotion.apartment_type == None)
        )
    ).order_by(Promotion.discount_percentage.desc()).first()


def create_promotion(db: Session, promotion: PromotionCreate):
    db_promotion = Promotion(**promotion.dict())
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)
    return db_promotion


def update_promotion(db: Session, promotion_id: int, promotion: PromotionUpdate):
    db_promotion = get_promotion_by_id(db, promotion_id)
    if not db_promotion:
        return None

    update_data = promotion.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_promotion, key, value)

    db.commit()
    db.refresh(db_promotion)
    return db_promotion


def delete_promotion(db: Session, db_promotion: Promotion):
    db.delete(db_promotion)
    db.commit()
    return db_promotion
