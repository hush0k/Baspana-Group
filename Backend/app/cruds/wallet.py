from datetime import datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import UserWallet
from app.schemas import UserWalletUpdate


# GET Wallet
def get_wallet_by_id(db: Session, wallet_id: int):
    return db.query(UserWallet).filter(UserWallet.id == wallet_id).first()


def get_wallet_by_user_id(db: Session, user_id: int):
    return db.query(UserWallet).filter(UserWallet.user_id == user_id).first()


# POST Wallet
def create_wallet(db: Session, user_id: int) -> UserWallet:
    new_wallet = UserWallet(
        user_id=user_id,
        balance=Decimal("0.0"),
        loyalty_points=Decimal("0.0"),
        isActive=True,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet


# PATCH Wallet
def update_wallet(db: Session, wallet_id: int, wallet_update: UserWalletUpdate) -> None:
    db_wallet = db.query(UserWallet).filter(UserWallet.id == wallet_id).first()
    if not db_wallet:
        return None

    updated_data = wallet_update.model_dump(exclude_unset=True)

    for key, value in updated_data.items():
        setattr(db_wallet, key, value)

    db_wallet.updated_at = datetime.now()

    db.commit()
    db.refresh(db_wallet)
    return db_wallet
