from datetime import datetime

from flask_restx import Namespace, Resource, fields, reqparse

from ..database import db
from ..models import Client

# Create namespace
client_ns = Namespace("clients", description="Client operations")

# Define models for swagger documentation
client_model = client_ns.model(
    "Client",
    {
        "id": fields.Integer(readonly=True),
        "name": fields.String(required=True, description="Client name"),
        "description": fields.String(description="Client description"),
        "website": fields.String(description="Client website URL"),
        "logo_url": fields.String(description="Client logo URL"),
        "start_date": fields.DateTime(description="Project start date"),
        "end_date": fields.DateTime(description="Project end date"),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)


def parse_datetime(date_str):
    if not date_str:
        return None
    try:
        # First try DD/MM/YYYY format
        return datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        try:
            # Fallback to ISO format if DD/MM/YYYY fails
            return datetime.fromisoformat(date_str)
        except ValueError:
            raise ValueError("Date must be in DD/MM/YYYY format")


# Parser for request validation
client_parser = reqparse.RequestParser()
client_parser.add_argument(
    "name", type=str, required=True, help="Name is required"
)
client_parser.add_argument("description", type=str)
client_parser.add_argument("website", type=str)
client_parser.add_argument("logo_url", type=str)
client_parser.add_argument("start_date", type=parse_datetime)
client_parser.add_argument("end_date", type=parse_datetime)


@client_ns.route("/")
class ClientList(Resource):
    @client_ns.marshal_list_with(client_model)
    @client_ns.doc("list_clients")
    def get(self):
        """List all clients"""
        return Client.query.all()

    @client_ns.marshal_with(client_model)
    @client_ns.doc("create_client")
    @client_ns.expect(client_model)
    def post(self):
        """Create a new client"""
        args = client_parser.parse_args()
        client = Client(**args)
        db.session.add(client)
        db.session.commit()
        return client, 201


@client_ns.route("/<int:client_id>")
@client_ns.param("client_id", "The client identifier")
class ClientResource(Resource):
    @client_ns.marshal_with(client_model)
    @client_ns.doc("get_client")
    def get(self, client_id):
        """Fetch a client by ID"""
        return Client.query.get_or_404(client_id)

    @client_ns.marshal_with(client_model)
    @client_ns.doc("update_client")
    @client_ns.expect(client_model)
    def put(self, client_id):
        """Update a client"""
        client = Client.query.get_or_404(client_id)
        args = client_parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(client, key, value)
        db.session.commit()
        return client

    @client_ns.doc("delete_client")
    @client_ns.response(204, "Client deleted")
    def delete(self, client_id):
        """Delete a client"""
        client = Client.query.get_or_404(client_id)
        db.session.delete(client)
        db.session.commit()
        return "", 204
