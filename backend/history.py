from peewee import fn
from scraper.models import Events, Lessons, Trackings
from generated import countday_pb2_grpc, countday_pb2
import logging
import time
from pytz import timezone

tz = timezone("Europe/Zurich")

# Gets the latest tracking time for a lesson
LATEST_TRACKING = Trackings.select(
    Trackings.lesson, fn.MAX(Trackings.track_date).alias("max_date")
).group_by(Trackings.lesson)


class HistoryServicer(countday_pb2_grpc.HistoryServicer):
    def HistoryId(self, request, context):
        logging.info("Request for HistoryId")
        query = (
            Events.select(
                Lessons.from_date,
                Lessons.places_max,
                Trackings.places_free,
            )
            .join(Lessons)
            .join(Trackings)
            .join(
                LATEST_TRACKING, on=(
                    LATEST_TRACKING.c.lesson_id == Trackings.lesson.id)
            )
            .where(
                Trackings.track_date == LATEST_TRACKING.c.max_date,
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .limit(request.size)
            .offset((request.page + 1) * request.size)
        )
        return countday_pb2.HistoryReply(
            rows=[
                countday_pb2.HistoryRow(
                    date=round(x.lessons.from_date.astimezone(tz).timestamp()),
                    placesMax=x.lessons.places_max,
                    placesFree=x.lessons.trackings.places_free,
                )
                for x in query
            ]
        )

    def TotalLessons(self, request, context):
        logging.info("Request for TotalLessons")
        tracked_lessons = (
            Events.select(fn.COUNT(fn.DISTINCT(Lessons.id)).alias("trackedLessons"))
            .join(Lessons)
            .join(Trackings) # to only show lessons that already have trackings
            .where(
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
        )
        return countday_pb2.TotalLessonsReply(
            totalLessons=tracked_lessons[0].trackedLessons
        )

    def TotalTrackings(self, request, context):
        logging.info("Request for TotalTrackings")
        trackings = (
            Events.select(fn.COUNT().alias("trackings"))
            .join(Lessons)
            .join(Trackings)
            .where(
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
        )
        return countday_pb2.TotalTrackingsReply(totalTrackings=trackings[0].trackings)

    def EventStatistics(self, request, context):
        logging.info("Request for EventStatistics")
        start = time.time()

        # gets the maximum time away from the start of the event to find the
        # earliest time all places were taken up
        max_time_full = (
            Events.select(
                Events.id, fn.MAX(Lessons.from_date -
                                  Trackings.track_date).alias("max")
            )
            .join(Lessons)
            .join(Trackings)
            .where(
                Trackings.places_free == 0,
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .group_by(Lessons)
        )

        avg_minutes = max_time_full.select_from(
            fn.AVG(max_time_full.c.max).alias("avg")
        )
        actual_avg_minutes = avg_minutes[0].avg
        if actual_avg_minutes is None:
            actual_avg_minutes = 0

        averages = (
            Events.select(
                Events.id.alias("id"),
                fn.AVG(Trackings.places_free).alias("avgPlacesFree"),
                fn.AVG(Lessons.places_max).alias("avgPlacesMax"),
                fn.MAX(Trackings.places_free).alias("maxPlacesFree"),
                fn.MAX(Lessons.places_max).alias("maxPlacesMax"),
            )
            .join(Lessons)
            .join(Trackings)
            .join(
                LATEST_TRACKING, on=(
                    LATEST_TRACKING.c.lesson_id == Trackings.lesson.id)
            )
            .where(
                Events.id == request.eventId,
                Trackings.track_date == LATEST_TRACKING.c.max_date,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .group_by(Events)
        )

        # the last date where the event had the max amount of places
        date_places_max = (
            Events.select(Lessons.from_date)
            .join(Lessons)
            .join(averages, on=(Events.id == averages.c.id))
            .where(
                Lessons.places_max == averages.c.maxPlacesMax,
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .order_by(Lessons.from_date.desc())
        )

        date_places_free = (
            Events.select(Lessons.from_date)
            .join(Lessons)
            .join(Trackings)
            .join(averages, on=(Events.id == averages.c.id))
            .where(
                Trackings.places_free == averages.c.maxPlacesFree,
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .order_by(Lessons.from_date.desc())
        )

        logging.info(f"EventStatistics took {time.time()-start} seconds")
        try:
            return countday_pb2.HistoryStatisticsReply(
                averageMinutes=actual_avg_minutes / 60,  # convert seconds to minutes
                averagePlacesFree=averages[0].avgPlacesFree,
                averagePlacesMax=averages[0].avgPlacesMax,
                maxPlacesFree=averages[0].maxPlacesFree,
                maxPlacesMax=averages[0].maxPlacesMax,
                dateMaxPlacesFree=int(
                    date_places_free[0].lessons.from_date.timestamp()),
                dateMaxPlacesMax=int(
                    date_places_max[0].lessons.from_date.timestamp()),
            )
        except IndexError:
            return countday_pb2.HistoryStatisticsReply(
                averageMinutes=0,
                averagePlacesFree=0,
                averagePlacesMax=0,
                maxPlacesFree=0,
                maxPlacesMax=0,
                dateMaxPlacesFree=0,
                dateMaxPlacesMax=0,
            )
