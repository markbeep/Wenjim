"""General backend server handling using REST API to communicate"""

from flask import Flask, request, abort, jsonify
from flask_compress import Compress
from peewee import fn
from dateutil.parser import parse
from scraper.models import Events, Lessons, Trackings


app = Flask(__name__)
Compress(app)


# Gets the latest tracking time for a lesson
LATEST_TRACKING = Trackings.select(
    Trackings.lesson, fn.MAX(Trackings.track_date).alias("max_date")
).group_by(Trackings.lesson)


@app.route("/api/countday")
def count_day():
    """Returns the amount of total signups per day"""

    # Only looking at the latest track dates, we sum up the places taken
    query = (
        Lessons.select(
            fn.STRFTIME("%Y-%m-%d", Lessons.from_date, "unixepoch").alias("day"),
            fn.SUM(Trackings.places_taken).alias("sum"),
        )
        .join(Trackings)
        .join(LATEST_TRACKING, on=(LATEST_TRACKING.c.lesson_id == Trackings.lesson.id))
        .where(
            Trackings.track_date == LATEST_TRACKING.c.max_date,
        )
    ).group_by(fn.STRFTIME("%Y-%m-%d", Lessons.from_date, "unixepoch"))

    res = [
        {
            "day": x.day,
            "value": x.sum,
        }
        for x in query
    ]
    return jsonify(res)


@app.route("/api/sports")
def sports():
    """Returns a list of all possible sports"""
    return jsonify([x.sport for x in Events.select(Events.sport).distinct()])


@app.route("/api/locations", methods=["POST"])
def locations():
    """Returns a list of all locations from a list of sports"""
    args = request.get_json()
    if len(args) == 0:
        query = Events.select(Events.location).distinct()
    else:
        query = (
            Events.select(Events.location)
            .where(fn.LOWER(Events.sport) << [x.lower() for x in args])
            .distinct()
        )
    return jsonify([x.location for x in query])


@app.route("/api/history", methods=["POST"])
def history():
    """Returns the all time data of given list of sports"""
    args = request.get_json()
    try:
        activities = args["activities"]

        if len(activities) == 0:
            return abort(400, "Empty activities")

        facilities = args["locations"]

        order_by = args["orderBy"]
        if order_by == "date":
            order = Trackings.track_date
        elif order_by == "sport":
            order = Events.sport
        elif order_by == "location":
            order = Events.location
        elif order_by == "places_max":
            order = Lessons.places_max
        elif order_by == "places_free":
            order = Trackings.places_free
        else:
            return abort(400, "Invalid orderBy")
        if args["desc"]:
            order = order.desc()

    except KeyError:
        return abort(400, "Invalid POST request")

    query = (
        Events.select(
            fn.STRFTIME("%a %Y-%m-%d", Lessons.from_date, "unixepoch").alias("date"),
            Events.sport,
            Events.location,
            Lessons.places_max,
            Trackings.places_free,
            Trackings.places_taken,
        )
        .join(Lessons)
        .join(Trackings)
        .join(LATEST_TRACKING, on=(LATEST_TRACKING.c.lesson_id == Trackings.lesson.id))
        .where(
            Trackings.track_date == LATEST_TRACKING.c.max_date,
            (fn.LOWER(Events.sport) << [x.lower() for x in activities]),
            (fn.LOWER(Events.location) << [x.lower() for x in facilities]),
            (Lessons.from_date >= parse(args["from"])),
            (Lessons.from_date <= parse(args["to"])),
        )
        .order_by(order)
    )

    res = [
        {
            "date": x.date,
            "activity": x.sport,
            "location": x.location,
            "spots_total": x.trackings.places_max,
            "spots_free": x.trackings.places_free,
        }
        for x in query
    ]
    return jsonify(res)


