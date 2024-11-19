from datetime import UTC, datetime

from backend.src.database import db


class Client(db.Model):
    __tablename__ = "clients"

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text, nullable=True)
    features = db.Column(db.ARRAY(db.String), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(255), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)

    # Relationships
    projects = db.relationship("Project", back_populates="client", lazy="select")

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    def __repr__(self):
        return f"<Client {self.name}>"
