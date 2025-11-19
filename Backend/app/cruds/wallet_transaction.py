from datetime import datetime
from typing import Optional

from sqlalchemy.dialects.mysql import DECIMAL
from sqlalchemy.orm import Session

from app.cruds.wallet import get_wallet_by_id
from app.models import TransactionType, WalletTransaction, UserWallet


def get_transaction_by_id(db: Session, transaction_id: int) -> WalletTransaction:
    return (
        db.query(WalletTransaction)
        .filter(WalletTransaction.id == transaction_id)
        .first()
    )


def get_transaction_by_wallet(
    db: Session,
    wallet_id: int,
    transaction_type: Optional[TransactionType] = None,
    limit: int = 100,
    offset: int = 0,
):
    query = db.query(WalletTransaction).filter(WalletTransaction.wallet_id == wallet_id)

    if transaction_type:
        query = query.filter(
            WalletTransaction.transaction_type == transaction_type
        ).all()

    query = query.order_by(WalletTransaction.created_at.desc())

    total = query.count()
    res = query.offset(offset).limit(limit).all()

    return {"total": total, "result": res, "limit": limit, "offset": offset}


def create_transaction(
    db: Session,
    wallet_id: int,
    transaction_type: TransactionType,
    amount: DECIMAL,
    description: str,
    order_id: Optional[int] = None,
) -> WalletTransaction:
    wallet: UserWallet = get_wallet_by_id(db, wallet_id)

    if wallet is None:
        raise ValueError("Wallet not found")

    if not wallet.isActive:
        raise ValueError("Wallet is not active")

    balance_before = wallet.balance

    if transaction_type in [
        TransactionType.deposit,
        TransactionType.refund,
        TransactionType.bonus,
        TransactionType.transfer_in,
    ]:
        balance_after = wallet.balance + amount
        description = f"You make transaction to {amount} tenge"

    elif transaction_type in [
        TransactionType.withdrawal,
        TransactionType.penalty,
        TransactionType.transfer_out,
        TransactionType.purchase,
    ]:
        balance_after = wallet.balance - amount

        if balance_after < 0:
            raise ValueError(
                f"Not enough balance to finish Transaction. Now your balance is {balance_before}. Required: {amount}"
            )
        description = f"You make transaction to {amount} tenge"

    elif transaction_type == TransactionType.loyalty_earned:
        wallet.loyalty_points += amount
        balance_after = balance_before
        description = f"You earn {amount} tenge loyalty points"

    elif transaction_type == TransactionType.loyalty_spent:
        if wallet.loyalty_points < amount:
            raise ValueError(
                f"Not enough loyalty points to finish Transaction. Now your loyalty points is {wallet.loyalty_points}. Required: {amount}"
            )

        wallet.loyalty_points -= amount
        description = f"You spent {amount} tenge loyalty points"
        balance_after = balance_before

    else:
        balance_after = balance_before

    new_transaction = WalletTransaction(
        wallet_id=wallet_id,
        transaction_type=transaction_type,
        amount=amount,
        balance_before=balance_before,
        balance_after=balance_after,
        description=description,
        order_id=order_id,
        created_at=datetime.now(),
    )

    wallet.balance = balance_after
    wallet.updated_at = datetime.now()

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


def get_wallet_balance(db: Session, wallet_id):
    wallet = get_wallet_by_id(db, wallet_id)
    if not wallet:
        return None

    return {
        "wallet_id": wallet_id,
        "balance": wallet.balance,
        "loyalty_points": wallet.loyalty_points,
        "is_active": wallet.is_active,
    }
