import logging

import grpc
from peewee import DoesNotExist, fn

from generated import countday_pb2, countday_pb2_grpc
from scraper.models import Events, Lessons, database


class UtilityServicer(countday_pb2_grpc.UtilityServicer):
    """requests that are used all around"""

    def Events(self, request, context):
        database.connect(True)
        logging.info("Request for Events")
        query = (
            Events.select(
                Events.id, Events.sport, Events.title, Events.location, Events.niveau
            )
            .distinct()
            .join(Lessons)  # to only show events with lessons
            .order_by(Events.sport.asc())
        )
        database.close()
        return countday_pb2.EventsReply(
            events=[
                countday_pb2.Event(
                    id=x.id,
                    sport=x.sport,
                    title=x.title,
                    location=x.location,
                    niveau=x.niveau,
                )
                for x in query
            ]
        )

    def SingleEvent(self, request, context):
        database.connect(True)
        logging.info("Request for SingleEvent")
        try:
            query = Events.get_by_id(request.id)
        except DoesNotExist:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details("Invalid EventId")
            logging.error("Invalid EventId in 'SingleEvent'")
            return countday_pb2.Event()
        database.close()
        return countday_pb2.Event(
            id=query.id,
            sport=query.sport,
            title=query.title,
            location=query.location,
            niveau=query.niveau,
        )

    def Locations(self, request, context):
        database.connect(True)
        logging.info("Request for Locations")
        try:
            event = Events.get_by_id(request.eventId)
        except DoesNotExist:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details("Invalid EventId")
            logging.error("Invalid EventId in 'Locations'")
            database.close()
            return countday_pb2.LocationsReply()
        query = (
            Events.select(Events.id, Events.location)
            .distinct()
            .join(Lessons)
            .where(
                Events.sport == event.sport,
                Events.title == event.title,
            )
        )
        database.close()
        return countday_pb2.LocationsReply(
            locations=[
                countday_pb2.LocationEvent(eventId=x.id, location=x.location)
                for x in query
            ]
        )

    def Titles(self, request, context):
        database.connect(True)
        logging.info("Request for Titles")
        try:
            event = Events.get_by_id(request.eventId)
        except DoesNotExist:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details("Invalid EventId")
            logging.error("Invalid EventId in 'Titles'")
            database.close()
            return countday_pb2.TitleReply()
        query = (
            Events.select(Events.id, Events.title)
            .distinct()
            .join(Lessons)
            .where(
                Events.sport == event.sport,
                Events.location == event.location,
            )
        )
        database.close()
        return countday_pb2.TitleReply(
            titles=[countday_pb2.TitleEvent(
                eventId=x.id, title=x.title) for x in query]
        )

    def MinMaxDate(self, request, context):
        database.connect(True)
        logging.info("Request for MinMaxDate")
        query = Lessons.select(
            fn.MIN(Lessons.from_date).alias("min"),
            fn.MAX(Lessons.to_date).alias("max"),
        )
        database.close()
        return countday_pb2.MinMaxDateReply(
            min=int(query[0].min.timestamp()), max=int(query[0].max.timestamp())
        )
