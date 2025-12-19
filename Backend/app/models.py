from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DECIMAL,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Enum as SqlEnum,
    func,
)
from sqlalchemy.orm import Session, relationship

from .database import Base


class City(str, Enum):
    almaty = "Almaty"
    astana = "Astana"
    shymkent = "Shymkent"
    karaganda = "Karaganda"
    aktobe = "Aktobe"
    taraz = "Taraz"
    pavlodar = "Pavlodar"
    oskemen = "Oskemen"
    semey = "Semey"
    kostanay = "Kostanay"
    kyzylorda = "Kyzylorda"
    atyrau = "Atyrau"
    oral = "Oral"
    petropavl = "Petropavl"
    turkistan = "Turkistan"


class Role(str, Enum):
    admin = "Admin"
    manager = "Manager"
    consumer = "Consumer"


class StatusOfUser(str, Enum):
    bronze = "Bronze"
    silver = "Silver"
    gold = "Gold"
    none = "None"


class BuildingStatus(str, Enum):
    project = "Project"
    under_construction = "Under Construction"
    completed = "Completed"


class BuildingClass(str, Enum):
    economic = "Economic"
    comfort = "Comfort"
    comfort_plus = "Comfort+"
    business = "Business"
    luxury = "Luxury"


class MaterialType(str, Enum):
    brick = "Brick"
    monolith = "Monolith"
    panel = "Panel"
    block = "Block"
    mixed = "Mixed"


class ObjectType(str, Enum):
    commercial = "Commercial"
    apartment = "Apartment"
    residential_complex = "Residential complex"
    building = "Building"


class PropertyStatus(str, Enum):
    free = "Free"
    booked = "Booked"
    sold = "Sold"


class Direction(str, Enum):
    north = "North"
    south = "South"
    east = "East"
    west = "West"
    north_east = "North east"
    south_east = "South east"
    north_west = "North west"
    south_west = "South west"
    north_south = "North south"
    east_west = "East west"


class ApartmentType(str, Enum):
    studio = "Studio"
    one_bedroom = "One Bedroom"
    two_bedroom = "Two Bedroom"
    three_bedroom = "Three Bedroom"
    penthouse = "Penthouse"


class FinishingType(str, Enum):
    black_box = "Black Box"
    white_box = "White Box"
    finished = "Finished"
    turnkey = "Turnkey"


class PaymentType(str, Enum):
    cash = "Cash"
    card = "Card"
    mortgage = "Mortgage"
    installment = "Installment"
    bank_transfer = "Bank Transfer"


class OrderStatus(str, Enum):
    pending = "Pending"
    offering = "Offering"
    cancelled = "Cancelled"
    completed = "Completed"


class OrderType(str, Enum):
    booking = "Booking"
    purchase = "Purchase"


