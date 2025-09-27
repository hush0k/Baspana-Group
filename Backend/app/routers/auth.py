from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError

from ..cruds import users
from ..database import get_db
from ..schemas import UserCreate, UserResponse, Token, TokenRefresh
from ..auth import (
	authenticate_user,
	create_tokens_pair,
	get_current_active_user,
	verify_refresh_token
)
from ..cruds.refresh_token import (
    create_refresh_token_record,
    revoke_refresh_token,
    revoke_all_users_tokens,
    validate_and_get_user_by_refresh_token
)
router = APIRouter (prefix = "/auth", tags = ["authentication"])


@router.post ("/login", response_model=Token)
async def login_user (
		form_data: OAuth2PasswordRequestForm = Depends (),
		db: Session = Depends (get_db)
):

	user = authenticate_user (db, form_data.username, form_data.password)

	if not user or not user.is_active:
		raise HTTPException (
			status_code = status.HTTP_401_UNAUTHORIZED,
			detail = "Incorrect username or password"
		)

	tokens = create_tokens_pair (user.username)

	create_refresh_token_record (
		db = db,
		user_id = user.id,
		token = tokens["refresh_token"]
	)

	return tokens


@router.post ("/refresh", response_model = Token)
async def refresh_access_token (
		token_data: TokenRefresh,
		db: Session = Depends (get_db)
):

	try:
		username = verify_refresh_token (token_data.refresh_token)
	except JWTError:
		raise HTTPException (
			status_code = status.HTTP_401_UNAUTHORIZED,
			detail = "Invalid refresh token"
		)

	user = validate_and_get_user_by_refresh_token (db, token_data.refresh_token)

	if not user or not user.is_active:
		raise HTTPException (
			status_code = status.HTTP_401_UNAUTHORIZED,
			detail = "Invalid refresh token or user inactive"
		)

	new_tokens = create_tokens_pair (user.username)

	revoke_refresh_token (db, token_data.refresh_token)

	create_refresh_token_record (
		db = db,
		user_id = user.id,
		token = new_tokens["refresh_token"]
	)

	return new_tokens


@router.post ("/logout")
async def logout_user (
		token_data: TokenRefresh,
		current_user = Depends (get_current_active_user),
		db: Session = Depends (get_db)
):

	revoked = revoke_refresh_token (db, token_data.refresh_token)

	if not revoked:
		raise HTTPException (
			status_code = status.HTTP_400_BAD_REQUEST,
			detail = "Token not found or already revoked"
		)

	return {"message": "Successfully logged out"}


@router.post ("/logout-all")
async def logout_all_devices (
		current_user = Depends (get_current_active_user),
		db: Session = Depends (get_db)
):

	revoked_count = revoke_all_users_tokens (db, current_user.id)

	return {
		"message": f"Successfully logged out from {revoked_count} devices"
	}


@router.get ("/active-sessions")
async def get_active_sessions (
		current_user = Depends (get_current_active_user),
		db: Session = Depends (get_db)
):

	from ..cruds.refresh_token import get_user_active_tokens
	active_tokens = get_user_active_tokens (db, current_user.id)

	sessions = []
	for token in active_tokens:
		sessions.append ({
			"id": token.id,
			"created_at": token.created_at,
			"expires_at": token.expires_at,
			"is_current": False
		})
	return {"active_sessions": sessions}


@router.post ("/register", response_model = UserResponse)
async def register_user (
		user_data: UserCreate,
		db: Session = Depends (get_db)
):
	# Проверяем, нет ли пользователя с таким email или телефоном
	existing_user = users.get_user_by_email (db, user_data.email)
	if existing_user:
		raise HTTPException (
			status_code = status.HTTP_400_BAD_REQUEST,
			detail = "Email is already registered"
		)

	existing_user = users.get_user_by_phone (db, str (user_data.phone_number))
	if existing_user:
		raise HTTPException (
			status_code = status.HTTP_400_BAD_REQUEST,
			detail = "Phone number is already registered"
		)

	# Создаём пользователя
	new_user = users.create_user (db, user_data)
	return new_user


@router.get ("/me", response_model = UserResponse)
async def get_current_user_info (
		current_user = Depends (get_current_active_user)
):
	return current_user