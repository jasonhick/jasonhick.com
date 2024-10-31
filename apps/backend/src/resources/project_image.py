from flask_restx import Namespace, Resource, fields, reqparse

from ..database import db
from ..models import ProjectImage

project_image_ns = Namespace(
    "project-images", description="Project image operations"
)

# Define models for swagger documentation
project_image_model = project_image_ns.model(
    "ProjectImage",
    {
        "id": fields.Integer(readonly=True),
        "url": fields.String(required=True, description="Image URL"),
        "caption": fields.String(description="Image caption"),
        "order": fields.Integer(description="Display order"),
        "project_id": fields.Integer(
            required=True, description="Associated project ID"
        ),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)

# Request parser for validation
project_image_parser = reqparse.RequestParser()
project_image_parser.add_argument(
    "url", type=str, required=True, help="URL is required"
)
project_image_parser.add_argument("caption", type=str)
project_image_parser.add_argument("order", type=int, default=0)
project_image_parser.add_argument(
    "project_id", type=int, required=True, help="Project ID is required"
)


@project_image_ns.route("/")
class ProjectImageList(Resource):
    @project_image_ns.marshal_list_with(project_image_model)
    @project_image_ns.doc("list_project_images")
    def get(self):
        """List all project images"""
        return ProjectImage.query.all()

    @project_image_ns.marshal_with(project_image_model)
    @project_image_ns.doc("create_project_image")
    @project_image_ns.expect(project_image_model)
    def post(self):
        """Create a new project image"""
        args = project_image_parser.parse_args()
        project_image = ProjectImage(**args)
        db.session.add(project_image)
        db.session.commit()
        return project_image, 201


@project_image_ns.route("/<int:image_id>")
@project_image_ns.param("image_id", "The project image identifier")
class ProjectImageResource(Resource):
    @project_image_ns.marshal_with(project_image_model)
    @project_image_ns.doc("get_project_image")
    def get(self, image_id):
        """Fetch a project image by ID"""
        return ProjectImage.query.get_or_404(image_id)

    @project_image_ns.marshal_with(project_image_model)
    @project_image_ns.doc("update_project_image")
    @project_image_ns.expect(project_image_model)
    def put(self, image_id):
        """Update a project image"""
        project_image = ProjectImage.query.get_or_404(image_id)
        args = project_image_parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(project_image, key, value)
        db.session.commit()
        return project_image

    @project_image_ns.doc("delete_project_image")
    @project_image_ns.response(204, "Project image deleted")
    def delete(self, image_id):
        """Delete a project image"""
        project_image = ProjectImage.query.get_or_404(image_id)
        db.session.delete(project_image)
        db.session.commit()
        return "", 204
