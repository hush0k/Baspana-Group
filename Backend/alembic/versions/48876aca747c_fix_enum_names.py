"""fix enum names

Revision ID: 48876aca747c
Revises: 88106df8f761
Create Date: 2025-10-06 09:40:35.918510
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '48876aca747c'
down_revision: Union[str, Sequence[str], None] = '88106df8f761'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# --- новые Enum типы ---
property_status = sa.Enum('free', 'booked', 'sold', name='property_status')
building_status = sa.Enum('project', 'under_construction', 'completed', name='building_status')
order_status = sa.Enum('pending', 'offering', 'cancelled', 'completed', name='order_status')


def upgrade() -> None:
    bind = op.get_bind()

    # 1️⃣ Создаём новые enum-типы
    property_status.create(bind, checkfirst=True)
    building_status.create(bind, checkfirst=True)
    order_status.create(bind, checkfirst=True)

    # 2️⃣ Меняем типы колонок с указанием CAST-а
    op.alter_column(
        'apartment', 'status',
        existing_type=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        type_=property_status,
        postgresql_using='status::text::property_status',
        existing_nullable=True
    )

    op.alter_column(
        'building', 'status',
        existing_type=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        type_=building_status,
        postgresql_using='status::text::building_status',
        existing_nullable=True
    )

    op.alter_column(
        'commercial_unit', 'status',
        existing_type=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        type_=property_status,
        postgresql_using='status::text::property_status',
        existing_nullable=True
    )

    op.alter_column(
        'order', 'status',
        existing_type=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        type_=order_status,
        postgresql_using='status::text::order_status',
        existing_nullable=True
    )


def downgrade() -> None:
    bind = op.get_bind()

    op.alter_column(
        'order', 'status',
        existing_type=order_status,
        type_=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        postgresql_using='status::text::status',
        existing_nullable=True
    )

    op.alter_column(
        'commercial_unit', 'status',
        existing_type=property_status,
        type_=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        postgresql_using='status::text::status',
        existing_nullable=True
    )

    op.alter_column(
        'building', 'status',
        existing_type=building_status,
        type_=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        postgresql_using='status::text::status',
        existing_nullable=True
    )

    op.alter_column(
        'apartment', 'status',
        existing_type=property_status,
        type_=postgresql.ENUM('project', 'under_construction', 'completed', name='status'),
        postgresql_using='status::text::status',
        existing_nullable=True
    )

    # 3️⃣ Удаляем новые enum-типы
    property_status.drop(bind, checkfirst=True)
    building_status.drop(bind, checkfirst=True)
    order_status.drop(bind, checkfirst=True)
