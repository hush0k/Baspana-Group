from datetime import date
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.order import create_order, delete_order, get_order_by_id, get_orders_filtered, update_order
from app.database import get_db
from app.models import ObjectType, OrderStatus, OrderType, PaymentType, Role, User
from app.schemas import OrderCreate, OrderResponse, OrderUpdate, PaginatedOrderResponse

router = APIRouter()


#GET Order
@router.get("/", response_model=PaginatedOrderResponse)
def get_orders_endpoint(
    object_id: Optional[int] = None,
    user_id: Optional[int] = None,
    order_type: Optional[OrderType] = None,
    object_type: Optional[ObjectType] = None,
    min_total_price: Optional[Decimal] = None,
    max_total_price: Optional[Decimal] = None,
    payment_type: Optional[PaymentType] = None,
    min_booking_deposit: Optional[Decimal] = None,
    max_booking_deposit: Optional[Decimal] = None,
    from_booking_expiration: Optional[date] = None,
    to_booking_expiration: Optional[date] = None,
    order_status: Optional[OrderStatus] = None,
    order_by: str = "asc",
    sort_by: str = "status",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return get_orders_filtered(
        db=db,
        object_id=object_id,
        user_id=user_id,
        order_type=order_type,
        object_type=object_type,
        min_total_price=min_total_price,
        max_total_price=max_total_price,
        payment_type=payment_type,
        min_booking_deposit=min_booking_deposit,
        max_booking_deposit=max_booking_deposit,
        from_booking_expiration=from_booking_expiration,
        to_booking_expiration=to_booking_expiration,
        order_status=order_status,
        order_by=order_by,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )

@router.get("/{id}", response_model=OrderResponse)
def get_order_by_id_endpoint(order_id: int, db: Session = Depends(get_db)):
    existing_order = get_order_by_id(db, order_id)

    if existing_order is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Order not found")

    return existing_order


#POST Order
@router.post("/", response_model=OrderResponse)
def create_order_endpoint(order: OrderCreate,
                          db: Session = Depends(get_db),
                          _: User = Depends(require_role([Role.admin, Role.manager])),
                          ):

    return create_order(db, order)


#PUT Order
@router.patch("/{id}", response_model=OrderResponse)
def update_order_endpoint(order: OrderUpdate,
                          order_id: int,
                          db: Session = Depends(get_db),
                          _: User = Depends(require_role([Role.admin, Role.manager]))
                          ):
    existing_order = get_order_by_id(db, order_id)
    if existing_order is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Order not found")

    updated_order = update_order(db, order_id, order)
    return updated_order


#DELETE Order
@router.delete("/{id}", response_model=OrderResponse)
def delete_order_endpoint(order_id: int,
                          db: Session = Depends(get_db),
                          _: User = Depends(require_role([Role.admin, Role.manager]))
                          ):
    existing_order = get_order_by_id(db, order_id)
    if existing_order is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Order not found")

    delete_order(db, order_id)
    return existing_order


