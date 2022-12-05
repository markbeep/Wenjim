import os
from flask import Flask, request, abort, jsonify
import sqlite3
import sys


app = Flask(__name__)


DATABASE_FILEPATH = "data/entries.db"

class DB:
    def __init__(self, fp=DATABASE_FILEPATH) -> None:
        self.fp = fp

    def __enter__(self):
        self.conn = sqlite3.connect(self.fp)
        return self.conn

    def __exit__(self, type, value, traceback):
        self.conn.commit()
        self.conn.close()


@app.route("/api/countday")
def count_day():
    sql = """
        SELECT
            strftime('%Y-%m-%d', track_date, 'unixepoch') AS day,
            SUM(places_taken)
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        GROUP BY day"""
    with DB() as conn:
        res = conn.execute(sql).fetchall()
    res = [
        {
            "day": x[0],
            "value": x[1],
        } for x in res
    ]
    return jsonify(res)


@app.route("/api/sports")
def sports():
    sql = "SELECT DISTINCT sport FROM Entries ORDER BY sport"
    with DB() as conn:
        res = conn.execute(sql).fetchall()
    return [x[0] for x in res]


@app.route("/api/locations", methods=["POST"])
def locations():
    args = request.get_json()
    if len(args) == 0:
        sql = "SELECT DISTINCT location FROM Entries ORDER BY location"
        with DB() as conn:
            res = conn.execute(sql).fetchall()
    else:
        activities_sql = " OR ".join([f"sport LIKE ?" for _ in args])
        sql = f"SELECT DISTINCT location FROM Entries WHERE {activities_sql} ORDER BY location"
        with DB() as conn:
            res = conn.execute(sql, args).fetchall()
    return [x[0] for x in res]

@app.route("/api/history", methods=["POST"])
def history():
    args = request.get_json()
    try:
        activities = args["activities"]

        if len(activities) == 0:
            return abort(400, "Empty activities")

        activities_sql = " OR ".join([f"sport LIKE ?" for _ in activities])
        locations = args["locations"]
        locations_sql = " OR ".join([f"location LIKE ?" for _ in locations])
        if len(locations) == 0:
            locations_sql = "TRUE"

        from_date = args["from"]
        to_date = args["to"]
        order_by = args["orderBy"]

        # required to prevent sql injection, because sql doesn't support
        # insertion of order by
        if order_by not in ["date", "sport", "location", "places_max", "places_taken", "places_max-places_taken"]:
            return abort(400, "Invalid orderBy")
            
        order_desc = args["desc"]
        order_desc_sql = "DESC" if order_desc else "ASC"

        order_by_sql = f"{order_by} {order_desc_sql}"
        
        # additionally order by date for same elements
        if order_by != "date":
            order_by_sql += ",date ASC"

    except KeyError:
        return abort(400, "Invalid POST request")

    sql = f"""
        SELECT
            strftime('%Y-%m-%d ', track_date, 'unixepoch') || strftime('%H:%M', from_date) AS date,
            sport,
            location,
            places_max,
            places_max-places_taken,
            CASE strftime('%w', track_date, 'unixepoch')
                WHEN '0' THEN 'Sun'
                WHEN '1' THEN 'Mon'
                WHEN '2' THEN 'Tue'
                WHEN '3' THEN 'Wed'
                WHEN '4' THEN 'Thu'
                WHEN '5' THEN 'Fri'
                ELSE 'Sat'
            END weekday,
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE ({activities_sql}) AND ({locations_sql}) AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        ORDER BY {order_by_sql}
        """
    with DB() as conn:
        res = conn.execute(sql, activities+locations +
                           [from_date, to_date]).fetchall()
    res = [
        {
            "date": f"{x[5]} {x[0]}",
            "activity": x[1],
            "location": x[2],
            "spots_total": x[3],
            "spots_free": x[4],
        } for x in res
    ]
    return jsonify(res)