@app.route("/api/historyline", methods=["POST"])
def history_line():
    """
    Returns the all time data of a given list of sports
    in an easy to graph format
    """
    args = request.get_json()

    try:
        activities = args["activities"]
        if len(activities) == 0:
            return abort(400, "Empty activities")
        facilities = args["locations"]
        if len(facilities) == 0:
            return abort(400, "Empty locations")

    except KeyError:
        return abort(400, "Invalid POST request")
    
    query = (
        Events.select(
            fn.STRFTIME("%Y-%m-%d", Lessons.from_date, "unixepoch").alias("date"),
            Events.sport,
            fn.SUM(Trackings.places_free).alias("sum"),
        )
        .join(Lessons)
        .join(Trackings)
        .join(LATEST_TRACKING, on=(LATEST_TRACKING.c.lesson_id == Trackings.lesson.id))
        .where(
            Trackings.track_date == LATEST_TRACKING.c.max_date,
            (fn.LOWER(Events.sport) << [x.lower() for x in activities])
            & (fn.LOWER(Events.location) << [x.lower() for x in facilities])
            & (Lessons.from_date >= parse(args["from"]))
            & (Lessons.from_date <= parse(args["to"]))
        )
        .group_by(
            Events.sport, fn.STRFTIME("%Y-%m-%d", Lessons.from_date, "unixepoch")
        )
    )
    
    # get all the days
    data = {}
    for sport in activities:
        data[sport.lower()] = []
    for row in query:
        data[row.sport.lower()].append(
            {"x": row.date, "y": row.sum}
        )
    final = [{"id": key, "data": data[key.lower()]} for key in data]

    return jsonify(final)


@app.route("/api/weekly", methods=["POST"])
def weekly():
    """Returns a weekly view by hour of how many slots are taken"""
    args = request.get_json()

    try:
        activity = args["activities"]
        if len(activity) == 0:
            return abort(400, "Empty activities")

        location = args["locations"]
        if len(location) == 0:
            return abort(400, "Empty locations")
        
        query = (
            Events.select(
                Trackings.track_date,
                fn.AVG(Trackings.places_free).alias("avg_free"),
                fn.AVG(Trackings.places_max).alias("avg_max"),
                Lessons.from_date,
                Lessons.to_date,
                Events.sport,
                Events.title,
            )
            .join(Lessons)
            .join(Trackings)
            .join(LATEST_TRACKING, on=(LATEST_TRACKING.c.lesson_id == Trackings.lesson.id))
            .where(
                Trackings.track_date == LATEST_TRACKING.c.max_date,
                (fn.LOWER(Events.sport) ** activity),
                (fn.LOWER(Events.location) ** location),
                (Lessons.from_date >= parse(args["from"])),
                (Lessons.from_date <= parse(args["to"])),
            )
            .group_by(
                fn.STRFTIME("%w", Lessons.from_date, "unixepoch"),
                fn.STRFTIME("%H:%M", Lessons.from_date),
            )
        )

    except KeyError:
        return abort(400, "Invalid POST request")

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
    time_slots = [f"{h:02}:00" for h in range(0, 24)]
    for day in weekdays:
        data[day] = {}
        details[day] = []
        for rounded_time in time_slots:
            data[day][rounded_time] = []

    for row in query:
        rounded_time = row.lessons.from_date[:3] + "00"
        day = weekdays[row.track_date.weekday()]
        data[day][rounded_time].append(
            {
                "sport": row.entry.sport,
                "time": row.entry.from_date,
                "weekday": day,
                "timeTo": row.entry.to_date,
                "avgFree": row.avg_free,
                "maxAvg": row.avg_max,
                "title": row.entry.title,
            }
        )

    formatted = {}
    for day in sorted(data.keys()):
        formatted[day] = []
        for rounded_time in time_slots:
            formatted[day].append(
                {"time": rounded_time, "details": data[day][rounded_time]}
            )

    return jsonify(formatted)


@app.route("/api/minmaxdate", methods=["GET"])
def min_max_date():
    """Returns the minimum and maximum date of the tracked data"""
    query = Lessons.select(
        fn.MIN(Lessons.from_date).alias("min"),
        fn.MAX(Lessons.to_date).alias("max"),
    )
    for row in query:
        return jsonify(
            {"from": row.min.strftime("%Y-%m-%d"), "to": row.max.strftime("%Y-%m-%d")}
        )
    return abort(500, "No Data")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
