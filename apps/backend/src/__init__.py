import json
from pathlib import Path

from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restx import Api, Resource

from .config import Config
from .database import db, init_db
from .resources import client_ns, project_image_ns, project_ns, skill_ns


def generate_swagger_file(app, api):
    """Generate swagger.json file in static directory"""
    try:
        with app.app_context():
            swagger_path = Path(app.root_path) / "static" / "swagger.json"
            swagger_path.parent.mkdir(parents=True, exist_ok=True)

            with swagger_path.open("w", encoding="utf-8") as f:
                json.dump(api.__schema__, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: Could not generate swagger file: {e}")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes
    CORS(
        app,
        resources={
            r"/*": {
                "origins": ["http://localhost:4200"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
            }
        },
    )

    # Additional CORS handling for preflight requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers["Access-Control-Allow-Origin"] = (
                "http://localhost:4200"
            )
            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, DELETE, OPTIONS"
            )
            response.headers["Access-Control-Allow-Headers"] = (
                "Content-Type, Authorization"
            )
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    # Initialize API
    api = Api(
        app,
        version="1.0",
        title="Portfolio API",
        description="A portfolio management API",
        prefix="/api",
        doc="/api/docs",
    )

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)

    # Initialize database and models
    init_db(app)

    # Add namespaces
    api.add_namespace(client_ns)
    api.add_namespace(project_ns)
    api.add_namespace(project_image_ns)
    api.add_namespace(skill_ns)

    # Add swagger.json endpoint to the API
    @api.route("/swagger.json")
    class SwaggerJson(Resource):
        def get(self):
            return api.__schema__

    # Generate swagger file at startup
    generate_swagger_file(app, api)

    return app


# Create the app instance
app = create_app()
