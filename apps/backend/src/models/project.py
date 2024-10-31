from datetime import UTC, datetime

from ..database import db

# Association table for Project-Skill many-to-many relationship
project_skills = db.Table(
    "project_skills",
    db.Column(
        "project_id",
        db.Integer,
        db.ForeignKey("projects.id"),
        primary_key=True,
    ),
    db.Column(
        "skill_id", db.Integer, db.ForeignKey("skills.id"), primary_key=True
    ),
)


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    features = db.Column(db.ARRAY(db.String), default=[], nullable=False)
    thumbnail_url = db.Column(db.String(255), nullable=False)
    live_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_featured = db.Column(
        db.Boolean,
        default=False,
    )
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC)
    )

    # Foreign Keys
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"))

    # Relationships
    client = db.relationship("Client", back_populates="projects")

    skills = db.relationship(
        "Skill",
        secondary=project_skills,
        lazy="joined",
        backref=db.backref("projects", lazy=True),
    )

    images = db.relationship(
        "ProjectImage",
        backref="project",
        lazy="joined",
        order_by="ProjectImage.order",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Project {self.title}>"
