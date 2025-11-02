from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import ObjectType, Order, OrderStatus, OrderType, PaymentType
from app.schemas import OrderCreate, OrderUpdate


#GET Orders
def get_order_by_id(db: Session, order_id: int):
	return db.query(Order).filter(Order.id == order_id).first()

def get_orders_filtered(db: Session,
                        object_id: int = None,
                        user_id: int = None,
						order_type: OrderType = None,
                        object_type: ObjectType = None,
                        min_total_price: Decimal = None,
                        max_total_price: Decimal = None,
                        payment_type: PaymentType = None,
                        min_booking_deposit: Decimal = None,
                        max_booking_deposit: Decimal = None,
                        from_booking_expiration: date = None,
                        to_booking_expiration: date = None,
                        order_status: OrderStatus= None,
                        order_by: str = "asc",
                        sort_by: str = "status",
                        limit: int = 100,
                        offset: int = 0,
                        ):

	query = db.query(Order);

	if object_id:
		query = query.filter(Order.id == object_id)
	if user_id:
		query = query.filter(Order.user_id == user_id)
	if order_type:
		query = query.filter(Order.order_type == order_type)
	if object_type:
		query = query.filter(Order.object_type == object_type)
	if min_total_price:
		query = query.filter(Order.total_price >= min_total_price)
	if max_total_price:
		query = query.filter(Order.total_price <= max_total_price)
	if payment_type:
		query = query.filter(Order.payment_type == payment_type)
	if min_booking_deposit:
		query = query.filter(Order.booking_deposit >= min_booking_deposit)
	if max_booking_deposit:
		query = query.filter(Order.booking_deposit <= max_booking_deposit)
	if from_booking_expiration:
		query = query.filter(Order.booking_expiration_date >= from_booking_expiration)
	if to_booking_expiration:
		query = query.filter(Order.booking_expiration_date <= to_booking_expiration)
	if order_status:
		query = query.filter(Order.status == order_status)

	if hasattr(Order, sort_by):
		if order_by == "desc":
			query = query.order_by(getattr(Order, sort_by).desc())
		else:
			query = query.order_by(getattr(Order, sort_by).asc())

	total = query.count()
	results = query.offset(offset).limit(limit)

	return {"total": total, "results": results, "limit": limit, "offset": offset}


#POST Order
def create_order(db: Session, order: OrderCreate):
	new_order = Order(
		user_id=order.user_id,
		object_id=order.object_id,
		order_type=order.order_type,
		object_type=order.object_type,
		total_price=order.total_price,
		payment_type=order.payment_type,
		order_date = date.today (),
		booking_deposit=order.booking_deposit,
		booking_expiration_date=order.booking_expiration_date,
		status=order.status
	)

	db.add(new_order)
	db.commit()
	db.refresh(new_order)
	return new_order

#PUT Order
def update_order(db: Session, order_id: int, order: OrderUpdate):
	db_order = get_order_by_id(db, order_id)
	if not db_order:
		return None

	update_data = order.model_dump(exclude_unset = True)

	for key, value in update_data.items():
		setattr(db_order, key, value)

	db.commit()
	db.refresh(db_order)
	return db_order


#DELETE Order
def delete_order(db: Session, order_id: int):
	db_order = get_order_by_id(db, order_id)
	if not db_order:
		return None

	db.delete(db_order)
	db.commit()
	return True

