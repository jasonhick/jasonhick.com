from datetime import UTC, datetime

from backend.src.database import db


class Image(db.Model):
    __tablename__ = "images"

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, nullable=False, default=0)

    # Foreign Keys
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    # Relationships
    project = db.relationship("Project", back_populates="images")

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    def __repr__(self):
        return f"<Image {self.url}>"
