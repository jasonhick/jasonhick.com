from datetime import datetime

from backend.src.database import db
from backend.src.models import Client
from flask_restx import Namespace, Resource, fields

client_ns = Namespace("clients", description="Client operations")

# Nested models
project_minimal = client_ns.model(
    "ProjectMinimal",
    {
        "id": fields.Integer(description="Project ID"),
        "title": fields.String(description="Project title"),
    },
)

# Common field definitions for create/update
client_fields = {
    "name": fields.String(required=True, description="Client name"),
    "description": fields.String(description="Client description"),
    "features": fields.List(fields.String, description="Client features", default=[]),
    "skills": fields.List(
        fields.String, description="Skills used at client", default=[]
    ),
    "location": fields.String(description="Client location"),
    "role": fields.String(description="Role at client"),
    "website": fields.String(description="Client website URL"),
    "start_date": fields.String(description="Start date"),
    "end_date": fields.String(description="End date"),
    "projects": fields.List(
        fields.Nested(project_minimal), description="Associated projects"
    ),
}

# Fields for update operations
client_update_fields = {
    "id": fields.Integer(required=True, readonly=True, description="Client ID"),
    **client_fields,
}

# Readonly fields for responses
readonly_fields = {
    "id": fields.Integer(readonly=True, description="Client ID"),
    "created_at": fields.DateTime(readonly=True),
    "updated_at": fields.DateTime(readonly=True),
}

# Model for POST operations (create)
client_create_model = client_ns.model("ClientCreate", client_fields)

# Model for PUT operations (update)
client_update_model = client_ns.model("ClientUpdate", client_update_fields)

# Full model including readonly fields (for responses)
client_model = client_ns.model("Client", {**client_fields, **readonly_fields})


def parse_datetime(date_str):
    """Parse datetime from string, return None for empty/invalid values"""
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


@client_ns.route("/")
class ClientList(Resource):
    @client_ns.marshal_list_with(client_model)
    def get(self):
        """List all clients"""
        return Client.query.all()

    @client_ns.expect(client_create_model)
    @client_ns.marshal_with(client_model)
    def post(self):
        """Create a new client"""
        data = client_ns.payload

        if not data.get("name"):
            client_ns.abort(400, "Name is required")

        # Handle dates
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        client = Client(
            name=data["name"],
            description=data.get("description"),
            features=data.get("features", []),
            skills=data.get("skills", []),
            location=data.get("location"),
            role=data.get("role"),
            website=data.get("website"),
            start_date=start_date,
            end_date=end_date,
        )

        db.session.add(client)
        db.session.commit()
        return client


@client_ns.route("/<int:client_id>")
class ClientResource(Resource):
    @client_ns.marshal_with(client_model)
    def get(self, client_id):
        """Fetch a client by ID"""
        return Client.query.get_or_404(client_id)

    @client_ns.expect(client_update_model)
    @client_ns.marshal_with(client_model)
    def put(self, client_id):
        """Update a client"""
        client = Client.query.get_or_404(client_id)
        data = client_ns.payload

        if not data.get("name"):
            client_ns.abort(400, "Name is required")

        # Handle dates
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        client.name = data["name"]
        client.description = data.get("description")
        client.features = data.get("features", [])
        client.skills = data.get("skills", [])
        client.location = data.get("location")
        client.role = data.get("role")
        client.website = data.get("website")
        client.start_date = start_date
        client.end_date = end_date

        db.session.commit()
        return client

    @client_ns.response(204, "Client deleted")
    def delete(self, client_id):
        """Delete a client"""
        client = Client.query.get_or_404(client_id)
        db.session.delete(client)
        db.session.commit()
        return "", 204
