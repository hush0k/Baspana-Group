from typing import List, Optional

from cloudinary import uploader
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth import require_role
from app.cruds.residential_complex import (
    create_residential_complex,
    delete_residential_complex,
    get_residential_complex_by_id,
    get_residential_complex_by_name,
    get_residential_complexes_filtered,
    update_residential_complex,
)
from app.database import get_db
from app.models import BuildingClass, BuildingStatus, City, MaterialType, Role, User
from app.schemas import (
    PaginatedResidentialComplexResponse,
    ResidentialComplexCreate,
    ResidentialComplexResponse,
    ResidentialComplexUpdate,
)

router = APIRouter()


# GET Routers
@router.get("/", response_model=PaginatedResidentialComplexResponse)
def get_residential_complexes_endpoint(
    city: Optional[City] = None,
    building_class: Optional[BuildingClass] = None,
    building_status: Optional[BuildingStatus] = None,
    material: Optional[MaterialType] = None,
    has_security: Optional[bool] = None,
    min_apartment_area: Optional[float] = None,
    max_apartment_area: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: str = "name",
    order: str = "asc",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return get_residential_complexes_filtered(
        db=db,
        city=city,
        building_class=building_class,
        building_status=building_status,
        material=material,
        has_security=has_security,
        min_apartment_area=min_apartment_area,
        max_apartment_area=max_apartment_area,
        search=search,
        sort_by=sort_by,
        order=order,
        limit=limit,
        offset=offset,
    )


@router.get("/by-id/{id}", response_model=ResidentialComplexResponse)
def get_residential_complex(id: int, db: Session = Depends(get_db)):
    residential_complex = get_residential_complex_by_id(db, id)
    if residential_complex is None:
        raise HTTPException(status_code=404, detail="Residential Complex not found")

    return residential_complex


@router.get("/by-name/{name}", response_model=ResidentialComplexResponse)
def get_residential_complex_by_name_endpoint(name: str, db: Session = Depends(get_db)):
    residential_complex = get_residential_complex_by_name(db, name)
    if residential_complex is None:
        raise HTTPException(status_code=404, detail="Residential Complex not found")

    return residential_complex


# POST Residential Complex
@router.post("/", response_model=ResidentialComplexResponse)
async def create_residential_complex_endpoint(
    name: str = Form(...),
    description: str = Form(...),
    short_description: Optional[str] = Form(None),
    block_counts: int = Form(...),
    playground_area: float = Form(...),
    apartment_area: float = Form(...),
    commercial_area: float = Form(...),
    parking_area: float = Form(...),
    landing_area: float = Form(...),
    material: MaterialType = Form(...),
    city: City = Form(...),
    address: str = Form(...),
    longitude: float = Form(...),
    latitude: float = Form(...),
    has_security: str = Form(...),
    building_class: BuildingClass = Form(...),
    building_status: BuildingStatus = Form(...),
    min_area: Optional[float] = Form(None),
    min_price: Optional[float] = Form(None),
    construction_end: Optional[str] = Form(None),
    main_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_complex = get_residential_complex_by_name(db, name)
    if existing_complex:
        raise HTTPException(
            status_code=400, detail="Residential with this name already exists"
        )

    # Загружаем главное изображение в Cloudinary если оно предоставлено
    main_image_url = None
    if main_image and main_image.filename:
        try:
            result = uploader.upload(
                main_image.file,
                folder="baspana/residential_complex",
                resource_type="image",
            )
            main_image_url = result["secure_url"]
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка при загрузке изображения: {str(e)}"
            )

    # Создаем объект схемы для создания комплекса
    from datetime import date

    # Конвертируем has_security из строки в boolean
    has_security_bool = has_security.lower() in ('true', '1', 'yes') if isinstance(has_security, str) else bool(has_security)

    complex_data = ResidentialComplexCreate(
        name=name,
        description=description,
        short_description=short_description,
        block_counts=block_counts,
        playground_area=playground_area,
        apartment_area=apartment_area,
        commercial_area=commercial_area,
        parking_area=parking_area,
        landing_area=landing_area,
        material=material,
        city=city,
        address=address,
        longitude=longitude,
        latitude=latitude,
        has_security=has_security_bool,
        building_class=building_class,
        building_status=building_status,
        min_area=min_area,
        min_price=min_price,
        construction_end=date.fromisoformat(construction_end) if construction_end else None,
        main_image=main_image_url,
    )

    return create_residential_complex(db, complex_data)


# PUT Residential Complex
@router.patch("/{id}", response_model=ResidentialComplexResponse)
async def update_residential_complex_endpoint(
    id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    short_description: Optional[str] = Form(None),
    block_counts: Optional[int] = Form(None),
    playground_area: Optional[float] = Form(None),
    apartment_area: Optional[float] = Form(None),
    commercial_area: Optional[float] = Form(None),
    parking_area: Optional[float] = Form(None),
    landing_area: Optional[float] = Form(None),
    material: Optional[MaterialType] = Form(None),
    city: Optional[City] = Form(None),
    address: Optional[str] = Form(None),
    longitude: Optional[float] = Form(None),
    latitude: Optional[float] = Form(None),
    has_security: Optional[str] = Form(None),
    building_class: Optional[BuildingClass] = Form(None),
    building_status: Optional[BuildingStatus] = Form(None),
    min_area: Optional[float] = Form(None),
    min_price: Optional[float] = Form(None),
    construction_end: Optional[str] = Form(None),
    main_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_complex = get_residential_complex_by_id(db, id)
    if existing_complex is None:
        raise HTTPException(
            status_code=400, detail="Residential complex with this ID does not exist"
        )

    # Загружаем новое главное изображение если оно предоставлено
    main_image_url = None
    if main_image and main_image.filename:
        try:
            result = uploader.upload(
                main_image.file,
                folder="baspana/residential_complex",
                resource_type="image",
            )
            main_image_url = result["secure_url"]
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка при загрузке изображения: {str(e)}"
            )

    # Создаем объект обновления только с предоставленными полями
    from datetime import date

    update_data = {}
    if name is not None:
        update_data['name'] = name
    if description is not None:
        update_data['description'] = description
    if short_description is not None:
        update_data['short_description'] = short_description
    if block_counts is not None:
        update_data['block_counts'] = block_counts
    if playground_area is not None:
        update_data['playground_area'] = playground_area
    if apartment_area is not None:
        update_data['apartment_area'] = apartment_area
    if commercial_area is not None:
        update_data['commercial_area'] = commercial_area
    if parking_area is not None:
        update_data['parking_area'] = parking_area
    if landing_area is not None:
        update_data['landing_area'] = landing_area
    if material is not None:
        update_data['material'] = material
    if city is not None:
        update_data['city'] = city
    if address is not None:
        update_data['address'] = address
    if longitude is not None:
        update_data['longitude'] = longitude
    if latitude is not None:
        update_data['latitude'] = latitude
    if has_security is not None:
        has_security_bool = has_security.lower() in ('true', '1', 'yes') if isinstance(has_security, str) else bool(has_security)
        update_data['has_security'] = has_security_bool
    if building_class is not None:
        update_data['building_class'] = building_class
    if building_status is not None:
        update_data['building_status'] = building_status
    if min_area is not None:
        update_data['min_area'] = min_area
    if min_price is not None:
        update_data['min_price'] = min_price
    if construction_end is not None:
        update_data['construction_end'] = date.fromisoformat(construction_end)
    if main_image_url is not None:
        update_data['main_image'] = main_image_url

    complex_update = ResidentialComplexUpdate(**update_data)
    updated_complex = update_residential_complex(db, id, complex_update)
    return updated_complex


# DELETE Residential Complex
@router.delete("/{id}", response_model=ResidentialComplexResponse)
def delete_residential_complex_endpoint(
    id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role([Role.admin, Role.manager])),
):
    existing_complex = get_residential_complex_by_id(db, id)
    if existing_complex is None:
        raise HTTPException(
            status_code=400, detail="Complex with this ID does not exist"
        )
    delete_residential_complex(db, id)
    return existing_complex
