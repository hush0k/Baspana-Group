from typing import List

from cloudinary import uploader
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status as http_status
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.image import create_image, delete_image, get_images_by_id, get_images_by_object, update_image
from app.database import get_db
from app.models import ObjectType, Role, User
from app.schemas import ImageCreate, ImageResponse, ImageUpdate

router = APIRouter()


#GET Images
@router.get('/', response_model = List[ImageResponse])
def get_images_by_object_endpoint(object_id: int, object_type: ObjectType, db: Session = Depends(get_db)):
	return get_images_by_object(db, object_id, object_type)

@router.get('/{image_id}', response_model = ImageResponse)
def get_image_by_id_endpoint(image_id: int, db: Session = Depends(get_db)):
	db_image = get_images_by_id(db, image_id)
	if db_image is None:
		raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail='Image not found')
	return db_image


# POST Upload Image
@router.post("/", response_model = ImageResponse)
async def create_image_endpoint(
		file: UploadFile = File(...),
		object_id: int = None,
		object_type: ObjectType = None,
		db: Session = Depends(get_db),
		_: User = Depends(require_role([Role.admin, Role.manager]))
):
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=http_status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail='Content-type must be image/jpg')

	try:
		result = uploader.upload(
			file.file,
			folder = f"baspana/{object_type.value.lower ().replace (' ', '_')}",
			resource_type = "image"
		)

		image_data = ImageCreate(
			object_id = object_id,
			object_type = object_type,
			img_url = result['secure_url'],
		)

		return create_image(db, image_data)

	except Exception as e:
		raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.patch('/{image_id}', response_model = ImageResponse)
def update_image_endpoint(
		image_id: int,
		image: ImageUpdate,
		db: Session = Depends(get_db),
		_: User = Depends(require_role([Role.admin, Role.manager]))
):
	existing_image = get_images_by_id(db, image_id)
	if existing_image is None:
		raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail='Image not found')

	updated_data = update_image(db, image_id, image)
	return updated_data

@router.delete('/{image_id}', response_model = ImageResponse)
def delete_image_endpoint(
		image_id: int,
		db: Session = Depends(get_db),
		_: User = Depends(require_role([Role.admin, Role.manager]))
):
	existing_image = get_images_by_id(db, image_id)
	if existing_image is None:
		raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail='Image not found')
	delete_image(db, image_id)
	return existing_image

