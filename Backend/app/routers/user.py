from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..schemas import UserCreate, UserUpdate, UserBase as UserSchema, UserResponse
from ..models import StatusOfUser, Role, User
from ..database import get_db
from ..cruds.users import (
    get_user, get_users,
    create_user,
    update_user,
    delete_user,
    update_user_status,
    update_user_role,
    search_users,
    get_users_by_city,
    get_users_by_role
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserSchema)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserSchema)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = create_user(db, user)
    return db_user


@router.put("/{user_id}", response_model=UserSchema)
def update_existing_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    updated_user = update_user(db, user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/{user_id}", response_model=dict)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.patch("/{user_id}/status", response_model=UserSchema)
def change_user_status(user_id: int, new_status: StatusOfUser, db: Session = Depends(get_db)):
    updated_user = update_user_status(db, user_id, new_status)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.patch("/{user_id}/role", response_model=UserSchema)
def change_user_role(user_id: int, new_role: Role, db: Session = Depends(get_db)):
    updated_user = update_user_role(db, user_id, new_role)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.get("/search/", response_model=List[UserSchema])
def search_for_users(query: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return search_users(db, query, skip=skip, limit=limit)


@router.get("/by_city/", response_model=List[UserSchema])
def get_users_in_city(city: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users_by_city(db, city, skip=skip, limit=limit)


@router.get("/by_role/", response_model=List[UserSchema])
def get_users_with_role(role: Role, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_users_by_role(db, role, skip=skip, limit=limit)
