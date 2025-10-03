from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_role
from app.cruds.user import create_user, delete_user, get_user_by_email, get_user_by_id, get_user_by_phone_number, \
    get_users, \
    update_user, update_user_password, update_user_role, update_user_status
from app.database import get_db
from app.models import Role, User
from app.schemas import UserCreate, UserResponse, UserUpdate, UserUpdatePassword, UserUpdateRole, UserUpdateStatus

router = APIRouter()

#GET Routers
@router.get("/", response_model=List[UserResponse])
def get_user_endpoint(db: Session = Depends(get_db)):
    users = get_users(db)
    return users

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_endpoint(user_id: int,
                      db: Session = Depends(get_db),
                      _: User = Depends(require_role([Role.admin, Role.manager]))):
    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_email}", response_model=UserResponse)
def get_user_by_email_endpoint(email: str, db: Session = Depends(get_db),
                               _: User = Depends(require_role([Role.admin, Role.manager]))):
    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_phone}", response_model=UserResponse)
def get_user_by_phone_endpoint(phone: str, db: Session = Depends(get_db),
                               _: User = Depends(require_role([Role.admin, Role.manager]))):
    user = get_user_by_phone_number(db, phone)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


#------------------------------------------------------------------------------

#POST Routers
@router.post("/", response_model=UserCreate)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_phone = get_user_by_phone_number(db, user.phone_number)
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone already registered")

    return create_user(db, user)

#------------------------------------------------------------------------------

#PUT Routers
@router.put("/{user_id}", response_model=UserResponse)
def update_user_endpoint(user_id: int, user: UserUpdate, db: Session = Depends(get_db),
                         _: User = Depends(get_current_user)):
    existing_user = get_user_by_id(db, user_id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.phone_number:
        existing_phone = get_user_by_phone_number(db, user.phone_number)
        if existing_phone and existing_phone.id != user_id:
            raise HTTPException(status_code=400, detail="Phone already registered")
    updated_user = update_user(db, user_id, user)
    return updated_user

@router.patch("/{user_id}/status", response_model=UserResponse)
def update_user_status_endpoint(user_id: int, status: UserUpdateStatus, db: Session = Depends(get_db)):
    existing_user = get_user_by_id(db, user_id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = update_user_status(db, user_id, status)
    return updated_user

@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role_endpoint(user_id: int, role: UserUpdateRole, db: Session = Depends(get_db),
                              _: User = Depends(require_role([Role.admin]))
                              ):
    existing_user = get_user_by_id(db, user_id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = update_user_role(db, user_id, role)
    return updated_user

@router.patch("/{user_id}/password", response_model=UserResponse)
def update_user_password_endpoint(user_id: int, password: UserUpdatePassword, db: Session = Depends(get_db),
                                  _: User = Depends(get_current_user)):
    existing_user = get_user_by_id(db, user_id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = update_user_password (db, user_id, password)
    if updated_user is None:
        raise HTTPException (status_code = 404, detail = "User not found")
    elif updated_user == "wrong_old_password":
        raise HTTPException (status_code = 400, detail = "Incorrect old password")
    elif updated_user == "passwords_dont_match":
        raise HTTPException (status_code = 400, detail = "New passwords do not match")
    return updated_user

#------------------------------------------------------------------------------

#DELETE Routers
@router.delete("/{user_id}", response_model=UserResponse)
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db),
                         _: User = Depends(require_role([Role.admin]))):
    existing_user = get_user_by_id(db, user_id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    delete_user(db, existing_user.id)
    return existing_user











