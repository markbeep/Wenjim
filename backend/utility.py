from peewee import fn
from dateutil.parser import parse
from scraper.models import Events, Lessons, Trackings
from generated import countday_pb2_grpc, countday_pb2


class UtilityServicer(countday_pb2_grpc.UtilityServicer):
    """requests that are used all around"""

    def TotalDay(self, request, context):
        raise NotImplementedError("Method not implemented!")

    def Sports(self, request, context):
        raise NotImplementedError("Method not implemented!")

    def Locations(self, request, context):
        raise NotImplementedError("Method not implemented!")

    def Title(self, request, context):
        raise NotImplementedError("Method not implemented!")

    def Events(self, request, context):
        query = Events.select().order_by(Events.sport.asc())
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

    def MinMaxDate(self, request, context):
        query = Lessons.get(
            fn.MIN(Lessons.from_date).alias("min"),
            fn.MAX(Lessons.to_date).alias("max"),
        )
        return countday_pb2.MinMaxDateReply(min=query.min, max=query.max)
