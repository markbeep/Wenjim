"""
File for storing all kinds of extra helper and util functions or subqueries
"""


from scraper.models import Trackings
from peewee import fn

# Gets the latest tracking id per lesson
LATEST_TRACKING = (
    Trackings.select(
        Trackings.lesson_id,
        fn.MAX(Trackings.id).alias("max_id"),
    )
    .group_by(Trackings.lesson_id)
)