@app.route("/api/historyline", methods=["POST"])
def history_line():
    args = request.get_json()
    
    try:
        activities = args["activities"]
        if len(activities) == 0:
            return abort(400, "Empty activities")

        activities_sql = " OR ".join([f"sport LIKE ?" for _ in activities])
        locations = args["locations"]
        locations_sql = " OR ".join([f"location LIKE ?" for _ in locations])
        if len(locations) == 0:
            locations_sql = "TRUE"
            
        from_date = args["from"]
        to_date = args["to"]

    except KeyError:
        return abort(400, "Invalid POST request")
    
    sql = f"""
        SELECT
            strftime('%Y-%m-%d', track_date, 'unixepoch') AS day,
            SUM(places_max-places_taken),
            LOWER(sport),
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE ({activities_sql}) AND ({locations_sql}) AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        GROUP BY sport, day"""
    with DB() as conn:
        res = conn.execute(sql, activities + locations + [from_date, to_date]).fetchall()

    # get all the days
    data = {}
    for s in activities:
        data[s.lower()] = []
    for day, value, sport, _ in res:
        data[sport.lower()].append({"x": day, "y": value})
    final = []
    for key in data.keys():
        d = {"id": key, "data": data[key.lower()]}
        final.append(d)

    return jsonify(final)


@app.route("/api/weekly", methods=["POST"])
def weekly():
    args = request.get_json()
    
    try:
        activities = args["activities"]
        if len(activities) == 0:
            return abort(400, "Empty activities")

        activities_sql = " OR ".join([f"sport LIKE ?" for _ in activities])
        locations = args["locations"]
        locations_sql = " OR ".join([f"location LIKE ?" for _ in locations])
        if len(locations) == 0:
            locations_sql = "TRUE"
            
        from_date = args["from"]
        to_date = args["to"]

    except KeyError:
        return abort(400, "Invalid POST request")
    
    sql = f"""
        SELECT
            strftime('%H:%M', from_date) AS time,
            strftime('%H:%M', to_date) AS time_to,
            strftime("%w", track_date, 'unixepoch') as weekday,
            AVG(places_max-places_taken),
            LOWER(sport),
            title,
            AVG(places_max),
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE {activities_sql} AND {locations_sql} AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        GROUP BY weekday, time"""
        
    with DB() as conn:
        res = conn.execute(sql, activities + locations + [from_date, to_date]).fetchall()
    
    data = {}
    details = {}  # more details when its clicked on
    weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    time_slots = ["%02d:%s" % (h, m) for h in range(0, 24) for m in ["00"]]
    for wd in weekdays:
        data[wd] = {}
        details[wd] = []
        for rt in time_slots:
            data[wd][rt] = []


    # rounds the time to nearest hour
    def round_time(ti: str):
        h, m = ti.split(":")
        if int(m) <= 30:
            return h + ":00"
        else:
            return "%02d:00" % (int(h)+1)

    for time, time_to, weekday, avg, sport, title, maxAvg, _ in res:
        rt = round_time(time)
        wd = weekdays[int(weekday)]
        data[wd][rt].append({"sport": sport, "time": time, "weekday": wd, "timeTo": time_to, "avgFree": avg, "maxAvg": maxAvg, "title": title})
    
    
    formatted = {}
    for wd in sorted(data.keys()):
        formatted[wd] = []
        for rt in time_slots:
            formatted[wd].append({"time": rt, "details": data[wd][rt]})
    
    return formatted


@app.route("/api/minmaxdate", methods=["GET"])
def min_max_date():
    sql = "SELECT DATE(MIN(track_date), 'unixepoch'), DATE(MAX(track_date), 'unixepoch') FROM Timestamps"
    with DB() as conn:
        res = conn.execute(sql).fetchone()  
    if not res:
        return abort(500, "No Data")
    return {"from": res[0], "to": res[1]}


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "true") == "true", host="0.0.0.0")
