from peewee import *
from peewee import Expression
import os

# database = PostgresqlDatabase(os.getenv("POSTGRES_DB"), user=os.getenv("POSTGRES_USER"),  host=os.getenv("POSTGRES_HOST"), password=os.getenv("POSTGRES_PASSWORD"))
database = SqliteDatabase("data/entries.db")

class BaseModel(Model):
    class Meta:
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
        indexes = (
            ("sport", "title", "location", "niveau", True)
        )

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
    from_date = TimestampField(utc=True)
    to_date = TimestampField(utc=True)

class Trackings(BaseModel):
    """
    The amount of places free and taken at a given track time.
    places_free / places_taken are not necessarily consistent with
    places_max.
    """
    lesson = ForeignKeyField(Lessons, backref="trackings")
    track_date = TimestampField(utc=True)
    places_free = IntegerField()
    places_taken = IntegerField()

def create_all_tables():
    database.create_tables([Events, Lessons, Trackings])
