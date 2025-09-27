from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List, Type
from datetime import date

from ..models import User, StatusOfUser, Role
from ..schemas import UserCreate, UserUpdate
from ..auth import get_password_hash


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_phone(db: Session, phone_number: str) -> Optional[User]:
    return db.query(User).filter(User.phone_number == phone_number).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[Type[User]]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user (db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash (user.password)

    db_user = User (
        first_name = user.first_name,
        last_name = user.last_name,
        email = user.email,
        date_of_birth = user.date_of_birth,
        city = user.city,
        phone_number = str (user.phone_number),
        role = Role.consumer,
        password = hashed_password,
        avatar_url = user.avatar_url,
        status_of_user = StatusOfUser.none,
        created_at = date.today (),
        updated_at = date.today ()
    )

    db.add (db_user)
    db.commit ()
    db.refresh (db_user)
    return db_user


def update_user (db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
	"""Обновить данные пользователя"""
	db_user = db.query (User).filter (User.id == user_id).first ()

	if not db_user:
		return None

	# Обновляем только переданные поля
	update_data = user_update.dict (exclude_unset = True)

	# Если обновляется пароль, хешируем его
	if "password" in update_data:
		update_data["password"] = get_password_hash (update_data["password"])

	# Конвертируем phone_number если он есть
	if "phone_number" in update_data:
		update_data["phone_number"] = str (update_data["phone_number"])

	# Обновляем дату изменения
	update_data["updated_at"] = date.today ()

	for field, value in update_data.items ():
		setattr (db_user, field, value)

	db.commit ()
	db.refresh (db_user)
	return db_user


def delete_user (db: Session, user_id: int) -> bool:
	"""Удалить пользователя"""
	db_user = db.query (User).filter (User.id == user_id).first ()

	if not db_user:
		return False

	db.delete (db_user)
	db.commit ()
	return True


def update_user_status (db: Session, user_id: int, new_status: StatusOfUser) -> Optional[User]:
	db_user = db.query (User).filter (User.id == user_id).first ()

	if not db_user:
		return None

	db_user.status_of_user = new_status
	db_user.updated_at = date.today ()

	db.commit ()
	db.refresh (db_user)
	return db_user


def update_user_role (db: Session, user_id: int, new_role: Role) -> Optional[User]:
	db_user = db.query (User).filter (User.id == user_id).first ()

	if not db_user:
		return None

	db_user.role = new_role
	db_user.updated_at = date.today ()

	db.commit ()
	db.refresh (db_user)
	return db_user


def search_users (db: Session, search_query: str, skip: int = 0, limit: int = 100) -> List[User]:
	return db.query (User).filter (
		or_ (
			User.first_name.ilike (f"%{search_query}%"),
			User.last_name.ilike (f"%{search_query}%"),
			User.email.ilike (f"%{search_query}%")
		)
	).offset (skip).limit (limit).all ()


def get_users_by_city (db: Session, city: str, skip: int = 0, limit: int = 100) -> List[User]:
	return db.query (User).filter (User.city == city).offset (skip).limit (limit).all ()


def get_users_by_role (db: Session, role: Role, skip: int = 0, limit: int = 100) -> List[User]:
	"""Получить пользователей по роли"""
	return db.query (User).filter (User.role == role).offset (skip).limit (limit).all ()