from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Query, Session

from app.models import Review
from app.schemas import ReviewCreate, ReviewUpdate


def _apply_review_filters(
		query: Query,
		residential_complex_id: Optional[int] = None,
		user_id: Optional[int] = None,
		min_rating: Optional[int] = None,
		max_rating: Optional[int] = None,
) -> Query:

	if residential_complex_id:
		query = query.filter(Review.residential_complex_id == residential_complex_id)
	if user_id:
		query = query.filter(Review.user_id == user_id)
	if min_rating:
		query = query.filter(Review.rating >= min_rating)
	if max_rating:
		query = query.filter(Review.rating <= max_rating)

	return query

def _apply_review_sorting(
		query: Query,
		order_by: str = "desc",
		sort_by: str = "created_at",
) -> Query:
	if hasattr(query, sort_by):
		sort_column = getattr(Review, sort_by)
		query = query.order_by(
			sort_column.desc() if order_by == "desc" else sort_column.asc()
		)

	return query

def get_review_filtered(
		db: Session,
		residential_complex_id: Optional[int] = None,
		user_id: Optional[int] = None,
		min_rating: Optional[int] = None,
		max_rating: Optional[int] = None,
		order_by: str = "desc",
		sort_by: str = "created_at",
		limit: int = 100,
		offset: int = 0,
):
	query = db.query(Review)

	query = _apply_review_filters(
		query,
		residential_complex_id=residential_complex_id,
		user_id=user_id,
		min_rating=min_rating,
		max_rating=max_rating,
	)

	query = _apply_review_sorting(
		query,
		order_by=order_by,
		sort_by=sort_by,
	)

	total = query.count()
	results = query.offset(offset).limit(limit).all()

	return {
		"total": total,
		"results": results,
		"limit": limit,
		"offset": offset,
	}


def get_review_by_id(db:Session, review_id: int):
	return db.query(Review).filter(Review.id == review_id).first()

def get_review_by_user_id(db: Session, user_id: int):
	return db.query(Review).filter(Review.user_id == user_id).all()

def get_review_by_complex_id(db: Session, residential_complex_id: int):
	return db.query(Review).filter(Review.residential_complex_id == residential_complex_id).all()

def get_average_rating(db: Session, residential_complex_id: int):
	result = db.query(func.avg(Review.rating)).filter(Review.residential_complex_id == residential_complex_id).scalar()
	return float(result) if result else 0


#POST Review
def create_review(db: Session, review: ReviewCreate, user_id):
	existing_review = (db.query(Review)
	                   .filter(Review.user_id == user_id,
	                           Review.residential_complex_id == review.residential_complex_id).first())
	if existing_review:
		return None

	new_review = Review(
		residential_complex_id=review.residential_complex_id,
		user_id=user_id,
		rating=review.rating,
		comment=review.comment,
	)

	db.add(new_review)
	db.commit()
	db.refresh(new_review)
	return new_review


#PATCH Review
def update_review(db:Session, review: ReviewUpdate, review_id: int):
	existing_review = get_review_by_id(db, review_id)
	if not existing_review:
		return None

	update_data = review.model_dump(exclude_unset = True)

	for field, value in update_data.items():
		setattr(existing_review, field, value)

	db.commit()
	db.refresh(existing_review)
	return existing_review


#DELETE Review
def delete_review(db:Session, review_id: int):
	existing_review = get_review_by_id(db, review_id)
	if not existing_review:
		return None

	db.delete(existing_review)
	db.commit()
	return True