class TransactionType(str, Enum):
    deposit = "Deposit"
    withdrawal = "Withdrawal"
    purchase = "Purchase"
    refund = "Refund"
    loyalty_earned = "Loyalty Earned"
    loyalty_spent = "Loyalty Spent"
    bonus = "Bonus"
    penalty = "Penalty"
    transfer_in = "Transfer In"
    transfer_out = "Transfer Out"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    date_of_birth = Column(Date)
    city = Column(SqlEnum(City, name="city"))
    phone_number = Column(String)
    role = Column(SqlEnum(Role, name="role"))
    updated_at = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status_of_user = Column(SqlEnum(StatusOfUser, name="status_of_user"))
    password = Column(String)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String)
    loyalty_point = Column(Integer, default=0)

    # Relations
    orders = relationship("Order", back_populates="user")
    favorites = relationship("Favorites", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    wallet = relationship("UserWallet", back_populates="user", uselist=False)


class ResidentialComplex(Base):
    __tablename__ = "residential_complex"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    short_description = Column(String(300))
    block_counts = Column(Integer)
    playground_area = Column(DECIMAL)
    apartment_area = Column(DECIMAL)
    commercial_area = Column(DECIMAL)
    parking_area = Column(DECIMAL)
    landing_area = Column(DECIMAL)
    material = Column(SqlEnum(MaterialType, name="material"))
    city = Column(SqlEnum(City, name="city"))
    address = Column(String)
    longitude = Column(DECIMAL)
    latitude = Column(DECIMAL)
    has_security = Column(Boolean)
    building_class = Column(SqlEnum(BuildingClass, name="building_class"))
    building_status = Column(SqlEnum(BuildingStatus, name="building_status"))
    min_area = Column(DECIMAL)
    min_price = Column(DECIMAL)
    construction_end = Column(Date)
    main_image = Column(String)

    # Relations
    buildings = relationship("Building", back_populates="residential_complex")
    reviews = relationship("Review", back_populates="residential_complex")
    infrastructures = relationship("Infrastructure", back_populates="residential_complex")
    promotions = relationship("Promotion", back_populates="residential_complex")

    @property
    def images(self):
        session = Session.object_session(self)
        return (
            session.query(Image)
            .filter(
                Image.object_id == self.id,
                Image.object_type == ObjectType.residential_complex,
            )
            .all()
        )


class Building(Base):
    __tablename__ = "building"

    id = Column(Integer, primary_key=True)
    residential_complex_id = Column(Integer, ForeignKey("residential_complex.id"))
    block = Column(Integer)
    description = Column(String)
    short_description = Column(String(300))
    floor_count = Column(Integer)
    apartments_count = Column(Integer)
    commercials_count = Column(Integer)
    parking_count = Column(Integer)
    gross_area = Column(DECIMAL)
    elevators_count = Column(Integer)
    status = Column(SqlEnum(BuildingStatus, name="building_status"))
    construction_start = Column(Date)
    construction_end = Column(Date)

    # Relations
    residential_complex = relationship("ResidentialComplex", back_populates="buildings")
    apartments = relationship("Apartment", back_populates="building")
    commercial_units = relationship("CommercialUnit", back_populates="building")

    @property
    def images(self):
        session = Session.object_session(self)
        return (
            session.query(Image)
            .filter(
                Image.object_id == self.id, Image.object_type == ObjectType.building
            )
            .all()
        )


class Apartment(Base):
    __tablename__ = "apartment"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("building.id"))
    number = Column(Integer)
    floor = Column(Integer)
    description = Column(String)
    short_description = Column(String(300))
    apartment_area = Column(DECIMAL)
    apartment_type = Column(SqlEnum(ApartmentType, name="apartment_type"))
    has_balcony = Column(Boolean)
    bathroom_count = Column(Integer)
    kitchen_area = Column(DECIMAL)
    ceiling_height = Column(DECIMAL)
    finishing_type = Column(SqlEnum(FinishingType, name="finishing_type"))
    price_per_sqr = Column(DECIMAL)
    total_price = Column(DECIMAL)
    status = Column(SqlEnum(PropertyStatus, name="property_status"))
    orientation = Column(SqlEnum(Direction, name="direction"))
    isCorner = Column(Boolean)

    # Relations
    building = relationship("Building", back_populates="apartments")

    @property
    def images(self):
        session = Session.object_session(self)
        return (
            session.query(Image)
            .filter(
                Image.object_id == self.id, Image.object_type == ObjectType.apartment
            )
            .all()
        )


class CommercialUnit(Base):
    __tablename__ = "commercial_unit"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("building.id"))
    number = Column(Integer)
    floor = Column(Integer)
    space_area = Column(DECIMAL)
    ceiling_height = Column(DECIMAL)
    finishing_type = Column(SqlEnum(FinishingType, name="finishing_type"))
    price_per_sqr = Column(DECIMAL)
    total_price = Column(DECIMAL)
    status = Column(SqlEnum(PropertyStatus, name="property_status"))
    orientation = Column(SqlEnum(Direction, name="direction"))
    isCorner = Column(Boolean)

    # Relations
    building = relationship("Building", back_populates="commercial_units")

    @property
    def images(self):
        session = Session.object_session(self)
        return (
            session.query(Image)
            .filter(
                Image.object_id == self.id, Image.object_type == ObjectType.commercial
            )
            .all()
        )


