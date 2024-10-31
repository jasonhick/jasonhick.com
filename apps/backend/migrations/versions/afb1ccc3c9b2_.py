"""empty message

Revision ID: afb1ccc3c9b2
Revises: 
Create Date: 2024-10-29 12:56:39.170824

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'afb1ccc3c9b2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.alter_column('description',
               existing_type=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('logo_url',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
        batch_op.drop_column('end_date')
        batch_op.drop_column('start_date')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('clients', schema=None) as batch_op:
        batch_op.add_column(sa.Column('start_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('end_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
        batch_op.alter_column('logo_url',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('description',
               existing_type=sa.TEXT(),
               nullable=False)

    # ### end Alembic commands ###