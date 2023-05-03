from peewee import (
    Model,
    SqliteDatabase,
    PostgresqlDatabase,
    TextField,
    ForeignKeyField,
    IntegerField,
    BooleanField,
    TimestampField,
    BitField,
)


sqlite = SqliteDatabase("data/entries.db")
psql = PostgresqlDatabase(
    "wenjim", user="postgres", password="postgres", host="0.0.0.0", port=5432
)


class SqliteModel(Model):
    class Meta:
        database = sqlite


class S_Events(SqliteModel):
    sport = TextField()
    title = TextField()
    location = TextField()
    niveau = TextField()

    class Meta:
        indexes = ((("sport", "title", "location", "niveau"), True),)
        table_name = "events"


class S_Lessons(SqliteModel):
    event = ForeignKeyField(S_Events, backref="lessons")
    nid = IntegerField(unique=True)
    places_max = IntegerField()
    cancelled = BooleanField()
    livestream = BooleanField()
    from_date = TimestampField()
    to_date = TimestampField()

    class Meta:
        table_name = "lessons"


class S_Trackings(SqliteModel):
    lesson = ForeignKeyField(S_Lessons, backref="trackings")
    track_date = TimestampField()
    places_free = IntegerField()

    class Meta:
        table_name = "trackings"


class S_Statistics(SqliteModel):
    event = ForeignKeyField(S_Events, backref="statistics", null=True)
    flags = BitField()
    is_history = flags.flag(1)
    is_places = flags.flag(2)
    is_weekly = flags.flag(4)
    track_date = TimestampField()

    class Meta:
        table_name = "statistics"


class PsqlModel(Model):
    class Meta:
        database = psql


class P_Events(PsqlModel):
    sport = TextField()
    title = TextField()
    location = TextField()
    niveau = TextField()

    class Meta:
        indexes = ((("sport", "title", "location", "niveau"), True),)
        table_name = "events"


class P_Lessons(PsqlModel):
    event = ForeignKeyField(P_Events, backref="lessons")
    nid = IntegerField(unique=True)
    places_max = IntegerField()
    cancelled = BooleanField()
    livestream = BooleanField()
    from_date = TimestampField()
    to_date = TimestampField()

    class Meta:
        table_name = "lessons"


class P_Trackings(PsqlModel):
    lesson = ForeignKeyField(P_Lessons, backref="trackings")
    track_date = TimestampField()
    places_free = IntegerField()

    class Meta:
        table_name = "trackings"


class P_Statistics(PsqlModel):
    event = ForeignKeyField(P_Events, backref="statistics", null=True)
    flags = BitField()
    is_history = flags.flag(1)
    is_places = flags.flag(2)
    is_weekly = flags.flag(4)
    track_date = TimestampField()

    class Meta:
        table_name = "statistics"


models = []
for m in S_Events.select(
    S_Events.id, S_Events.sport, S_Events.title, S_Events.location, S_Events.niveau
):
    models.append((m.id, m.sport, m.title, m.location, m.niveau))
P_Events.insert_many(
    models,
    fields=[
        P_Events.id,
        P_Events.sport,
        P_Events.title,
        P_Events.location,
        P_Events.niveau,
    ],
).execute()
print("Inserted all events")

models = []
for m in S_Lessons.select():
    models.append(
        (
            m.id,
            m.event.id,
            m.nid,
            m.places_max,
            m.cancelled,
            m.livestream,
            m.from_date,
            m.to_date,
        )
    )
P_Lessons.insert_many(
    models,
    fields=[
        P_Lessons.id,
        P_Lessons.event,
        P_Lessons.nid,
        P_Lessons.places_max,
        P_Lessons.cancelled,
        P_Lessons.livestream,
        P_Lessons.from_date,
        P_Lessons.to_date,
    ],
).execute()
print("Inserted all lessons")

models = []
for m in S_Trackings.select():
    models.append((m.id, m.lesson.id, m.track_date, m.places_free))
P_Trackings.insert_many(
    models,
    fields=[
        P_Trackings.id,
        P_Trackings.lesson,
        P_Trackings.track_date,
        P_Trackings.places_free,
    ],
).execute()
print("Inserted all trackings")
