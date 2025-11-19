import os
from datetime import datetime, timedelta
from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from jose.jwt import decode
from sqlalchemy.orm import Session
from typing_extensions import Annotated

from app.cruds.user import get_user_by_id
from app.database import get_db
from app.models import Role, User

security = HTTPBearer()
Token = Annotated[HTTPAuthorizationCredentials, Depends(security)]


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("JWT_ALGORITHM")
    )
    return encoded_jwt


def verify_token(token, key):
    try:
        payload = decode(token, key, algorithms=[os.getenv("JWT_ALGORITHM")])
        user_id: int = payload["sub"]
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


def get_current_user(token: Token, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        user_id = verify_token(token.credentials, os.getenv("SECRET_KEY"))
        user = get_user_by_id(db, user_id)

        if not user:
            raise credentials_exception

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        return user
    except JWTError:
        raise credentials_exception


def require_role(allowed_roles: List[Role]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )
        return current_user

    return role_checker