class Review(Base):
    __tablename__ = "review"

    id = Column(Integer, primary_key=True)
    residential_complex_id = Column(Integer, ForeignKey("residential_complex.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author_name = Column(String, nullable=True)
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.now)

    # Relations
    user = relationship("User", back_populates="reviews")
    residential_complex = relationship("ResidentialComplex", back_populates="reviews")


class Image(Base):
    __tablename__ = "image"

    id = Column(Integer, primary_key=True)
    object_id = Column(Integer)
    object_type = Column(SqlEnum(ObjectType, name="object_type"))
    img_url = Column(String)
    upload_date = Column(Date)

    @property
    def related_object(self):
        from sqlalchemy.orm import Session

        session = Session.object_session(self)

        if self.object_type == ObjectType.apartment:
            return (
                session.query(Apartment).filter(Apartment.id == self.object_id).first()
            )
        elif self.object_type == ObjectType.commercial:
            return (
                session.query(CommercialUnit)
                .filter(CommercialUnit.id == self.object_id)
                .first()
            )
        elif self.object_type == ObjectType.building:
            return session.query(Building).filter(Building.id == self.object_id).first()
        elif self.object_type == ObjectType.residential_complex:
            return (
                session.query(ResidentialComplex)
                .filter(ResidentialComplex.id == self.object_id)
                .first()
            )
        return None


class Order(Base):
    __tablename__ = "order"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    object_id = Column(Integer)
    order_type = Column(SqlEnum(OrderType, name="order_type"))
    object_type = Column(SqlEnum(ObjectType, name="object_type"))
    total_price = Column(DECIMAL)
    order_date = Column(Date)
    payment_type = Column(SqlEnum(PaymentType, name="payment_type"))
    booking_deposit = Column(DECIMAL)
    booking_expiration_date = Column(Date)
    status = Column(SqlEnum(OrderStatus, name="order_status"))

    user = relationship("User", back_populates="orders")
    wallet_transactions = relationship("WalletTransaction", back_populates="order")


class Favorites(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    object_id = Column(Integer)
    object_type = Column(SqlEnum(ObjectType, name="object_type"))
    created_at = Column(Date)

    user = relationship("User", back_populates="favorites")


class UserWallet(Base):
    __tablename__ = "user_wallet"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    balance = Column(DECIMAL)
    loyalty_points = Column(DECIMAL)
    isActive = Column(Boolean)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    user = relationship("User", back_populates="wallet")
    transactions = relationship("WalletTransaction", back_populates="wallet")


class WalletTransaction(Base):
    __tablename__ = "wallet_transaction"

    id = Column(Integer, primary_key=True)
    transaction_type = Column(SqlEnum(TransactionType, name="transaction_type"))
    wallet_id = Column(Integer, ForeignKey("user_wallet.id"))
    amount = Column(DECIMAL)
    balance_before = Column(DECIMAL)
    balance_after = Column(DECIMAL)
    description = Column(String)
    order_id = Column(Integer, ForeignKey("order.id"))
    created_at = Column(DateTime)

    wallet = relationship("UserWallet", back_populates="transactions")
    order = relationship("Order", back_populates="wallet_transactions")


class InfrastructureCategory(str, Enum):
    education = "Education"  # Образование
    shopping = "Shopping"  # Покупки и развлечения
    parks = "Parks"  # Парки и отдых
    health = "Health"  # Здоровье
    transport = "Transport"  # Транспорт
    sports = "Sports"  # Спорт
    restaurants = "Restaurants"  # Рестораны и кафе
    services = "Services"  # Услуги


class Infrastructure(Base):
    __tablename__ = "infrastructure"

    id = Column(Integer, primary_key=True)
    residential_complex_id = Column(Integer, ForeignKey("residential_complex.id"))
    category = Column(SqlEnum(InfrastructureCategory, name="infrastructure_category"))
    name = Column(String, nullable=False)
    distance = Column(String)  # Например: "5 мин", "500 м", "10 мин пешком"
    description = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relations
    residential_complex = relationship("ResidentialComplex", back_populates="infrastructures")


class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    short_description = Column(String, nullable=True)
    description = Column(String, nullable=True)
    discount_percentage = Column(DECIMAL(5, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    image_url = Column(String, nullable=True)
    residential_complex_id = Column(Integer, ForeignKey("residential_complex.id"), nullable=True)
    apartment_type = Column(SqlEnum(ApartmentType, name="apartment_type"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    residential_complex = relationship("ResidentialComplex", back_populates="promotions")


