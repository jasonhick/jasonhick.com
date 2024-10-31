from datetime import UTC, datetime

from ..database import db


class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(255))
    logo_url = db.Column(db.String(255))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )
    projects = db.relationship(
        "Project", back_populates="client", lazy="dynamic"
    )

    def __repr__(self):
        return f"<Client {self.name}>"
