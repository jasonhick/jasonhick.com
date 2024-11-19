from datetime import datetime

from backend.src.database import db
from backend.src.models import Project, Skill
from flask_restx import Namespace, Resource, fields

project_ns = Namespace("projects", description="Project operations")

# Nested models
client_minimal = project_ns.model(
    "ClientMinimal",
    {
        "id": fields.Integer(description="Client ID"),
        "name": fields.String(description="Client name"),
    },
)

image_minimal = project_ns.model(
    "ImageMinimal",
    {
        "id": fields.Integer(description="Image ID"),
        "url": fields.String(description="Image URL"),
        "caption": fields.String(description="Image caption"),
        "order": fields.Integer(description="Display order"),
    },
)

# Common field definitions
project_fields = {
    "title": fields.String(required=True, description="Project title"),
    "description": fields.String(required=True, description="Project description"),
    "features": fields.List(fields.String, description="Project features", default=[]),
    "live_url": fields.String(description="Live project URL", allow_null=True),
    "github_url": fields.String(description="GitHub repository URL", allow_null=True),
    "start_date": fields.String(required=True, description="Project start date"),
    "end_date": fields.String(required=True, description="Project end date"),
    "is_featured": fields.Boolean(description="Featured project status", default=False),
    "is_current": fields.Boolean(description="Current project status", default=False),
    "client_id": fields.Integer(description="Associated client ID", allow_null=True),
    "skills": fields.List(
        fields.Integer,
        description="Project skill IDs",
        default=[],
        attribute=lambda x: [skill.id for skill in x.skills],
    ),
    "images": fields.List(fields.Nested(image_minimal), description="Project images"),
}

# Readonly fields for responses
readonly_fields = {
    "id": fields.Integer(readonly=True, description="Project ID"),
    "client": fields.Nested(client_minimal, description="Associated client"),
    "created_at": fields.DateTime(readonly=True),
    "updated_at": fields.DateTime(readonly=True),
}

# Fields for update operations
project_update_fields = {
    "id": fields.Integer(required=True, readonly=True, description="Project ID"),
    **project_fields,
}

# Model for POST operations (create)
project_create_model = project_ns.model("ProjectCreate", project_fields)

# Model for PUT operations (update)
project_update_model = project_ns.model("ProjectUpdate", project_update_fields)

# Full model including readonly fields (for responses)
project_model = project_ns.model("Project", {**project_fields, **readonly_fields})


def parse_datetime(date_str):
    """Parse datetime from string, return None for empty/invalid values"""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


@project_ns.route("/")
class ProjectList(Resource):
    @project_ns.marshal_list_with(project_model)
    def get(self):
        """List all projects"""
        return Project.query.all()

    @project_ns.expect(project_create_model)
    @project_ns.marshal_with(project_model)
    def post(self):
        """Create a new project"""
        data = project_ns.payload

        # Validation
        if not data.get("title"):
            project_ns.abort(400, "Title is required")
        if not data.get("description"):
            project_ns.abort(400, "Description is required")
        if not data.get("start_date"):
            project_ns.abort(400, "Start date is required")
        if not data.get("end_date"):
            project_ns.abort(400, "End date is required")

        # Handle dates
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        # Create project with basic fields
        project = Project(
            title=data["title"],
            description=data.get("description"),
            features=data.get("features", []),
            live_url=data.get("live_url"),
            github_url=data.get("github_url"),
            start_date=start_date,
            end_date=end_date,
            is_featured=data.get("is_featured", False),
            is_current=data.get("is_current", False),
            client_id=data.get("client_id"),
        )

        # Handle skills explicitly
        if "skills" in data:
            skill_ids = data.get("skills", [])
            if skill_ids:
                skills = Skill.query.filter(Skill.id.in_(skill_ids)).all()
                project.skills = skills

        db.session.add(project)
        db.session.commit()
        return project


@project_ns.route("/<int:project_id>")
class ProjectResource(Resource):
    @project_ns.marshal_with(project_model)
    def get(self, project_id):
        """Fetch a project by ID"""
        return Project.query.get_or_404(project_id)

    @project_ns.expect(project_update_model)
    @project_ns.marshal_with(project_model)
    def put(self, project_id):
        """Update a project"""
        project = Project.query.get_or_404(project_id)
        data = project_ns.payload

        if not data.get("title"):
            project_ns.abort(400, "Title is required")
        if not data.get("description"):
            project_ns.abort(400, "Description is required")
        if not data.get("start_date"):
            project_ns.abort(400, "Start date is required")
        if not data.get("end_date"):
            project_ns.abort(400, "End date is required")

        # Handle dates
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        # Update basic fields first
        project.title = data["title"]
        project.description = data.get("description")
        project.features = data.get("features", [])
        project.live_url = data.get("live_url")
        project.github_url = data.get("github_url")
        project.start_date = start_date
        project.end_date = end_date
        project.is_featured = data.get("is_featured", False)
        project.is_current = data.get("is_current", False)
        project.client_id = data.get("client_id")

        # Handle skills update explicitly
        if "skills" in data:
            skill_ids = data.get("skills", [])
            # Clear existing skills
            project.skills = []
            db.session.flush()
            # Add new skills
            if skill_ids:
                skills = Skill.query.filter(Skill.id.in_(skill_ids)).all()
                project.skills = skills

        db.session.commit()
        return project

    @project_ns.response(204, "Project deleted")
    def delete(self, project_id):
        """Delete a project"""
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return "", 204
