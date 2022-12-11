import os
from flask import Flask, request, abort, jsonify
from scraper.models import Timestamps, Entries, fn
from dateutil.parser import parse

app = Flask(__name__)


@app.route("/api/countday")
def count_day():
    query = (Timestamps
             .select(Timestamps.track_date, fn.SUM(Timestamps.places_taken).alias("sum"))
             .group_by(fn.STRFTIME("%Y-%m-%d", Timestamps.track_date, "unixepoch")))
    res = [
        {
            "day": x.track_date.strftime("%Y-%m-%d"),
            "value": x.sum,
        } for x in query
    ]
    return jsonify(res)


@app.route("/api/sports")
def sports():
    return jsonify([x.sport for x in Entries.select(Entries.sport).distinct()])


@app.route("/api/locations", methods=["POST"])
def locations():
    args = request.get_json()
    if len(args) == 0:
        query = Entries.select(Entries.location).distinct()
    else:
        query = (Entries
                 .select(Entries.location)
                 .where(fn.LOWER(Entries.sport) << [x.lower() for x in args])
                 .distinct())
    return jsonify([x.location for x in query])

@app.route("/api/history", methods=["POST"])
def history():
    args = request.get_json()
    try:
        activities = args["activities"]

        if len(activities) == 0:
            return abort(400, "Empty activities")

        locations = args["locations"]
            
        order_by = args["orderBy"]
        if order_by == "date":
            order = Timestamps.track_date
        elif order_by == "sport":
            order = Entries.sport
        elif order_by == "location":
            order = Entries.location
        elif order_by == "places_max":
            order = Timestamps.places_max
        elif order_by == "places_max-places_taken":
            order = Timestamps.places_max - Timestamps.places_taken
        else:
            return abort(400, "Invalid orderBy")
        if args["desc"]:
            order = order.desc() 

    except KeyError:
        return abort(400, "Invalid POST request")

    query = (Timestamps
             .select()
             .join(Entries)
             .where(
                (fn.LOWER(Entries.sport) << [x.lower() for x in activities])
                & (fn.LOWER(Entries.location) << [x.lower() for x in locations])
                & (Timestamps.track_date >= parse(args["from"]))
                & (Timestamps.track_date <= parse(args["to"]))
             )
             .order_by(order))
    res = [
        {
            "date": f"{x.track_date.strftime('%a %Y-%m-%d')}",
            "activity": x.entry.sport,
            "location": x.entry.location,
            "spots_total": x.places_max,
            "spots_free": x.places_max-x.places_taken,
        } for x in query
    ]
    return jsonify(res)


@app.route("/api/historyline", methods=["POST"])
def history_line():
    args = request.get_json()
    
    try:
        activities = args["activities"]
        if len(activities) == 0:
            return abort(400, "Empty activities")
        locations = args["locations"]
        if len(locations) == 0:
            return abort(400, "Empty locations")


    except KeyError:
        return abort(400, "Invalid POST request")
    
    query = (Timestamps
             .select(Timestamps.track_date, Entries.sport,  fn.SUM(Timestamps.places_max-Timestamps.places_taken).alias("sum"))
             .join(Entries)
             .where(
                (fn.LOWER(Entries.sport) << [x.lower() for x in activities])
                & (fn.LOWER(Entries.location) << [x.lower() for x in locations])
                & (Timestamps.track_date >= parse(args["from"]))
                & (Timestamps.track_date <= parse(args["to"]))
             )
             .group_by(Entries.sport, fn.STRFTIME("%Y-%m-%d", Timestamps.track_date, "unixepoch")))

    # get all the days
    data = {}
    for s in activities:
        data[s.lower()] = []
    for x in query:
        data[x.entry.sport.lower()].append({"x": x.track_date.strftime("%Y-%m-%d"), "y": x.sum})
    final = []
    for key in data.keys():
        d = {"id": key, "data": data[key.lower()]}
        final.append(d)

    return jsonify(final)


@app.route("/api/weekly", methods=["POST"])
def weekly():
    args = request.get_json()
    
    try:
        activity = args["activities"]
        if len(activity) == 0:
            return abort(400, "Empty activities")

        location = args["locations"]
        if len(location) == 0:
            return abort(400, "Empty locations")
    
        query = (Timestamps
                .select(
                    Timestamps.track_date,
                    fn.AVG(Timestamps.places_max-Timestamps.places_taken).alias("avg_free"),
                    fn.AVG(Timestamps.places_max).alias("avg_max"),
                    Entries.from_date,
                    Entries.to_date,
                    Entries.sport,
                    Entries.title,
                )
                .join(Entries)
                .where(
                    (fn.LOWER(Entries.sport) ** activity)
                    & (fn.LOWER(Entries.location) ** location)
                    & (Timestamps.track_date >= parse(args["from"]))
                    & (Timestamps.track_date <= parse(args["to"]))
                )
                .group_by(fn.STRFTIME("%w", Timestamps.track_date, "unixepoch"), fn.STRFTIME("%H:%M", Entries.from_date)))
    
    except KeyError:
        return abort(400, "Invalid POST request")
    
    data = {}
    details = {}  # more details when its clicked on
    weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    time_slots = ["%02d:%s" % (h, m) for h in range(0, 24) for m in ["00"]]
    for wd in weekdays:
        data[wd] = {}
        details[wd] = []
        for rt in time_slots:
            data[wd][rt] = []

    for x in query:
        rt = x.entry.from_date[:3] + "00"
        wd = weekdays[x.track_date.weekday()]
        data[wd][rt].append(
            {"sport": x.entry.sport,
             "time": x.entry.from_date,
             "weekday": wd,
             "timeTo": x.entry.to_date,
             "avgFree": x.avg_free,
             "maxAvg": x.avg_max,
             "title": x.entry.title,
            }
        )
    
    formatted = {}
    for wd in sorted(data.keys()):
        formatted[wd] = []
        for rt in time_slots:
            formatted[wd].append({"time": rt, "details": data[wd][rt]})
    
    return jsonify(formatted)


@app.route("/api/minmaxdate", methods=["GET"])
def min_max_date():
    query = Timestamps.select(fn.MIN(Timestamps.track_date).alias("min"), fn.MAX(Timestamps.track_date).alias("max"))
    for x in query:
        return jsonify({"from": x.min.strftime("%Y-%m-%d"), "to": x.max.strftime("%Y-%m-%d")})
    return abort(500, "No Data")


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "true") == "true", host="0.0.0.0")
