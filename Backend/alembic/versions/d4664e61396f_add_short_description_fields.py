"""add_short_description_fields

Revision ID: d4664e61396f
Revises: e785fae8030b
Create Date: 2025-12-10 23:03:42.721615

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4664e61396f'
down_revision: Union[str, Sequence[str], None] = 'e785fae8030b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add short_description to residential_complex
    op.add_column('residential_complex', sa.Column('short_description', sa.String(length=300), nullable=True))

    # Add short_description to building
    op.add_column('building', sa.Column('short_description', sa.String(length=300), nullable=True))

    # Add description and short_description to apartment
    op.add_column('apartment', sa.Column('description', sa.String(), nullable=True))
    op.add_column('apartment', sa.Column('short_description', sa.String(length=300), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove fields from apartment
    op.drop_column('apartment', 'short_description')
    op.drop_column('apartment', 'description')

    # Remove short_description from building
    op.drop_column('building', 'short_description')

    # Remove short_description from residential_complex
    op.drop_column('residential_complex', 'short_description')
