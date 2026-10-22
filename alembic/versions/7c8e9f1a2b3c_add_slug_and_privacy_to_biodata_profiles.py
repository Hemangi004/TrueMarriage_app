"""add_slug_and_privacy_to_biodata_profiles

Revision ID: 7c8e9f1a2b3c
Revises: f9e8d7c6b5a4
Create Date: 2026-08-27 12:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c8e9f1a2b3c'
down_revision: Union[str, Sequence[str], None] = ('f9e8d7c6b5a4', 'e7bdfd9eb807')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add slug column
    op.add_column('biodata_profiles', sa.Column('slug', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_biodata_profiles_slug'), 'biodata_profiles', ['slug'], unique=True)

    # Add privacy & password protection columns
    op.add_column('biodata_profiles', sa.Column('is_password_protected', sa.Boolean(), server_default='0', nullable=False))
    op.add_column('biodata_profiles', sa.Column('passcode_hash', sa.String(length=255), nullable=True))
    op.add_column('biodata_profiles', sa.Column('hide_contact_details', sa.Boolean(), server_default='0', nullable=False))


def downgrade() -> None:
    op.drop_column('biodata_profiles', 'hide_contact_details')
    op.drop_column('biodata_profiles', 'passcode_hash')
    op.drop_column('biodata_profiles', 'is_password_protected')
    op.drop_index(op.f('ix_biodata_profiles_slug'), table_name='biodata_profiles')
    op.drop_column('biodata_profiles', 'slug')
