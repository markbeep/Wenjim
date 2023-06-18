import logging

from peewee import Tuple, fn
from pytz import timezone

from generated import countday_pb2, countday_pb2_grpc
from scraper.models import Lessons, Trackings, database
from util import LATEST_TRACKING

tz = timezone("Europe/Zurich")


class WeeklyServicer(countday_pb2_grpc.WeeklyServicer):
    def Weekly(self, request, context):
        database.connect(True)
        logging.info("Request for Weekly")

        # Gets the average free spaces per hour
        query = (
            Lessons.select(
                fn.AVG(Trackings.places_free).alias("avg_free"),
                fn.AVG(Lessons.places_max).alias("avg_max"),
                fn.MIN(Lessons.from_date).alias("start_date"),
                fn.MIN(Lessons.to_date).alias("end_date"),
                fn.to_char(fn.to_timestamp(Lessons.from_date), "HH24:MI").alias("start"),
                fn.to_char(fn.to_timestamp(Lessons.to_date), "HH24:MI").alias("end"),
            )
            .join(Trackings)
            .where(
                Tuple(Lessons.id, Trackings.id).in_(LATEST_TRACKING),
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
            for rt in range(24):
                data[wd][rt] = {}

        for x in query:
            h = x.start_date.astimezone(tz).hour
            wd = weekdays[x.start_date.weekday()]
            start = x.start_date.astimezone(tz).strftime("%H:%M")
            end = x.end_date.astimezone(tz).strftime("%H:%M")
            timeslot = f"{start}-{end}"
            prev = data[wd][h].get(timeslot)
            # make sure that only one value exists for every time slot
            if prev is None:
                data[wd][h][timeslot] = countday_pb2.WeeklyDetails(
                    timeFrom=start,
                    timeTo=end,
                    avgFree=x.avg_free,
                    avgMax=x.avg_max,
                )
                continue
            # average up the scores. a bit inaccurate but passable
            data[wd][h][timeslot] = countday_pb2.WeeklyDetails(
                timeFrom=start,
                timeTo=end,
                avgFree=(prev.avgFree + float(x.avg_free)) / 2,
                avgMax=(prev.avgMax + float(x.avg_max)) / 2,
            )
        
        # an hour can have multiple details
        # if there's nothing in an hour, simply give out an empty list
        weekdays = {}
        for day, _ in data.items():
            weekdays[day] = [
                countday_pb2.WeeklyHour(hour=h, details=data[day][h].values()) for h in range(24)
            ]

        database.close()
        return countday_pb2.WeeklyReply(
            monday=weekdays["monday"],
            tuesday=weekdays["tuesday"],
            wednesday=weekdays["wednesday"],
            thursday=weekdays["thursday"],
            friday=weekdays["friday"],
            saturday=weekdays["saturday"],
            sunday=weekdays["sunday"],
        )
