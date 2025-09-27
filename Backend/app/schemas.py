from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from .models import ApartmentType, BuildingClass, BuildingStatus, City, Direction, FinishingType, \
    MaterialType, ObjectType, OrderStatus, OrderType, PaymentType, PropertyStatus, Role, StatusOfUser, TransactionType
from pydantic import BaseModel, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber


#Refresh Tokens
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenRefresh(BaseModel):
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    id: int
    token: str
    expires_in: datetime
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


#User Schemas
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    date_of_birth: date
    phone_number: PhoneNumber
    city: City
    avatar_url: str

class UserCreate(UserBase):
    is_active: bool = True
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[PhoneNumber] = None
    city: Optional[City] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: date
    status_of_user: StatusOfUser
    role: Role
    is_active: bool

    class Config:
        orm_mode = True

#Residential
class ResidentialComplexBase(BaseModel):
    name: str
    description: str
    block_counts: int
    playground_area: float
    apartment_area: float
    commercial_area: float
    parking_area: float
    landing_area: float
    material: MaterialType
    city: City
    address: str
    longitude: float
    latitude: float
    has_security: bool
    building_class: BuildingClass
    building_status: BuildingStatus

class ResidentialComplexCreate(ResidentialComplexBase):
    pass

class ResidentialComplexUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    block_counts: Optional[int] = None
    playground_area: Optional[float] = None
    apartment_area: Optional[float] = None
    commercial_area: Optional[float] = None
    parking_area: Optional[float] = None
    landing_area: Optional[float] = None
    material: Optional[MaterialType] = None
    city: Optional[City] = None
    address: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    has_security: Optional[bool] = None
    building_class: Optional[BuildingClass] = None
    building_status: Optional[BuildingStatus] = None


class ResidentialComplexResponse(ResidentialComplexBase):
    id: int

    class Config:
        orm_mode = True


#Building
class BuildingBase(BaseModel):
    residential_complex_id: int
    block: int
    description: str
    floor_count: int
    apartments_count: int
    commercials_count: int
    parking_count: int
    gross_area: float
    elevators_count: int
    status: BuildingStatus
    construction_start: date
    construction_end: date

class BuildingCreate(BuildingBase):
    pass

class BuildingUpdate(BaseModel):
    residential_complex_id: Optional[int] = None
    block: Optional[int] = None
    description: Optional[str] = None
    floor_count: Optional[int] = None
    apartments_count: Optional[int] = None
    commercials_count: Optional[int] = None
    parking_count: Optional[int] = None
    gross_area: Optional[float] = None
    elevators_count: Optional[int] = None
    status: Optional[BuildingStatus] = None
    construction_start: Optional[date] = None
    construction_end: Optional[date] = None

class BuildingResponse(BuildingBase):
    id: int

    class Config:
        orm_mode = True


#Apartment
class ApartmentBase(BaseModel):
    building_id: int
    number: int
    floor: int
    apartment_area: float
    apartment_type: ApartmentType
    has_balcony: bool
    bathroom_count: int
    kitchen_area: float
    ceiling_height: float
    finishing_type: FinishingType
    price_per_sqr: Decimal
    total_price: Decimal
    status: PropertyStatus
    orientation: Direction
    isCorner: bool

class ApartmentCreate(ApartmentBase):
    pass

class ApartmentUpdate(BaseModel):
    building_id: Optional[int] = None
    number: Optional[int] = None
    floor: Optional[int] = None
    apartment_area: Optional[float] = None
    apartment_type: Optional[ApartmentType] = None
    has_balcony: Optional[bool] = None
    bathroom_count: Optional[int] = None
    kitchen_area: Optional[float] = None
    ceiling_height: Optional[float] = None
    finishing_type: Optional[FinishingType] = None
    price_per_sqr: Optional[Decimal] = None
    total_price: Optional[Decimal] = None
    status: Optional[PropertyStatus] = None
    orientation: Optional[Direction] = None
    isCorner: Optional[bool] = None

class ApartmentResponse(ApartmentBase):
    id: int

    class Config:
        orm_mode = True



#Commercial Unit
class CommercialUnitBase(BaseModel):
    building_id: int
    number: int
    floor: int
    space_area: float
    ceiling_height: float
    finishing_type: FinishingType
    price_per_sqr: Decimal
    total_price: Decimal
    status: PropertyStatus
    orientation: Direction
    isCorner: bool

class CommercialUnitCreate(CommercialUnitBase):
    pass

class CommercialUnitUpdate(BaseModel):
    building_id: Optional[int] = None
    number: Optional[int] = None
    floor: Optional[int] = None
    space_area: Optional[float] = None
    ceiling_height: Optional[float] = None
    finishing_type: Optional[FinishingType] = None
    price_per_sqr: Optional[Decimal] = None
    total_price: Optional[Decimal] = None
    status: Optional[PropertyStatus] = None
    orientation: Optional[Direction] = None
    isCorner: Optional[bool] = None

class CommercialUnitResponse(CommercialUnitBase):
    id: int

    class Config:
        orm_mode = True


#Review
class ReviewBase(BaseModel):
    residential_complex_id: int
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


#Image
class ImageBase(BaseModel):
    object_id: int
    object_type: ObjectType
    img_url: str

class ImageCreate(ImageBase):
    pass

class ImageUpdate(BaseModel):
    img_url: Optional[str] = None

class ImageResponse(ImageBase):
    id: int
    upload_date: date

    class Config:
        orm_mode = True


#Order
class OrderBase(BaseModel):
    user_id: int
    object_id: int
    order_type: OrderType
    object_type: ObjectType
    total_price: Decimal
    payment_type: PaymentType
    booking_deposit: Decimal
    booking_expiration_date: date

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    order_type: Optional[OrderType] = None
    object_type: Optional[ObjectType] = None
    booking_deposit: Optional[Decimal] = None
    status: Optional[OrderStatus] = None

class OrderResponse(OrderBase):
    id: int

    class Config:
        orm_mode = True


#Favorites
class FavoriteBase(BaseModel):
    user_id: int
    object_id: int
    object_type: ObjectType

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteUpdate(BaseModel):
    user_id: Optional[int] = None
    object_id: Optional[int] = None
    object_type: Optional[ObjectType] = None

class FavoriteResponse(FavoriteBase):
    id: int
    created_at: date

    class Config:
        orm_mode = True


#Wallet Transaction
class WalletTransactionBase(BaseModel):
    transaction_type: TransactionType
    amount: Decimal
    balance_before: Decimal
    balance_after: Decimal
    description: str
    order_id: int

class WalletTransactionCreate(WalletTransactionBase):
    pass

class WalletTransactionResponse(WalletTransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

#User Wallet
class UserWalletBase(BaseModel):
    user_id: int
    balance: Decimal
    loyalty_points: Decimal
    isActive: bool

class UserWalletCreate(UserWalletBase):
    pass

class UserWalletUpdate(BaseModel):
    balance: Optional[Decimal] = None
    loyalty_points: Optional[Decimal] = None
    isActive: Optional[bool] = None

class UserWalletResponse(UserWalletBase):
    id: int
    created_at: datetime
    updated_at: datetime
    transactions: List[WalletTransactionResponse] = []

    class Config:
        orm_mode = True


class UserDetailResponse(UserResponse):
    orders: List[OrderResponse] = []
    favorites: List[FavoriteResponse] = []
    reviews: List[ReviewResponse] = []
    wallet: Optional[UserWalletResponse] = None

    class Config:
        orm_mode = True


