from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session
from starlette import status

from app.auth import get_current_user
from app.cruds.wallet import get_wallet_by_id, get_wallet_by_user_id, make_me_reach, get_balance
from app.cruds.wallet_transaction import get_transaction_by_wallet
from app.database import get_db
from app.models import TransactionType, User
from app.schemas import PaginatedTransactionResponse, UserWalletResponse

router = APIRouter()


@router.get("/me", response_model=UserWalletResponse)
def get_my_wallet(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    wallet = get_wallet_by_user_id(db, current_user.id)

    if not wallet:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Wallet not. Please contact administrator.",
        )

    return wallet


@router.get("/me/balance")
def get_wallet_balance(current_user: User = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    wallet = get_wallet_by_user_id(db, current_user.id)
    if not wallet:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Wallet not found. Please contact administrator.",
        )

    return get_balance(db, wallet.id)


@router.get("/me/transactions", response_model=PaginatedTransactionResponse)
def get_wallet_transactions(
    transaction_type: Optional[TransactionType],
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wallet = get_wallet_by_id(db, current_user.id)

    if not wallet:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="Wallet not found. Please contact administrator.",
        )

    return get_transaction_by_wallet(db, wallet.id, transaction_type, limit, offset)

@router.patch("/make/me/rich-beach", response_model=UserWalletResponse, status_code=status.HTTP_202_ACCEPTED)
def make_rich_beach_endpoint(current_user: User = Depends(get_current_user),
                             db: Session = Depends(get_db),):
    wallet = get_wallet_by_user_id(db, current_user.id)
    if not wallet:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Wallet not found. Please contact administrator.")

    make_me_reach(db, current_user.id)
    return wallet