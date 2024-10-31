from datetime import datetime

from flask_restx import Namespace, Resource, fields, reqparse

from ..database import db
from ..models import Project

project_ns = Namespace("projects", description="Project operations")

# Define models for swagger documentation
project_model = project_ns.model(
    "Project",
    {
        "id": fields.Integer(readonly=True),
        "title": fields.String(required=True, description="Project title"),
        "description": fields.String(
            required=True, description="Project description"
        ),
        "features": fields.List(fields.String, description="Project features"),
        "thumbnail_url": fields.String(
            required=True, description="Thumbnail URL"
        ),
        "live_url": fields.String(description="Live project URL"),
        "github_url": fields.String(description="GitHub repository URL"),
        "start_date": fields.DateTime(
            required=True, description="Project start date"
        ),
        "end_date": fields.DateTime(
            required=True, description="Project end date"
        ),
        "is_featured": fields.Boolean(description="Featured project status"),
        "client_id": fields.Integer(description="Associated client ID"),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)

# Parser for request validation
project_parser = reqparse.RequestParser()
project_parser.add_argument(
    "title", type=str, required=True, help="Title is required"
)
project_parser.add_argument("description", type=str, required=True)
project_parser.add_argument("features", type=list)
project_parser.add_argument("thumbnail_url", type=str, required=True)
project_parser.add_argument("live_url", type=str)
project_parser.add_argument("github_url", type=str)
project_parser.add_argument("start_date", type=str, required=True)
project_parser.add_argument("end_date", type=str, required=True)
project_parser.add_argument("is_featured", type=bool)
project_parser.add_argument("client_id", type=int)


@project_ns.route("/")
class ProjectList(Resource):
    @project_ns.marshal_list_with(project_model)
    @project_ns.doc("list_projects")
    def get(self):
        """List all projects"""
        return Project.query.all()

    @project_ns.marshal_with(project_model)
    @project_ns.doc("create_project")
    @project_ns.expect(project_model)
    def post(self):
        """Create a new project"""
        args = project_parser.parse_args()
        project = Project(**args)
        db.session.add(project)
        db.session.commit()
        return project, 201


@project_ns.route("/<int:project_id>")
@project_ns.param("project_id", "The project identifier")
class ProjectResource(Resource):
    @project_ns.marshal_with(project_model)
    @project_ns.doc("get_project")
    def get(self, project_id):
        """Fetch a project by ID"""
        return Project.query.get_or_404(project_id)

    @project_ns.marshal_with(project_model)
    @project_ns.doc("update_project")
    @project_ns.expect(project_model)
    def put(self, project_id):
        """Update a project"""
        project = Project.query.get_or_404(project_id)
        args = project_parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(project, key, value)
        db.session.commit()
        return project

    @project_ns.doc("delete_project")
    @project_ns.response(204, "Project deleted")
    def delete(self, project_id):
        """Delete a project"""
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return "", 204
