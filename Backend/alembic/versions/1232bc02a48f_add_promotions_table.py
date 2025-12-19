"""add_promotions_table

Revision ID: 1232bc02a48f
Revises: cd86fdc78502
Create Date: 2025-12-19 11:00:19.998392

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '1232bc02a48f'
down_revision: Union[str, Sequence[str], None] = 'cd86fdc78502'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE promotions (
            id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            short_description VARCHAR,
            description VARCHAR,
            discount_percentage DECIMAL(5, 2) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            residential_complex_id INTEGER REFERENCES residential_complex(id),
            apartment_type apartment_type,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    """)


def downgrade() -> None:
    op.drop_table('promotions')
