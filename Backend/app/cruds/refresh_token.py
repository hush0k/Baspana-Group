from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from ..models import RefreshToken, User
from ..auth import REFRESH_TOKEN_EXPIRE_DAYS, REFRESH_TOKEN_KEY


def create_refresh_token_record (db: Session, user_id: int, token: str) -> RefreshToken:
    expires_at = datetime.now () + timedelta (days = REFRESH_TOKEN_EXPIRE_DAYS)

    db_token = RefreshToken (
        user_id = user_id,
        token = token,
        expires_at = expires_at,
        is_active = True
    )

    db.add (db_token)
    db.commit ()
    db.refresh (db_token)
    return db_token


def get_refresh_token(db: Session, token: str) -> Optional[RefreshToken]:
    return db.query(RefreshToken).filter(
        RefreshToken.token == token,
        RefreshToken.is_active == True,
        RefreshToken.expires_at > datetime.now(),
        RefreshToken.revoked_at == None
    ).first()


def revoke_refresh_token (db: Session, token: str) -> bool:
	db_token = db.query (RefreshToken).filter (RefreshToken.token == token).first ()

	if not db_token:
		return False

	db_token.is_active = False
	db_token.revoked_at = datetime.utcnow ()
	db.commit ()
	return True

def revoke_all_users_tokens(db: Session, user_id: int) -> int:
	tokens = db.query(RefreshToken).filter(
		RefreshToken.user_id == user_id,
		RefreshToken.is_active == True,
	).all()

	for token in tokens:
		token.is_active = False
		token.revoked_at = datetime.now()

	db.commit()
	return len(tokens)

def get_user_active_tokens(db: Session, user_id: int):
	return db.query(RefreshToken).filter(
		RefreshToken.user_id == user_id,
		RefreshToken.is_active == True,
		RefreshToken.expires_at > datetime.now(),
		RefreshToken.revoked_at == None
	).all()

def validate_and_get_user_by_refresh_token(db: Session, token: str) -> Optional[User]:
	db_token = get_refresh_token(db, token)

	if not db_token:
		return None

	return db_token.user



