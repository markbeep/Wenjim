"""Defines all the models used"""

from peewee import (
    Model,
    PostgresqlDatabase,
    TextField,
    ForeignKeyField,
    IntegerField,
    BooleanField,
    TimestampField,
    BitField,
)
import os


database = PostgresqlDatabase(
    os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT"),
)


class BaseModel(Model):
    """Base model that defines the same database"""

    class Meta:
        """Defines the database"""

        database = database


class Events(BaseModel):
    """
    Corresponds to the unique activities taking place on a
    daily basis
    """

    sport = TextField()
    title = TextField()
    location = TextField()
    niveau = TextField()

    class Meta:
        """Makes the events be unique in all its fields"""

        indexes = ((("sport", "title", "location", "niveau"), True),)


class Lessons(BaseModel):
    """
    The specific lessons
    taking place at a specific time
    on a given day
    """

    event = ForeignKeyField(Events, backref="lessons")
    nid = IntegerField(unique=True)
    places_max = IntegerField()
    cancelled = BooleanField()
    livestream = BooleanField()
    from_date = TimestampField()
    to_date = TimestampField()


class Trackings(BaseModel):
    """
    The amount of places free at a given track time.
    """

    lesson = ForeignKeyField(Lessons, backref="trackings")
    track_date = TimestampField()
    places_free = IntegerField()


class Statistics(BaseModel):
    """
    Statistics about when what event was accessed (event is null for index page)
    """

    event = ForeignKeyField(Events, backref="statistics", null=True)
    flags = BitField()
    is_history = flags.flag(1)
    is_places = flags.flag(2)
    is_weekly = flags.flag(4)
    track_date = TimestampField()
