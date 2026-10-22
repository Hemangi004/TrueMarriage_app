"""create_premium_interest_events_table

Revision ID: f9e8d7c6b5a4
Revises: aac065c8757b
Create Date: 2026-08-24 13:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9e8d7c6b5a4'
down_revision: Union[str, Sequence[str], None] = 'aac065c8757b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('premium_interest_events',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=True),
        sa.Column('event_type', sa.String(length=64), server_default='PREMIUM_CLICK', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('premium_interest_events', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_premium_interest_events_user_id'), ['user_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_premium_interest_events_event_type'), ['event_type'], unique=False)
        batch_op.create_index(batch_op.f('ix_premium_interest_events_created_at'), ['created_at'], unique=False)
        batch_op.create_index('ix_premium_events_type_user', ['event_type', 'user_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('premium_interest_events', schema=None) as batch_op:
        batch_op.drop_index('ix_premium_events_type_user')
        batch_op.drop_index(batch_op.f('ix_premium_interest_events_created_at'))
        batch_op.drop_index(batch_op.f('ix_premium_interest_events_event_type'))
        batch_op.drop_index(batch_op.f('ix_premium_interest_events_user_id'))

    op.drop_table('premium_interest_events')
