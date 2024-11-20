from datetime import UTC, datetime

import pytest
from backend.src.database import db
from backend.src.models.skill import Skill


def test_create_skill():
    """Test creating a new skill"""
    skill = Skill(name="Python")

    assert skill.name == "Python"
    assert isinstance(skill.created_at, datetime)
    assert isinstance(skill.updated_at, datetime)
    assert skill.projects == []


def test_skill_representation():
    """Test the string representation of a skill"""
    skill = Skill(name="JavaScript")

    assert str(skill) == "<Skill JavaScript>"


@pytest.mark.parametrize(
    "name,expected",
    [
        ("Python", "Python"),
        ("JavaScript", "JavaScript"),
        ("Angular", "Angular"),
    ],
)
def test_skill_name_assignment(name, expected):
    """Test different skill name assignments"""
    skill = Skill(name=name)
    assert skill.name == expected


@pytest.fixture
def sample_skill():
    """Fixture to create a test skill"""
    skill = Skill(name="Test Skill")
    db.session.add(skill)
    db.session.commit()
    yield skill
    db.session.delete(skill)
    db.session.commit()


def test_skill_uniqueness(sample_skill):
    """Test that skill names must be unique"""
    duplicate_skill = Skill(name="Test Skill")
    db.session.add(duplicate_skill)

    with pytest.raises(Exception):  # SQLAlchemy will raise an integrity error
        db.session.commit()

    db.session.rollback()


def test_timestamps_auto_update(sample_skill):
    """Test that timestamps are automatically updated"""
    original_updated_at = sample_skill.updated_at

    # Wait a moment to ensure timestamp difference
    from time import sleep

    sleep(0.1)

    sample_skill.name = "Updated Skill"
    db.session.commit()

    assert sample_skill.updated_at > original_updated_at
    assert sample_skill.created_at < sample_skill.updated_at
