import logging

from peewee import Tuple, fn
from pytz import timezone

from generated import countday_pb2, countday_pb2_grpc
from scraper.models import Lessons, Trackings, LatestTrackingView, database

TIMEZONE = "Europe/Zurich"
tz = timezone(TIMEZONE)


class WeeklyServicer(countday_pb2_grpc.WeeklyServicer):
    def Weekly(self, request, context):
        database.connect(True)
        logging.info("Request for Weekly")

        database.set_time_zone(TIMEZONE)

        # Gets the average free spaces per hour
        query = (
            Lessons.select(
                fn.AVG(LatestTrackingView.places_free).alias("avg_free"),
                fn.AVG(Lessons.places_max).alias("avg_max"),
                fn.MIN(Lessons.from_date).alias("start_date"),
                fn.MIN(Lessons.to_date).alias("end_date"),
                fn.to_char(fn.to_timestamp(Lessons.from_date), "HH24:MI").alias(
                    "start"
                ),
                fn.to_char(fn.to_timestamp(Lessons.to_date), "HH24:MI").alias("end"),
            )
            .join(LatestTrackingView)
            .where(
                Lessons.event_id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
            )
            .group_by(
                fn.to_char(fn.to_timestamp(Lessons.from_date), "Day"),
                fn.to_char(fn.to_timestamp(Lessons.from_date), "HH24:MI"),
                fn.to_char(fn.to_timestamp(Lessons.to_date), "HH24:MI"),
            )
            .order_by(
                fn.to_char(fn.to_timestamp(Lessons.from_date), "HH24:MI"),
            )
        )
        data = {}
        day_names = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ]
        for wd in day_names:
            data[wd] = {}
            for rt in range(24):
                data[wd][rt] = []

        for x in query:
            h = x.start_date.astimezone(tz).hour
            wd = day_names[x.start_date.weekday()]
            data[wd][h].append(
                countday_pb2.WeeklyDetails(
                    timeFrom=x.start,
                    timeTo=x.end,
                    avgFree=x.avg_free,
                    avgMax=x.avg_max,
                    weekday=wd,
                )
            )
        database.close()

        # an hour can have multiple details
        # if there's nothing in an hour, simply give out an empty list
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

    def FreeGraph(self, request, context):
        database.connect(True)
        logging.info(
            "Request for FreeGraph: %s, %s, %s, %s",
            request.eventId,
            request.timeFrom,
            request.timeTo,
            request.weekday,
        )

        database.set_time_zone(TIMEZONE)

        query = (
            Lessons.select(
                ((Trackings.track_date - Lessons.from_date) / 3600).alias(
                    "hours_before"
                ),
                fn.AVG(Trackings.places_free).alias("avg_free"),
            )
            .join(Trackings)
            .where(
                Lessons.event_id == request.eventId,
                Lessons.from_date >= request.dateFrom,
                Lessons.from_date <= request.dateTo,
                fn.to_char(fn.to_timestamp(Lessons.from_date), "HH24:MI")
                == request.timeFrom,
                fn.to_char(fn.to_timestamp(Lessons.to_date), "HH24:MI")
                == request.timeTo,
                fn.btrim(
                    fn.lower(fn.to_char(fn.to_timestamp(Lessons.from_date), "Day"))
                )
                == request.weekday,
            )
            .group_by((Trackings.track_date - Lessons.from_date) / 3600)
        )

        resp = [countday_pb2.Point(x=x.hours_before, y=x.avg_free) for x in query]
        database.close()

        return countday_pb2.FreeGraphReply(data=resp)
