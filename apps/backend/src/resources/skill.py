from datetime import datetime

from backend.src.database import db
from backend.src.models import Skill
from flask_restx import Namespace, Resource, fields

skill_ns = Namespace("skills", description="Skill operations")

# Nested model for minimal project details
project_minimal = skill_ns.model(
    "ProjectMinimal",
    {
        "id": fields.Integer(description="Project ID"),
        "title": fields.String(description="Project title"),
    },
)

# Common field definitions
skill_fields = {
    "name": fields.String(required=True, description="Skill name"),
    "projects": fields.List(
        fields.Nested(project_minimal),
        description="Associated projects",
    ),
}

# Readonly fields for responses
readonly_fields = {
    "id": fields.Integer(readonly=True, description="Skill ID"),
    "created_at": fields.DateTime(readonly=True),
    "updated_at": fields.DateTime(readonly=True),
}

# Fields for update operations
skill_update_fields = {
    "id": fields.Integer(required=True, readonly=True, description="Skill ID"),
    **skill_fields,
}

# Model for POST operations (create)
skill_create_model = skill_ns.model("SkillCreate", skill_fields)

# Model for PUT operations (update)
skill_update_model = skill_ns.model("SkillUpdate", skill_update_fields)

# Full model including readonly fields (for responses)
skill_model = skill_ns.model("Skill", {**skill_fields, **readonly_fields})


@skill_ns.route("/")
class SkillList(Resource):
    @skill_ns.marshal_list_with(skill_model)
    def get(self):
        """List all skills"""
        return Skill.query.order_by(db.func.lower(Skill.name)).all()

    @skill_ns.expect(skill_create_model)
    @skill_ns.marshal_with(skill_model)
    def post(self):
        """Create a new skill"""
        data = skill_ns.payload

        if not data.get("name"):
            skill_ns.abort(400, "Name is required")

        # Check for unique name constraint
        if Skill.query.filter(
            db.func.lower(Skill.name) == db.func.lower(data["name"])
        ).first():
            skill_ns.abort(400, "A skill with this name already exists")

        skill = Skill(name=data["name"])
        db.session.add(skill)
        db.session.commit()
        return skill


@skill_ns.route("/<int:skill_id>")
class SkillResource(Resource):
    @skill_ns.marshal_with(skill_model)
    def get(self, skill_id):
        """Fetch a skill by ID"""
        return Skill.query.get_or_404(skill_id)

    @skill_ns.expect(skill_update_model)
    @skill_ns.marshal_with(skill_model)
    def put(self, skill_id):
        """Update a skill"""
        skill = Skill.query.get_or_404(skill_id)
        data = skill_ns.payload

        if not data.get("name"):
            skill_ns.abort(400, "Name is required")

        # Check for unique name constraint, excluding current skill
        existing = Skill.query.filter(
            db.func.lower(Skill.name) == db.func.lower(data["name"]),
            Skill.id != skill_id,
        ).first()
        if existing:
            skill_ns.abort(400, "A skill with this name already exists")

        skill.name = data["name"]
        db.session.commit()
        return skill

    @skill_ns.response(204, "Skill deleted")
    def delete(self, skill_id):
        """Delete a skill"""
        skill = Skill.query.get_or_404(skill_id)
        db.session.delete(skill)
        db.session.commit()
        return "", 204
