import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/portfolio",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # URL Configuration for swagger generation
    SERVER_NAME = "localhost:5000"
    APPLICATION_ROOT = "/"
    PREFERRED_URL_SCHEME = "http"

    # Swagger UI Configuration
    SWAGGER_UI_DOC_EXPANSION = "list"
    RESTX_VALIDATE = True
    RESTX_MASK_SWAGGER = False
