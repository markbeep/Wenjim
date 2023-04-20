"""General backend server handling using REST API to communicate"""

from concurrent import futures
import logging
import grpc
from generated import countday_pb2_grpc
from history import HistoryServicer
from utility import UtilityServicer
from weekly import WeeklyServicer

def serve():
    port = 9090
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    countday_pb2_grpc.add_UtilityServicer_to_server(UtilityServicer(), server)
    countday_pb2_grpc.add_HistoryServicer_to_server(HistoryServicer(), server)
    countday_pb2_grpc.add_WeeklyServicer_to_server(WeeklyServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    logging.log(logging.INFO, "Listening on %d", port)
    server.wait_for_termination()


def main():
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("peewee")
    logger.addHandler(logging.StreamHandler())
    logger.setLevel(level=logging.DEBUG)
    serve()

if __name__ == "__main__":
    main()
