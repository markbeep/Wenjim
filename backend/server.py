"""General backend server handling using GRPC-Web to communicate"""

import logging

from flask import Flask
from sonora.wsgi import grpcWSGI

from generated import countday_pb2_grpc
from history import HistoryServicer
from utility import UtilityServicer
from weekly import WeeklyServicer

app = Flask(__name__)
app = grpcWSGI(app)
countday_pb2_grpc.add_UtilityServicer_to_server(UtilityServicer(), app)
countday_pb2_grpc.add_HistoryServicer_to_server(HistoryServicer(), app)
countday_pb2_grpc.add_WeeklyServicer_to_server(WeeklyServicer(), app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("peewee")
logger.addHandler(logging.StreamHandler())
logger.setLevel(level=logging.DEBUG)
