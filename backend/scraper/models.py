"""Defines all the models used"""

from peewee import (
    Model,
    SqliteDatabase,
    TextField,
    ForeignKeyField,
    IntegerField,
    BooleanField,
    TimestampField,
)

database = SqliteDatabase("data/entries.db")


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


def create_all_tables():
    # Creates all the tables
    database.create_tables([Events, Lessons, Trackings])
