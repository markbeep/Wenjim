from peewee import fn
from dateutil.parser import parse
from scraper.models import Events, Lessons
from generated import countday_pb2_grpc, countday_pb2
import logging


class UtilityServicer(countday_pb2_grpc.UtilityServicer):
    """requests that are used all around"""

    def Events(self, request, context):
        query = (
            Events.select(
                Events.id, Events.sport, Events.title, Events.location, Events.niveau
            )
            .distinct()
            .join(Lessons)  # to only show events with lessons
            .order_by(Events.sport.asc())
        )
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
        query = Events.get_by_id(request.id)
        return countday_pb2.Event(
            id=query.id,
            sport=query.sport,
            title=query.title,
            location=query.location,
            niveau=query.niveau,
        )

    def Locations(self, request, context):
        event = Events.get_by_id(request.eventId)
        query = (
            Events.select(Events.id, Events.location)
            .distinct()
            .join(Lessons)
            .where(
                Events.sport == event.sport,
                Events.title == event.title,
                Events.niveau == event.niveau,
            )
        )
        return countday_pb2.LocationsReply(
            locations=[
                countday_pb2.LocationEvent(eventId=x.id, location=x.location)
                for x in query
            ]
        )

    def Titles(self, request, context):
        event = Events.get_by_id(request.eventId)
        query = (
            Events.select(Events.id, Events.location)
            .distinct()
            .join(Lessons)
            .where(
                Events.sport == event.sport,
                Events.location == event.location,
                Events.niveau == event.niveau,
            )
        )
        return countday_pb2.TitleReply(
            titles=[
                countday_pb2.TitleEvent(eventId=x.id, title=x.location) for x in query
            ]
        )

    def MinMaxDate(self, request, context):
        query = Lessons.get(
            fn.MIN(Lessons.from_date).alias("min"),
            fn.MAX(Lessons.to_date).alias("max"),
        )
        return countday_pb2.MinMaxDateReply(min=query.min, max=query.max)
