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

from decimal import ROUND_HALF_EVEN

import peewee as pw
from peewee_migrate import Migrator

try:
    import playhouse.postgres_ext as pw_pext
except ImportError:
    pass

SQL = pw.SQL


def migrate(migrator: Migrator, database: pw.Database, *, fake=False):
    """Write your migrations here."""
    query = """
        CREATE MATERIALIZED VIEW latest_tracking_view
        AS
            SELECT
                id                      AS "id",
                lesson_id               AS "lesson_id",
                track_date              AS "track_date",
                places_free             AS "places_free"
            FROM
                trackings
            WHERE (lesson_id, id) in (
                SELECT
                    lesson_id,
                    MAX(id) AS "id"
                FROM
                    trackings
                GROUP BY
                    lesson_id
            )
         WITH DATA;
    """
    migrator.sql(query)

    migrator.sql(
        "CREATE UNIQUE INDEX tracking_id ON latest_tracking_view(id);")

    @migrator.create_model
    class LatestTrackingView(pw.Model):
        lesson = pw.ForeignKeyField(column_name='lesson_id', field='id', model=migrator.orm["lessons"], backref="latest_tracking")
        track_date = pw.TimestampField()
        places_free = pw.IntegerField()

        class Meta:
            table_name = "latest_tracking_view"


def rollback(migrator: Migrator, database: pw.Database, *, fake=False):
    """Write your rollback migrations here."""
    query = "DROP MATERIALIZED VIEW latest_tracking_view;"
    migrator.sql(query)

    migrator.remove_model('latest_tracking_view')
