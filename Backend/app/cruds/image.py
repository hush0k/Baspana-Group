from datetime import date
import re

from cloudinary import uploader
from sqlalchemy.orm import Session

from app.models import Image, ObjectType
from app.schemas import ImageCreate, ImageUpdate


def get_images_by_object(db: Session, object_id: int, object_type: ObjectType):
	return db.query(Image).filter(Image.object_id == object_id).filter(Image.object_type == object_type).all()

def get_images_by_id(db: Session, image_id: int):
	return db.query(Image).filter(Image.id == image_id).first()

def create_image(db: Session, image: ImageCreate):
	new_image = Image(
		object_id=image.object_id,
		object_type=image.object_type,
		img_url = image.img_url,
		upload_date = date.today()
	)

	db.add(new_image)
	db.commit()
	db.refresh(new_image)
	return new_image

def update_image(db: Session, image_id: int, image: ImageUpdate):
	db_image = db.query(Image).filter(Image.id == image_id).first()
	if not db_image:
		return None

	updated_data = image.model_dump(exclude_unset = True)
	for field, value in updated_data.items():
		setattr(db_image, field, value)

	db.commit()
	db.refresh(db_image)
	return db_image

def delete_image(db: Session, image_id: int):
	db_image = db.query(Image).filter(Image.id == image_id).first()
	if not db_image:
		return None



	try:
		match = re.search (r'/upload/(?:v\d+/)?(.+)\.\w+$', db_image.img_url)
		if not match:
			print ("Could not extract public_id")
			return None
		public_id = match.group (1)

		uploader.destroy (public_id)
	except Exception as e:
		print(f'Failed to delete from Claudinary: {e}')



	db.delete(db_image)
	db.commit()
	return False

