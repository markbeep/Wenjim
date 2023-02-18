from peewee import fn
from scraper.models import Events, Lessons, Trackings
from generated import countday_pb2_grpc, countday_pb2
import logging

# Gets the latest tracking time for a lesson
LATEST_TRACKING = Trackings.select(
    Trackings.lesson, fn.MAX(Trackings.track_date).alias("max_date")
).group_by(Trackings.lesson)


class HistoryServicer(countday_pb2_grpc.HistoryServicer):
    def History(self, request, context):
        query = (
            Events.select(
                Lessons.from_date,
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
        )
        return countday_pb2.HistoryReply(
            rows=[
                countday_pb2.HistoryRow(
                    date=round(x.lessons.from_date.timestamp()),
                    placesMax=x.lessons.places_max,
                    placesFree=x.lessons.trackings.places_free,
                )
                for x in query
            ]
        )

    def HistoryId(self, request, context):
        query = (
            Events.select(
                Lessons.from_date,
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
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
        )
        return countday_pb2.HistoryReply(
            rows=[
                countday_pb2.HistoryRow(
                    date=round(x.lessons.from_date.timestamp()),
                    placesMax=x.lessons.places_max,
                    placesFree=x.lessons.trackings.places_free,
                )
                for x in query
            ]
        )
