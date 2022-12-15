from peewee import *
from peewee import Expression

database = SqliteDatabase('data/entries.db')

class UnknownField(object):
    def __init__(self, *_, **__): pass

class BaseModel(Model):
    class Meta:
        database = database

class Entries(BaseModel):
    entry_id = AutoField(null=True)
    sport = TextField()
    title = TextField()
    location = TextField()
    from_date = TimeField(formats="%H:%M")
    to_date = TimeField(formats="%H:%M")

    class Meta:
        table_name = 'Entries'
        indexes = (
            (('sport', 'location', 'from_date', 'to_date'), True),
        )

class Timestamps(BaseModel):
    entry = ForeignKeyField(column_name='entry_id', field='entry_id', model=Entries, backref="timestamps")
    last_space_date = TimestampField(null=True, utc=True)
    track_date = TimestampField(utc=True)
    places_max = IntegerField()
    places_taken = IntegerField()
    start_date = TimestampField(utc=True)

    class Meta:
        table_name = 'Timestamps'


class SqliteSequence(BaseModel):
    name = BareField(null=True)
    seq = BareField(null=True)

    class Meta:
        table_name = 'sqlite_sequence'
        primary_key = False


def create_all_tables():
    database.create_tables([Entries, Timestamps])
