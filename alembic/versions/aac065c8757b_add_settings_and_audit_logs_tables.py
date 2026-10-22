"""add_settings_and_audit_logs_tables

Revision ID: aac065c8757b
Revises: bde457231113
Create Date: 2026-08-11 20:19:26.026034

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aac065c8757b'
down_revision: Union[str, Sequence[str], None] = 'bde457231113'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('admin_audit_logs',
    sa.Column('id', sa.String(length=64), nullable=False),
    sa.Column('admin_id', sa.String(length=36), nullable=False),
    sa.Column('action', sa.String(length=64), nullable=False),
    sa.Column('target_type', sa.String(length=64), nullable=False),
    sa.Column('target_id', sa.String(length=64), nullable=True),
    sa.Column('details', sa.JSON(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['admin_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('admin_audit_logs', schema=None) as batch_op:
        batch_op.create_index('ix_admin_audit_created_action', ['created_at', 'action'], unique=False)
        batch_op.create_index(batch_op.f('ix_admin_audit_logs_action'), ['action'], unique=False)
        batch_op.create_index(batch_op.f('ix_admin_audit_logs_admin_id'), ['admin_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_admin_audit_logs_created_at'), ['created_at'], unique=False)

    op.create_table('application_settings',
    sa.Column('id', sa.String(length=64), nullable=False),
    sa.Column('key', sa.String(length=64), nullable=False),
    sa.Column('value', sa.String(length=255), nullable=False),
    sa.Column('value_type', sa.String(length=32), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_editable', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_by', sa.String(length=36), nullable=True),
    sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('application_settings', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_application_settings_key'), ['key'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('application_settings', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_application_settings_key'))

    op.drop_table('application_settings')
    with op.batch_alter_table('admin_audit_logs', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_admin_audit_logs_created_at'))
        batch_op.drop_index(batch_op.f('ix_admin_audit_logs_admin_id'))
        batch_op.drop_index(batch_op.f('ix_admin_audit_logs_action'))
        batch_op.drop_index('ix_admin_audit_created_action')

    op.drop_table('admin_audit_logs')
