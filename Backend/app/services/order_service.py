from datetime import date
from typing import Union

from fastapi import HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.cruds.order import create_order, get_order_by_id, update_order
from app.models import Apartment, CommercialUnit, ObjectType, Order, OrderStatus, PropertyStatus
from app.schemas import OrderCreate, OrderUpdate


class OrderService:
	@staticmethod
	def _get_property_object(db:Session, object_id:int, object_type:ObjectType):
		if object_type == object_type.apartment:
			return db.query(Apartment).filter(Apartment.id == object_id).first()
		elif object_type == object_type.commercial:
			return db.query(CommercialUnit).filter(CommercialUnit.id == object_id).first()
		return None

	@staticmethod
	def _validate_property_availability(property_obj: Union[Apartment, CommercialUnit]):
		if not property_obj:
			raise HTTPException(
				status_code=http_status.HTTP_404_NOT_FOUND, detail="Property does not exist"
			)

		if property_obj.status != PropertyStatus.free:
			raise HTTPException(
				status_code = http_status.HTTP_405_METHOD_NOT_ALLOWED, detail=f"Property is not available. Current status: {property_obj.status}"
			)


	@staticmethod
	def _update_property_status(property_obj: Union[Apartment, CommercialUnit], new_status: PropertyStatus, db: Session):
		property_obj.status = new_status
		db.commit()
		db.refresh(property_obj)

	@staticmethod
	def create_order_with_logic(db:Session, order_data:OrderCreate) -> Order:
		property_obj = OrderService._get_property_object(db, order_data.object_id, order_data.object_type)

		OrderService._validate_property_availability(property_obj)

		new_order = create_order(db, order_data)

		if new_order.status == OrderStatus.offering:
			OrderService._update_property_status(property_obj, PropertyStatus.booked, db)
		elif new_order.status == OrderStatus.completed:
			OrderService._update_property_status(property_obj, PropertyStatus.sold, db)

		return new_order

	@staticmethod
	def update_order_with_logic(db:Session, order_update:OrderUpdate, order_id: int) -> Order:
		existing_order = get_order_by_id(db, order_id)
		if not existing_order:
			raise HTTPException(
				status_code=http_status.HTTP_404_NOT_FOUND, detail="Order does not exist"
			)

		property_obj = OrderService._get_property_object(db, order_update.object_id, order_update.object_type)

		if not property_obj:
			raise HTTPException(
				status_code=http_status.HTTP_404_NOT_FOUND, detail="Property does not exist"
			)

		old_status = property_obj.status

		updated_order = update_order(db, order_id, order_update)

		new_status = updated_order.status

		if old_status != new_status:
			if new_status == OrderStatus.completed:
				OrderService._update_property_status(property_obj, PropertyStatus.sold, db)
			elif new_status == OrderStatus.offering:
				OrderService._update_property_status(property_obj, PropertyStatus.booked, db)
			elif new_status == OrderStatus.cancelled:
				OrderService._update_property_status(property_obj, PropertyStatus.free, db)

		return updated_order

	@staticmethod
	def check_expired_bookings(db:Session):
		today = date.today()

		expired_bookings = db.query(Order).filter(Order.booking_expiration_date<today).all()

		for order in expired_bookings:
			order.status = OrderStatus.cancelled

			property_obj = OrderService._get_property_object(db, order.object_id, order.object_type)
			if property_obj:
				OrderService._update_property_status(property_obj, PropertyStatus.free, db)

		db.commit()

		return len(expired_bookings)