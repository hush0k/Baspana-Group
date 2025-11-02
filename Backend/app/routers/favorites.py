# Backend/app/routers/favorites.py
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.cruds.favorites import create_favorite, delete_favorite, get_favorite_by_id, get_favorites_filtered
from app.database import get_db
from app.models import ApartmentType, Direction, FinishingType, ObjectType, PropertyStatus, User
from app.schemas import FavoriteCreate, FavoriteResponse, PaginatedFavoriteResponse

router = APIRouter ()


# GET все избранные с фильтрами
@router.get ("/", response_model = PaginatedFavoriteResponse)
def get_my_favorites_endpoint (
		object_type: Optional[ObjectType] = None,
		sorting_by_date: str = "desc",
		# Фильтры для апартментов
		min_floor: Optional[int] = None,
		max_floor: Optional[int] = None,
		min_apartment_area: Optional[Decimal] = None,
		max_apartment_area: Optional[Decimal] = None,
		apartment_type: Optional[ApartmentType] = None,
		has_balcony: Optional[bool] = None,
		bathroom_count: Optional[int] = None,
		min_kitchen_area: Optional[Decimal] = None,
		max_kitchen_area: Optional[Decimal] = None,
		# Фильтры для коммерции
		min_space_area: Optional[Decimal] = None,
		max_space_area: Optional[Decimal] = None,
		# Общие фильтры
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
		current_user: User = Depends (get_current_user),
		db: Session = Depends (get_db)
):

	return get_favorites_filtered (
		db = db,
		user_id = current_user.id,
		object_type = object_type,
		sorting_by_date = sorting_by_date,
		min_floor = min_floor,
		max_floor = max_floor,
		min_apartment_area = min_apartment_area,
		max_apartment_area = max_apartment_area,
		min_space_area = min_space_area,
		max_space_area = max_space_area,
		apartment_type = apartment_type,
		has_balcony = has_balcony,
		bathroom_count = bathroom_count,
		min_kitchen_area = min_kitchen_area,
		max_kitchen_area = max_kitchen_area,
		min_ceiling_height = min_ceiling_height,
		max_ceiling_height = max_ceiling_height,
		finishing_type = finishing_type,
		min_per_sqr = min_per_sqr,
		max_per_sqr = max_per_sqr,
		min_total_price = min_total_price,
		max_total_price = max_total_price,
		status = status,
		orientation = orientation,
		isCorner = isCorner,
		limit = limit,
		offset = offset
	)


@router.get ("/{favorite_id}", response_model = FavoriteResponse)
def get_favorite_endpoint (
		favorite_id: int,
		current_user: User = Depends (get_current_user),
		db: Session = Depends (get_db)
):

	favorite = get_favorite_by_id (db, favorite_id)

	if not favorite:
		raise HTTPException (
			status_code = status.HTTP_404_NOT_FOUND,
			detail = "Favorite not found"
		)

	if favorite.user_id != current_user.id:
		raise HTTPException (
			status_code = status.HTTP_403_FORBIDDEN,
			detail = "Not authorized to access this favorite"
		)

	return favorite


@router.post ("/", response_model = FavoriteResponse, status_code = status.HTTP_201_CREATED)
def add_to_favorites_endpoint (
		favorite: FavoriteCreate,
		current_user: User = Depends (get_current_user),
		db: Session = Depends (get_db)
):
	new_favorite = create_favorite (
		db = db,
		user_id = current_user.id,
		object_id = favorite.object_id,
		object_type = favorite.object_type
	)

	if not new_favorite:
		raise HTTPException (
			status_code = status.HTTP_400_BAD_REQUEST,
			detail = "This object is already in your favorites"
		)

	return new_favorite


@router.delete ("/{favorite_id}", status_code = status.HTTP_204_NO_CONTENT)
def remove_from_favorites_endpoint (
		favorite_id: int,
		current_user: User = Depends (get_current_user),
		db: Session = Depends (get_db)
):
	favorite = get_favorite_by_id (db, favorite_id)

	if not favorite:
		raise HTTPException (
			status_code = status.HTTP_404_NOT_FOUND,
			detail = "Favorite not found"
		)

	if favorite.user_id != current_user.id:
		raise HTTPException (
			status_code = status.HTTP_403_FORBIDDEN,
			detail = "Not authorized to delete this favorite"
		)

	delete_favorite (db, favorite_id)
	return None