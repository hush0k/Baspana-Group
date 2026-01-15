# backend/app/crud/panorama.py
from sqlalchemy.orm import Session
from typing import List, Optional, Any

from app.models import Panorama
from app.schemas import PanoramaCreate


class CRUDPanorama:
    def create(self, db: Session, obj_in: PanoramaCreate) -> Panorama:
        db_obj = Panorama(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_complex(self, db: Session, complex_id: int) -> list[type[Panorama]]:
        return db.query(Panorama).filter(Panorama.residential_complex_id == complex_id).all()

    def get_by_apartment(self, db: Session, apartment_id: int) -> list[type[Panorama]]:
        return db.query(Panorama).filter(Panorama.apartment_id == apartment_id).all()

    def delete(self, db: Session, panorama_id: int) -> Optional[Panorama]:
        obj = db.query(Panorama).filter(Panorama.id == panorama_id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

panorama = CRUDPanorama()