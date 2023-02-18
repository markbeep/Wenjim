from peewee import fn
from dateutil.parser import parse
from scraper.models import Events, Lessons, Trackings
from generated import countday_pb2_grpc, countday_pb2

# Gets the latest tracking time for a lesson
LATEST_TRACKING = Trackings.select(
    Trackings.lesson, fn.MAX(Trackings.track_date).alias("max_date")
).group_by(Trackings.lesson)

class HistoryServicer(countday_pb2_grpc.HistoryServicer):
    def HistoryGraph(self, request, context):
        raise NotImplementedError("Method not implemented!")

    def History(self, request: countday_pb2.HistoryGraphRequest, context):
        order_by = request.orderBy
        if order_by == countday_pb2.HISTORYSORT_DATE:
            order = Trackings.track_date
        elif order_by == countday_pb2.HISTORYSORT_SPORT:
            order = Events.sport
        elif order_by == countday_pb2.HISTORYSORT_LOCATION:
            order = Events.location
        elif order_by == countday_pb2.HISTORYSORT_PLACESMAX:
            order = Lessons.places_max
        elif order_by == countday_pb2.HISTORYSORT_PLACESFREE:
            order = Trackings.places_free

        query = (
            Events.select(
                fn.STRFTIME("%a %Y-%m-%d", Lessons.from_date, "unixepoch").alias(
                    "date"
                ),
                Events.sport,
                Events.location,
                Lessons.places_max,
                Trackings.places_free,
                Trackings.places_taken,
            )
            .join(Lessons)
            .join(Trackings)
            .join(
                LATEST_TRACKING, on=(LATEST_TRACKING.c.lesson_id == Trackings.lesson.id)
            )
            .where(
                Trackings.track_date == LATEST_TRACKING.c.max_date,
                Events.sport % request.event.sport,
                Events.title % request.event.title,
                Events.location % request.event.location,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .order_by(order)
        )
        return countday_pb2.HistoryReply(
            rows=[
                countday_pb2.HistoryRow(
                    date=x.date,
                    sport=x.sport,
                    location=x.location,
                    placesMax=x.lessons.places_max,
                    placesFree=x.lessons.trackings.places_free,
                )
                for x in query
            ]
        )
