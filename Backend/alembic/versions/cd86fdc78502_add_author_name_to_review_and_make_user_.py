"""Add author_name to review and make user_id nullable

Revision ID: cd86fdc78502
Revises: 8929eca03e26
Create Date: 2025-12-19 01:46:08.007970

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cd86fdc78502'
down_revision: Union[str, Sequence[str], None] = '8929eca03e26'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Check and add author_name column if it doesn't exist
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('review')]

    if 'author_name' not in columns:
        op.add_column('review', sa.Column('author_name', sa.String(), nullable=True))

    if 'user_id' in columns:
        # Make user_id nullable in review table
        op.alter_column('review', 'user_id',
                        existing_type=sa.Integer(),
                        nullable=True)

    # Remove object_id and object_type columns if they exist (we only use residential_complex_id)
    if 'object_id' in columns:
        op.drop_column('review', 'object_id')

    if 'object_type' in columns:
        op.drop_column('review', 'object_type')


def downgrade() -> None:
    """Downgrade schema."""
    # Restore object_id and object_type columns
    op.add_column('review', sa.Column('object_id', sa.Integer(), nullable=False))
    op.add_column('review', sa.Column('object_type', sa.String(), nullable=False))

    # Make user_id not nullable again
    op.alter_column('review', 'user_id',
                    existing_type=sa.Integer(),
                    nullable=False)

    # Remove author_name column from review table
    op.drop_column('review', 'author_name')
