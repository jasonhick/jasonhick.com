from datetime import UTC, datetime

from ..database import db


class ProjectImage(db.Model):
    __tablename__ = "project_images"

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(200), nullable=True)
    order = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    # Foreign Keys
    project_id = db.Column(
        db.Integer, db.ForeignKey("projects.id"), nullable=False
    )

    def __repr__(self):
        return f"<ProjectImage {self.url}>"
