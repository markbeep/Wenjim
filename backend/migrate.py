"""Migrate old database format to new"""

from scraper.models import Events, Lessons, Trackings

from peewee import (
    Model,
    SqliteDatabase,
    AutoField,
    TextField,
    TimeField,
    TimestampField,
    ForeignKeyField,
    IntegerField,
    BareField,
)

old = SqliteDatabase("data/old.db")
new = SqliteDatabase("data/entries.db")


class UnknownField(object):
    def __init__(self, *_, **__):
        pass


class BaseModel(Model):
    class Meta:
        database = old


class Entries(BaseModel):
    entry_id = AutoField(null=True)
    sport = TextField()
    title = TextField()
    location = TextField()
    from_date = TimeField(formats="%H:%M")
    to_date = TimeField(formats="%H:%M")

    class Meta:
        table_name = "Entries"
        indexes = ((("sport", "location", "from_date", "to_date"), True),)


class Timestamps(BaseModel):
    entry = ForeignKeyField(
        column_name="entry_id", field="entry_id", model=Entries, backref="timestamps"
    )
    last_space_date = TimestampField(null=True, utc=True)
    track_date = TimestampField(utc=True)
    places_max = IntegerField()
    places_taken = IntegerField()
    start_date = TimestampField(utc=True)

    class Meta:
        table_name = "Timestamps"


class SqliteSequence(BaseModel):
    name = BareField(null=True)
    seq = BareField(null=True)

    class Meta:
        table_name = "sqlite_sequence"
        primary_key = False


if __name__ == "__main__":
    query = Entries.select().join(Timestamps)

    for e in query:
        # create new activity
        event, _ = Events.get_or_create(
            sport=e.sport,
            title=e.title,
            location=e["location"],
            defaults={"niveau": "n/a"},
        )

        # Case 1: Same event ID, but from/toDate/places_max might've been modified
        lesson = Lessons.get_or_none(nid=e["nid"])

        # Case 2: event ID not stored yet. Either ID was changed or new lesson, but event & time overlap (so same event)
        if not lesson:
            lesson, _ = Lessons.get_or_create(
                event=event,
                from_date=int(e["from_date"].timestamp()),
                to_date=int(e["to_date"].timestamp()),
                defaults={
                    "nid": e["nid"],
                    "places_max": 0,
                    "cancelled": False,
                    "livestream": False,
                    "from_date": 0,
                    "to_date": 0,
                },
            )
        else:
            lesson.from_date = int(e["from_date"].timestamp())
            lesson.to_date = int(e["to_date"].timestamp())

        # always update lessons to make sure values are up to date (they might change)
        lesson.places_max = e["places_max"]
        lesson.cancelled = e["cancelled"]
        lesson.livestream = e["livestream"]
        update_lessons.append(lesson)

        # check free/taken spots
        Trackings.create(
            lesson=lesson,
            track_date=current_time,
            places_free=e["places_free"],
            places_taken=e["places_taken"],
        )

    # bulk update all
    Lessons.bulk_update(
        update_lessons,
        fields=[
            Lessons.from_date,
            Lessons.to_date,
            Lessons.places_max,
            Lessons.cancelled,
            Lessons.livestream,
        ],
    )
