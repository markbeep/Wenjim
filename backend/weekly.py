import logging

from peewee import Tuple, fn
from pytz import timezone

from generated import countday_pb2, countday_pb2_grpc
from scraper.models import Events, Lessons, Trackings
from util import LATEST_TRACKING

tz = timezone("Europe/Zurich")


class WeeklyServicer(countday_pb2_grpc.WeeklyServicer):
    def Weekly(self, request, context):
        logging.info("Request for Weekly")

        # Gets the average free spaces per hour
        query = (
            Events.select(
                Lessons,
                fn.AVG(Trackings.places_free).alias("avg_free"),
                fn.AVG(Lessons.places_max).alias("avg_max"),
            )
            .join(Lessons)
            .join(Trackings)
            .where(
                Tuple(Lessons.id, Trackings.id).in_(LATEST_TRACKING),
                Events.id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .group_by(
                Lessons.id,
                fn.to_char(Lessons.from_date, "Day"),
                fn.to_char(Lessons.from_date, "HH24:MI")
            )
        )

        data = {}
        details = {}  # more details when its clicked on
        weekdays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ]
        for wd in weekdays:
            data[wd] = {}
            details[wd] = []
            for rt in range(24):
                data[wd][rt] = []

        for x in query:
            h = x.lessons.from_date.astimezone(tz).hour
            wd = weekdays[x.lessons.from_date.weekday()]
            data[wd][h].append(
                countday_pb2.WeeklyDetails(
                    timeFrom=x.lessons.from_date.astimezone(
                        tz).strftime("%H:%M"),
                    timeTo=x.lessons.to_date.astimezone(tz).strftime("%H:%M"),
                    avgFree=x.avg_free,
                    avgMax=x.avg_max,
                )
            )

        # an hour can have multiple details
        # if there's nothing in an hour, simply give out an list
        weekdays = {}
        for day, _ in data.items():
            weekdays[day] = [
                countday_pb2.WeeklyHour(hour=h, details=data[day][h]) for h in range(24)
            ]

        return countday_pb2.WeeklyReply(
            monday=weekdays["monday"],
            tuesday=weekdays["tuesday"],
            wednesday=weekdays["wednesday"],
            thursday=weekdays["thursday"],
            friday=weekdays["friday"],
            saturday=weekdays["saturday"],
            sunday=weekdays["sunday"],
        )
