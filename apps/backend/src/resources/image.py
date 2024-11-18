from datetime import datetime

from backend.src.database import db
from backend.src.models import Image
from flask_restx import Namespace, Resource, fields

image_ns = Namespace("images", description="Image operations")

# Nested models
project_minimal = image_ns.model(
    "ProjectMinimal",
    {
        "id": fields.Integer(description="Project ID"),
        "title": fields.String(description="Project title"),
    },
)

# Common field definitions
image_fields = {
    "url": fields.String(required=True, description="Image URL"),
    "caption": fields.String(description="Image caption"),
    "order": fields.Integer(description="Display order", default=0),
    "project_id": fields.Integer(required=True, description="Associated project ID"),
    "project": fields.Nested(project_minimal, description="Associated project"),
}

# Readonly fields for responses
readonly_fields = {
    "id": fields.Integer(readonly=True),
    "created_at": fields.DateTime(readonly=True),
    "updated_at": fields.DateTime(readonly=True),
}

# Fields for update operations
image_update_fields = {
    "id": fields.Integer(required=True, readonly=True, description="Image ID"),
    **image_fields,
}

# Model for POST operations (create)
image_create_model = image_ns.model("ImageCreate", image_fields)

# Model for PUT operations (update)
image_update_model = image_ns.model("ImageUpdate", image_update_fields)

# Full model including readonly fields (for responses)
image_model = image_ns.model("Image", {**image_fields, **readonly_fields})


@image_ns.route("/")
class ImageList(Resource):
    @image_ns.marshal_list_with(image_model)
    def get(self):
        """List all images"""
        return Image.query.all()

    @image_ns.expect(image_create_model)
    @image_ns.marshal_with(image_model)
    def post(self):
        """Create a new image"""
        data = image_ns.payload

        if not data.get("url"):
            image_ns.abort(400, "URL is required")
        if not data.get("project_id"):
            image_ns.abort(400, "Project ID is required")

        image = Image(
            url=data["url"],
            caption=data.get("caption"),
            order=data.get("order", 0),
            project_id=data["project_id"],
        )
        db.session.add(image)
        db.session.commit()
        return image


@image_ns.route("/<int:image_id>")
class ImageResource(Resource):
    @image_ns.marshal_with(image_model)
    def get(self, image_id):
        """Fetch an image by ID"""
        return Image.query.get_or_404(image_id)

    @image_ns.expect(image_update_model)
    @image_ns.marshal_with(image_model)
    def put(self, image_id):
        """Update an image"""
        image = Image.query.get_or_404(image_id)
        data = image_ns.payload

        if not data.get("url"):
            image_ns.abort(400, "URL is required")
        if not data.get("project_id"):
            image_ns.abort(400, "Project ID is required")

        image.url = data["url"]
        image.caption = data.get("caption")
        image.order = data.get("order", image.order)
        image.project_id = data["project_id"]

        db.session.commit()
        return image

    @image_ns.response(204, "Image deleted")
    def delete(self, image_id):
        """Delete an image"""
        image = Image.query.get_or_404(image_id)
        db.session.delete(image)
        db.session.commit()
        return "", 204
