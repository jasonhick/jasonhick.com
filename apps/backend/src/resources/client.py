from datetime import datetime

from backend.src.database import db
from backend.src.models import Client
from flask import request
from flask_restx import Namespace, Resource, fields

# Create namespace
client_ns = Namespace("clients", description="Client operations")

# Model for POST operations (create)
client_create_model = client_ns.model(
    "ClientCreate",
    {
        "name": fields.String(required=True, description="Client name"),
        "description": fields.String(
            required=False, default=None, description="Client description"
        ),
        "features": fields.List(
            fields.String, required=False, default=None, description="Client features"
        ),
        "location": fields.String(
            required=False, default=None, description="Client location"
        ),
        "role": fields.String(required=False, default=None, description="Client role"),
        "website": fields.String(
            required=False, default=None, description="Client website"
        ),
        "start_date": fields.String(
            required=False, default=None, description="Client start date"
        ),
        "end_date": fields.String(
            required=False, default=None, description="Client end date"
        ),
    },
)

# Full model including readonly fields (for PUT and responses)
client_model = client_ns.inherit(
    "Client",
    client_create_model,
    {
        "id": fields.Integer(readonly=True, description="Client ID"),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)


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
        return Client.query.order_by(Client.end_date.desc()).all()

    @client_ns.expect(client_create_model)  # Use create model for POST
    @client_ns.marshal_with(client_model)
    def post(self):
        """Create a new client"""
        data = client_ns.payload

        if not data.get("name"):
            client_ns.abort(400, "Name is required")

        # Handle dates - convert empty strings to None
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        client = Client(
            name=data["name"],
            description=data.get("description", None),
            features=data.get("features", []),
            location=data.get("location", None),
            role=data.get("role", None),
            website=data.get("website", None),
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

    @client_ns.marshal_with(client_model)
    @client_ns.expect(client_model)
    def put(self, client_id):
        """Update a client"""
        client = Client.query.get_or_404(client_id)
        data = client_ns.payload

        if not data.get("name"):
            client_ns.abort(400, "Name is required")

        # Handle dates - convert empty strings to None
        start_date = (
            None if not data.get("start_date") else parse_datetime(data["start_date"])
        )
        end_date = (
            None if not data.get("end_date") else parse_datetime(data["end_date"])
        )

        client.name = data.get("name")
        client.description = data.get("description")
        client.features = data.get("features", [])
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
