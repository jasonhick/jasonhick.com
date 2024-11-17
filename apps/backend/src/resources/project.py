from datetime import datetime

from backend.src.database import db
from backend.src.models import Project
from flask_restx import Namespace, Resource, fields

project_ns = Namespace("projects", description="Project operations")

project_model = project_ns.model(
    "Project",
    {
        "id": fields.Integer(readonly=True, description="Project ID"),
        "title": fields.String(required=True, description="Project title"),
        "description": fields.String(required=True, description="Project description"),
        "features": fields.List(fields.String, description="Project features", default=[]),
        "thumbnail_url": fields.String(required=True, description="Thumbnail URL"),
        "live_url": fields.String(description="Live project URL", nullable=True, allow_null=True),
        "github_url": fields.String(description="GitHub repository URL", nullable=True, allow_null=True),
        "start_date": fields.String(required=True, description="Project start date"),
        "end_date": fields.String(required=True, description="Project end date"),
        "is_featured": fields.Boolean(description="Featured project status", default=False),
        "client_id": fields.Integer(description="Associated client ID", nullable=True, allow_null=True),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)

def parse_datetime(date_str):
    """Parse datetime from string, return None for empty/invalid values"""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None

@project_ns.route("/")
class ProjectList(Resource):
    @project_ns.marshal_list_with(project_model)
    def get(self):
        """List all projects"""
        return Project.query.all()

    @project_ns.expect(project_model)
    @project_ns.marshal_with(project_model)
    def post(self):
        """Create a new project"""
        data = project_ns.payload
        
        if not data.get('title'):
            project_ns.abort(400, "Title is required")

        # Handle dates
        start_date = None if not data.get('start_date') else parse_datetime(data['start_date'])
        end_date = None if not data.get('end_date') else parse_datetime(data['end_date'])

        project = Project(
            title=data['title'],
            description=data.get('description'),
            features=data.get('features', []),
            thumbnail_url=data.get('thumbnail_url'),
            live_url=data.get('live_url'),
            github_url=data.get('github_url'),
            start_date=start_date,
            end_date=end_date,
            is_featured=data.get('is_featured', False),
            client_id=data.get('client_id')
        )
        
        db.session.add(project)
        db.session.commit()
        return project

@project_ns.route("/<int:project_id>")
class ProjectResource(Resource):
    @project_ns.marshal_with(project_model)
    def get(self, project_id):
        """Fetch a project by ID"""
        return Project.query.get_or_404(project_id)

    @project_ns.expect(project_model)
    @project_ns.marshal_with(project_model)
    def put(self, project_id):
        """Update a project"""
        project = Project.query.get_or_404(project_id)
        data = project_ns.payload

        if not data.get('title'):
            project_ns.abort(400, "Title is required")
            
        # Handle dates
        start_date = None if not data.get('start_date') else parse_datetime(data['start_date'])
        end_date = None if not data.get('end_date') else parse_datetime(data['end_date'])
            
        project.title = data['title']
        project.description = data.get('description')
        project.features = data.get('features', [])
        project.thumbnail_url = data.get('thumbnail_url')
        project.live_url = data.get('live_url')
        project.github_url = data.get('github_url')
        project.start_date = start_date
        project.end_date = end_date
        project.is_featured = data.get('is_featured', False)
        project.client_id = data.get('client_id')

        db.session.commit()
        return project

    @project_ns.response(204, 'Project deleted')
    def delete(self, project_id):
        """Delete a project"""
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return '', 204
