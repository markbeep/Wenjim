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
        CREATE MATERIALIZED VIEW average_statistics_view
        AS
            SELECT
                "t1"."event_id"         AS "id",
                Avg("t2"."places_free") AS "avg_places_free",
                Max("t2"."places_free") AS "max_places_free",
                Avg("t1"."places_max")  AS "avg_places_max",
                Max("t1"."places_max")  AS "max_places_max"
            FROM
                "lessons" AS "t1"
            INNER JOIN "trackings" AS "t2"
                        ON ( "t2"."lesson_id" = "t1"."id" )
            WHERE  (
                ( "t1"."id", "t2"."id" ) IN
                    (SELECT
                        "t2"."lesson_id",
                        Max("t2"."id") AS "max_id"
                    FROM   "trackings" AS "t2"
                    GROUP  BY "t2"."lesson_id")
            )
            GROUP  BY "t1"."event_id"
         WITH DATA;
    """
    migrator.sql(query)

    migrator.sql(
        "CREATE UNIQUE INDEX event_id ON average_statistics_view(id);")

    @migrator.create_model
    class AverageStatisticsView(pw.Model):
        id = pw.AutoField()
        avg_places_free = pw.IntegerField()
        max_places_free = pw.IntegerField()
        avg_places_max = pw.IntegerField()
        max_places_max = pw.IntegerField()

        class Meta:
            table_name = "average_statistics_view"


def rollback(migrator: Migrator, database: pw.Database, *, fake=False):
    """Write your rollback migrations here."""
    query = "DROP MATERIALIZED VIEW average_statistics_view;"
    migrator.sql(query)

    migrator.remove_model('average_statistics_view')
