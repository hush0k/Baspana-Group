from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session

from app.auth import get_current_user, get_current_user_optional
from app.cruds.review import (
    create_review,
    delete_review,
    get_average_rating,
    get_review_by_id,
    get_review_filtered,
    update_review,
)
from app.database import get_db
from app.models import Review, Role, User
from app.schemas import (
    PaginatedReviewResponse,
    ReviewCreate,
    ReviewResponse,
    ReviewUpdate,
)

router = APIRouter()


@router.get("/", response_model=PaginatedReviewResponse)
def get_reviews_endpoint(
    residential_complex_id: Optional[int] = None,
    user_id: Optional[int] = None,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None,
    sort_by: str = "created_at",
    order_by: str = "desc",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_review_filtered(
        db=db,
        residential_complex_id=residential_complex_id,
        user_id=user_id,
        min_rating=min_rating,
        max_rating=max_rating,
        sort_by=sort_by,
        order_by=order_by,
        limit=limit,
        offset=offset,
    )


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review_endpoint(review_id: int, db: Session = Depends(get_db)):
    review = get_review_by_id(db, review_id)
    if review is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="Not existing review"
        )
    return review


@router.get("/complex/{review_id}/average-rating")
def get_complex_average_rating_endpoint(complex_id: int, db: Session = Depends(get_db)):
    avg_rating = get_average_rating(db, complex_id)

    return {
        "residential_complex_id": complex_id,
        "average_rating": round(avg_rating, 2),
    }


@router.post(
    "/", response_model=ReviewResponse, status_code=http_status.HTTP_201_CREATED
)
def create_review_endpoint(
    review: ReviewCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    # Validate: either user is authenticated OR author_name is provided for anonymous review
    if not current_user and not review.author_name:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="Either authentication or author_name is required",
        )

    user_id = current_user.id if current_user else None
    new_review = create_review(db, review, user_id)

    if not new_review:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="You have already created a review",
        )
    return new_review


@router.patch("/{review_id}", response_model=ReviewResponse)
def update_review_endpoint(
    review_id: int,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    review = get_review_by_id(db, review_id)

    if not review:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="Not existing review"
        )

    if review.user_id != current_user.id and current_user.role not in [
        Role.admin,
        Role.manager,
    ]:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update review",
        )

    updated_review = update_review(db, review_update, review_id)
    return updated_review


@router.delete("/{review_id}", status_code=http_status.HTTP_204_NO_CONTENT)
def delete_review_endpoint(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_review = get_review_by_id(db, review_id)

    if not existing_review:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND, detail="Not existing review"
        )

    if existing_review.user_id != current_user.id and current_user.role not in [
        Role.admin,
        Role.manager,
    ]:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete review",
        )

    delete_review(db, review_id)
    return None
