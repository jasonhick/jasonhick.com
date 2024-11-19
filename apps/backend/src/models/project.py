from datetime import UTC, datetime

from backend.src.database import db

# Association table for Project-Skill many-to-many relationship
project_skills = db.Table(
    "project_skills",
    db.Column(
        "project_id",
        db.Integer,
        db.ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    db.Column(
        "skill_id",
        db.Integer,
        db.ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Project(db.Model):
    __tablename__ = "projects"

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    features = db.Column(db.ARRAY(db.String), default=[], nullable=False)
    live_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_current = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)

    # Foreign Keys
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"))

    # Relationships
    client = db.relationship(
        "Client",
        back_populates="projects",
        lazy="select",  # Change from default to explicit select
    )

    skills = db.relationship(
        "Skill",
        secondary=project_skills,
        lazy="joined",
        back_populates="projects",
        cascade="all, delete",
    )

    images = db.relationship(
        "Image",
        back_populates="project",
        lazy="joined",
        order_by="Image.order",
        cascade="all, delete-orphan",
    )

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    def __repr__(self):
        return f"<Project {self.title}>"
