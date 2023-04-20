from peewee import fn
from scraper.models import Events, Lessons, Trackings
from generated import countday_pb2_grpc, countday_pb2
import logging
from pytz import timezone

tz = timezone("Europe/Zurich")

# Gets the latest tracking time for a lesson
LATEST_TRACKING = Trackings.select(
    Trackings.lesson, fn.MAX(Trackings.track_date).alias("max_date")
).group_by(Trackings.lesson)


class WeeklyServicer(countday_pb2_grpc.WeeklyServicer):
    def Weekly(self, request, context):
        logging.info("Request for Weekly")

        query = (
            Events.select(
                Trackings.track_date,
                fn.AVG(Trackings.places_free).alias("avg_free"),
                fn.AVG(Lessons.places_max).alias("avg_max"),
                Lessons.from_date,
                Lessons.to_date,
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
            .group_by(
                fn.STRFTIME("%w", Trackings.track_date, "unixepoch"),
                fn.STRFTIME("%H:%M", Lessons.from_date, "unixepoch"),
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
            wd = weekdays[x.lessons.trackings.track_date.weekday()]
            data[wd][h].append(
                countday_pb2.WeeklyDetails(
                    timeFrom=x.lessons.from_date.astimezone(tz).strftime("%H:%M"),
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
