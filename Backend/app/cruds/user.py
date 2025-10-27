from datetime import datetime

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models import Role, StatusOfUser, User
from app.schemas import UserCreate, UserUpdate, UserUpdatePassword, UserUpdateRole, UserUpdateStatus

#Hashing Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)



#GET all Users
def get_users(db: Session):
    return db.query(User).all()

#GET User by ID
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

#GET User by Email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

#GET User by phone number
def get_user_by_phone_number(db: Session, phone: str):
    return db.query(User).filter(User.phone_number == phone).first()


#-----------------------------------------------------------------------


#POST new User
def create_user(db: Session, user: UserCreate):
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        date_of_birth=user.date_of_birth,
        phone_number=user.phone_number,
        city = user.city,
        avatar_url = user.avatar_url,
        is_active = user.is_active,
        created_at = datetime.now(),
        status_of_user = StatusOfUser.bronze,
        role = Role.consumer,
        password = hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


#-----------------------------------------------------------------------


#PUT the User
def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

#PATCH User password
def update_user_password(db: Session, user_id: int, password: UserUpdatePassword):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None

    if not pwd_context.verify (password.old_password, db_user.password):
        return "wrong_old_password"

    if password.new_password != password.confirm_password:
        return "passwords_dont_match"

    db_user.password = hash_password (password.new_password)

    db.commit()
    db.refresh(db_user)
    return db_user

#PATCH User status
def update_user_status(db: Session, user_id: int, status: UserUpdateStatus):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    db_user.status_of_user = status.status
    db.commit()
    db.refresh(db_user)
    return db_user

#PATCH User role
def update_user_role(db: Session, user_id: int, role: UserUpdateRole):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    db_user.role = role.role
    db.commit()
    db.refresh(db_user)
    return db_user

#-----------------------------------------------------------------------


#DELETE User
def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        return None

    db.delete(db_user)
    db.commit()
    return True





