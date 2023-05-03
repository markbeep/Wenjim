"""Peewee migrations -- 001_initial.py.

Some examples (model - class or model name)::

    > Model = migrator.orm['table_name']            # Return model in current state by name
    > Model = migrator.ModelClass                   # Return model in current state by name

    > migrator.sql(sql)                             # Run custom SQL
    > migrator.python(func, *args, **kwargs)        # Run python code
    > migrator.create_model(Model)                  # Create a model (could be used as decorator)
    > migrator.remove_model(model, cascade=True)    # Remove a model
    > migrator.add_fields(model, **fields)          # Add fields to a model
    > migrator.change_fields(model, **fields)       # Change fields
    > migrator.remove_fields(model, *field_names, cascade=True)
    > migrator.rename_field(model, old_field_name, new_field_name)
    > migrator.rename_table(model, new_table_name)
    > migrator.add_index(model, *col_names, unique=False)
    > migrator.drop_index(model, *col_names)
    > migrator.add_not_null(model, *field_names)
    > migrator.drop_not_null(model, *field_names)
    > migrator.add_default(model, field_name, default)

"""

import peewee as pw
from peewee_migrate import Migrator
from decimal import ROUND_HALF_EVEN

try:
    import playhouse.postgres_ext as pw_pext
except ImportError:
    pass

SQL = pw.SQL


def migrate(migrator: Migrator, database: pw.Database, *, fake=False):
    """Write your migrations here."""
    
    @migrator.create_model
    class BaseModel(pw.Model):
        id = pw.AutoField()

        class Meta:
            table_name = "basemodel"

    @migrator.create_model
    class Events(pw.Model):
        id = pw.AutoField()
        sport = pw.TextField()
        title = pw.TextField()
        location = pw.TextField()
        niveau = pw.TextField()

        class Meta:
            table_name = "events"
            indexes = [(('sport', 'title', 'location', 'niveau'), True)]

    @migrator.create_model
    class Lessons(pw.Model):
        id = pw.AutoField()
        event = pw.ForeignKeyField(column_name='event_id', field='id', model=migrator.orm['events'])
        nid = pw.IntegerField(unique=True)
        places_max = pw.IntegerField()
        cancelled = pw.BooleanField()
        livestream = pw.BooleanField()
        from_date = pw.TimestampField()
        to_date = pw.TimestampField()

        class Meta:
            table_name = "lessons"

    @migrator.create_model
    class Statistics(pw.Model):
        id = pw.AutoField()
        event = pw.ForeignKeyField(column_name='event_id', field='id', model=migrator.orm['events'], null=True)
        flags = pw.BitField(constraints=[SQL("DEFAULT 0")], default=0)
        track_date = pw.TimestampField()

        class Meta:
            table_name = "statistics"

    @migrator.create_model
    class Trackings(pw.Model):
        id = pw.AutoField()
        lesson = pw.ForeignKeyField(column_name='lesson_id', field='id', model=migrator.orm['lessons'])
        track_date = pw.TimestampField()
        places_free = pw.IntegerField()

        class Meta:
            table_name = "trackings"


def rollback(migrator: Migrator, database: pw.Database, *, fake=False):
    """Write your rollback migrations here."""
    
    migrator.remove_model('trackings')

    migrator.remove_model('statistics')

    migrator.remove_model('lessons')

    migrator.remove_model('events')

    migrator.remove_model('basemodel')
