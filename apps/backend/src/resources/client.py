from datetime import datetime

from backend.src.database import db
from backend.src.models import Client
from flask_restx import Namespace, Resource, fields, reqparse

# Create namespace
client_ns = Namespace("clients", description="Client operations")

# Define models for swagger documentation
client_model = client_ns.model(
    "Client",
    {
        "id": fields.Integer(readonly=True, description="Client ID"),
        "name": fields.String(required=True, description="Client name"),
        "description": fields.String(description="Client description"),
        "features": fields.List(fields.String, description="Client features"),
        "location": fields.String(description="Client location"),
        "role": fields.String(description="Role at client"),
        "website": fields.String(description="Client website URL"),
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
client_parser.add_argument("features", type=list)
client_parser.add_argument("location", type=str)
client_parser.add_argument("role", type=str)
client_parser.add_argument("website", type=str)
client_parser.add_argument("start_date", type=parse_datetime)
client_parser.add_argument("end_date", type=parse_datetime)


@client_ns.route("/")
class ClientList(Resource):
    @client_ns.marshal_list_with(client_model)
    @client_ns.doc("list_clients")
    def get(self):
        """List all clients"""
        return Client.query.all()

    @client_ns.expect(client_model)
    @client_ns.marshal_with(client_model)
    def post(self):
        data = client_ns.payload
        
        # Ensure features is a list of strings, not individual characters
        if isinstance(data.get('features'), list):
            features = data['features']
        else:
            features = []

        client = Client(
            name=data['name'],
            description=data.get('description'),
            features=features,  # This will now be a proper list
            location=data.get('location'),
            role=data.get('role'),
            website=data.get('website'),
            start_date=parse_datetime(data.get('start_date')),
            end_date=parse_datetime(data.get('end_date'))
        )
        
        db.session.add(client)
        db.session.commit()
        return client


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
        data = client_ns.payload

        # Ensure features is a list of strings, not individual characters
        if isinstance(data.get('features'), list):
            features = data['features']
        else:
            features = []

        # Update client fields
        client.name = data['name']
        client.description = data.get('description')
        client.features = features
        client.location = data.get('location')
        client.role = data.get('role')
        client.website = data.get('website')
        client.start_date = parse_datetime(data.get('start_date'))
        client.end_date = parse_datetime(data.get('end_date'))

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
