from flask_restx import Namespace, Resource, fields, reqparse

from ..database import db
from ..models import Skill

skill_ns = Namespace("skills", description="Skill operations")

# Define models for swagger documentation
skill_model = skill_ns.model(
    "Skill",
    {
        "id": fields.Integer(readonly=True),
        "name": fields.String(required=True, description="Skill name"),
        "created_at": fields.DateTime(readonly=True),
        "updated_at": fields.DateTime(readonly=True),
    },
)

# Request parser for validation
skill_parser = reqparse.RequestParser()
skill_parser.add_argument(
    "name", type=str, required=True, help="Name is required and must be unique"
)


@skill_ns.route("/")
class SkillList(Resource):
    @skill_ns.marshal_list_with(skill_model)
    @skill_ns.doc("list_skills")
    def get(self):
        """List all skills"""
        return Skill.query.all()

    @skill_ns.marshal_with(skill_model)
    @skill_ns.doc("create_skill")
    @skill_ns.expect(skill_model)
    def post(self):
        """Create a new skill"""
        args = skill_parser.parse_args()

        # Check for unique name constraint
        if Skill.query.filter_by(name=args["name"]).first():
            skill_ns.abort(400, "A skill with this name already exists")

        skill = Skill(**args)
        db.session.add(skill)
        db.session.commit()
        return skill, 201


@skill_ns.route("/<int:skill_id>")
@skill_ns.param("skill_id", "The skill identifier")
class SkillResource(Resource):
    @skill_ns.marshal_with(skill_model)
    @skill_ns.doc("get_skill")
    def get(self, skill_id):
        """Fetch a skill by ID"""
        return Skill.query.get_or_404(skill_id)

    @skill_ns.marshal_with(skill_model)
    @skill_ns.doc("update_skill")
    @skill_ns.expect(skill_model)
    def put(self, skill_id):
        """Update a skill"""
        skill = Skill.query.get_or_404(skill_id)
        args = skill_parser.parse_args()

        # Check for unique name constraint if name is being changed
        if (
            args["name"] != skill.name
            and Skill.query.filter_by(name=args["name"]).first()
        ):
            skill_ns.abort(400, "A skill with this name already exists")

        for key, value in args.items():
            if value is not None:
                setattr(skill, key, value)

        db.session.commit()
        return skill

    @skill_ns.doc("delete_skill")
    @skill_ns.response(204, "Skill deleted")
    def delete(self, skill_id):
        """Delete a skill"""
        skill = Skill.query.get_or_404(skill_id)
        db.session.delete(skill)
        db.session.commit()
        return "", 204
