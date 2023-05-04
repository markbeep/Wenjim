import logging
import time

from peewee import Tuple, fn
from pytz import timezone

from generated import countday_pb2, countday_pb2_grpc
from scraper.models import Events, Lessons, Trackings, database
from util import LATEST_TRACKING

tz = timezone("Europe/Zurich")


class HistoryServicer(countday_pb2_grpc.HistoryServicer):
    def HistoryId(self, request, context):
        database.connect(True)
        logging.info("Request for HistoryId")
        query = (
            Events.select(
                Lessons.from_date,
                Lessons.places_max,
                Trackings.places_free,
            )
            .join(Lessons)
            .join(Trackings)
            .where(
                Tuple(Lessons.id, Trackings.id).in_(LATEST_TRACKING),
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .limit(request.size)
            .offset((request.page + 1) * request.size)
        )
        database.close()
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
        database.connect(True)
        logging.info("Request for TotalLessons")
        tracked_lessons = (
            Lessons
            .select(fn.COUNT("1").alias("tracked_lessons"))
            .where(
                Lessons.event_id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
        )
        database.close()
        return countday_pb2.TotalLessonsReply(
            totalLessons=tracked_lessons[0].tracked_lessons
        )

    def TotalTrackings(self, request, context):
        database.connect(True)
        logging.info("Request for TotalTrackings")
        trackings = (
            Events.select(fn.COUNT("*").alias("trackings"))
            .join(Lessons)
            .join(Trackings)
            .where(
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
        )
        database.close()
        return countday_pb2.TotalTrackingsReply(totalTrackings=trackings[0].trackings)

    def EventStatistics(self, request, context):
        database.connect(True)
        logging.info("Request for EventStatistics")
        start = time.time()

        # gets the maximum time away from the start of the event to find the
        # earliest time all places were taken up
        max_time_full = (
            Events.select(
                fn.MAX(Lessons.from_date - Trackings.track_date).alias("max")
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
            .where(
                Tuple(Lessons.id, Trackings.id).in_(LATEST_TRACKING),
                Events.id == request.eventId,
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

        logging.info("EventStatistics Query", str(averages))
        try:
            reply = countday_pb2.HistoryStatisticsReply(
                averageMinutes=actual_avg_minutes / 60,  # convert seconds to minutes
                averagePlacesFree=averages[0].avgPlacesFree,
                averagePlacesMax=averages[0].avgPlacesMax,
                maxPlacesFree=averages[0].maxPlacesFree,
                maxPlacesMax=averages[0].maxPlacesMax,
                dateMaxPlacesFree=int(
                    date_places_free[0].lessons.from_date.timestamp()
                ),
                dateMaxPlacesMax=int(
                    date_places_max[0].lessons.from_date.timestamp()),
            )
        except Exception as e:
            logging.error(e)
            reply = countday_pb2.HistoryStatisticsReply(
                averageMinutes=0,
                averagePlacesFree=0,
                averagePlacesMax=0,
                maxPlacesFree=0,
                maxPlacesMax=0,
                dateMaxPlacesFree=0,
                dateMaxPlacesMax=0,
            )
        logging.info(f"EventStatistics took {time.time()-start} seconds")
        database.close()
        return reply
