from datetime import UTC, datetime

from backend.src.database import db
from backend.src.models.project import project_skills


class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    # Relationships
    projects = db.relationship(
        "Project",
        secondary=project_skills,
        lazy="joined",
        back_populates="skills",
        cascade="all, delete",
    )

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    def __repr__(self):
        return f"<Skill {self.name}>"
