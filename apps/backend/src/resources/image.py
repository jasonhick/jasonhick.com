from flask_restx import Namespace, Resource, fields, reqparse

from ..database import db
from ..models import Image

image_ns = Namespace("images", description="Image operations")

# Define models for swagger documentation
image_model = image_ns.model(
    "Image",
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
image_parser = reqparse.RequestParser()
image_parser.add_argument("url", type=str, required=True, help="URL is required")
image_parser.add_argument("caption", type=str)
image_parser.add_argument("order", type=int, default=0)
image_parser.add_argument(
    "project_id", type=int, required=True, help="Project ID is required"
)


@image_ns.route("/")
class ImageList(Resource):
    @image_ns.marshal_list_with(image_model)
    @image_ns.doc("list_images")
    def get(self):
        """List all images"""
        return Image.query.all()

    @image_ns.marshal_with(image_model)
    @image_ns.doc("create_image")
    @image_ns.expect(image_model)
    def post(self):
        """Create a new image"""
        args = image_parser.parse_args()
        image = Image(**args)
        db.session.add(image)
        db.session.commit()
        return image, 201


@image_ns.route("/<int:image_id>")
@image_ns.param("image_id", "The image identifier")
class ImageResource(Resource):
    @image_ns.marshal_with(image_model)
    @image_ns.doc("get_image")
    def get(self, image_id):
        """Fetch an image by ID"""
        return Image.query.get_or_404(image_id)

    @image_ns.marshal_with(image_model)
    @image_ns.doc("update_image")
    @image_ns.expect(image_model)
    def put(self, image_id):
        """Update an image"""
        image = Image.query.get_or_404(image_id)
        args = image_parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(image, key, value)
        db.session.commit()
        return image

    @image_ns.doc("delete_image")
    @image_ns.response(204, "Image deleted")
    def delete(self, image_id):
        """Delete an image"""
        image = Image.query.get_or_404(image_id)
        db.session.delete(image)
        db.session.commit()
        return "", 204
