from datetime import date
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session

from app.cruds.apartment import _apply_apartment_filters
from app.cruds.commercial_unit import _apply_commercial_filters
from app.models import (
    Apartment,
    ApartmentType,
    CommercialUnit,
    Direction,
    Favorites,
    FinishingType,
    ObjectType,
    PropertyStatus,
)


# GET Favorites
def get_favorites_filtered(
    db: Session,
    user_id: int,
    object_type: Optional[ObjectType] = None,
    sorting_by_date: str = "desc",
    min_floor: Optional[int] = None,
    max_floor: Optional[int] = None,
    min_apartment_area: Optional[Decimal] = None,
    max_apartment_area: Optional[Decimal] = None,
    min_space_area: Optional[Decimal] = None,
    max_space_area: Optional[Decimal] = None,
    apartment_type: Optional[ApartmentType] = None,
    has_balcony: Optional[bool] = None,
    bathroom_count: Optional[int] = None,
    min_kitchen_area: Optional[Decimal] = None,
    max_kitchen_area: Optional[Decimal] = None,
    min_ceiling_height: Optional[Decimal] = None,
    max_ceiling_height: Optional[Decimal] = None,
    finishing_type: Optional[FinishingType] = None,
    min_per_sqr: Optional[Decimal] = None,
    max_per_sqr: Optional[Decimal] = None,
    min_total_price: Optional[Decimal] = None,
    max_total_price: Optional[Decimal] = None,
    status: Optional[PropertyStatus] = None,
    orientation: Optional[Direction] = None,
    isCorner: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
):
    query = db.query(Favorites).filter(Favorites.user_id == user_id)

    if object_type:
        query = query.filter(Favorites.object_type == object_type)

    if sorting_by_date == "desc":
        query = query.order_by(Favorites.created_at.desc())
    else:
        query = query.order_by(Favorites.created_at.asc())

    favorites = query.offset(offset).limit(limit).all()

    results = []
    for fav in favorites:
        if fav.object_type == ObjectType.apartment:
            apt_query = db.query(Apartment).filter(Apartment.id == fav.object_id)

            apt_query = _apply_apartment_filters(
                apt_query,
                min_floor=min_floor,
                max_floor=max_floor,
                min_apartment_area=min_apartment_area,
                max_apartment_area=max_apartment_area,
                apartment_type=apartment_type,
                has_balcony=has_balcony,
                bathroom_count=bathroom_count,
                min_kitchen_area=min_kitchen_area,
                max_kitchen_area=max_kitchen_area,
                min_ceiling_height=min_ceiling_height,
                max_ceiling_height=max_ceiling_height,
                finishing_type=finishing_type,
                min_per_sqr=min_per_sqr,
                max_per_sqr=max_per_sqr,
                min_total_price=min_total_price,
                max_total_price=max_total_price,
                status=status,
                orientation=orientation,
                isCorner=isCorner,
            )

            apartment = apt_query.first()
            if apartment:
                results.append(
                    {
                        "favorite_id": fav.id,
                        "object_type": fav.object_type,
                        "created_at": fav.created_at,
                        "object_data": apartment,
                    }
                )

        elif fav.object_type == ObjectType.commercial:
            com_query = db.query(CommercialUnit).filter(
                CommercialUnit.id == fav.object_id
            )

            com_query = _apply_commercial_filters(
                com_query,
                min_floor=min_floor,
                max_floor=max_floor,
                min_space_area=min_space_area,
                max_space_area=max_space_area,
                min_ceiling_height=min_ceiling_height,
                max_ceiling_height=max_ceiling_height,
                finishing_type=finishing_type,
                min_per_sqr=min_per_sqr,
                max_per_sqr=max_per_sqr,
                min_total_price=min_total_price,
                max_total_price=max_total_price,
                status=status,
                orientation=orientation,
                isCorner=isCorner,
            )

            commercial = com_query.first()
            if commercial:
                results.append(
                    {
                        "favorite_id": fav.id,
                        "object_type": fav.object_type,
                        "created_at": fav.created_at,
                        "object_data": commercial,
                    }
                )

    return {
        "total": len(results),
        "results": results,
        "limit": limit,
        "offset": offset,
    }


def get_favorite_by_id(db: Session, favorite_id: int):
    return db.query(Favorites).filter(Favorites.id == favorite_id).first()


def get_user_favorites(db: Session, user_id: int):
    return db.query(Favorites).filter(Favorites.user_id == user_id).all()


def create_favorite(db: Session, user_id: int, object_id: int, object_type: ObjectType):
    existing = (
        db.query(Favorites)
        .filter(
            Favorites.user_id == user_id,
            Favorites.object_id == object_id,
            Favorites.object_type == object_type,
        )
        .first()
    )

    if existing:
        return None

    new_favorite = Favorites(
        user_id=user_id,
        object_id=object_id,
        object_type=object_type,
        created_at=date.today(),
    )

    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite


def delete_favorite(db: Session, favorite_id: int):
    favorite = get_favorite_by_id(db, favorite_id)
    if not favorite:
        return None

    db.delete(favorite)
    db.commit()
    return True
