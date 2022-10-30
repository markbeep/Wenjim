import os
from typing import List
from flask import Flask, request
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
    return res


@app.route("/api/sports")
def sports():
    sql = "SELECT DISTINCT sport FROM Entries ORDER BY sport"
    with DB() as conn:
        res = conn.execute(sql).fetchall()
    return [x[0] for x in res]


@app.route("/api/locations")
def locations():
    sql = "SELECT DISTINCT location FROM Entries ORDER BY location"
    with DB() as conn:
        res = conn.execute(sql).fetchall()
    return [x[0] for x in res]


@app.route("/api/history", methods=["POST"])
def history():
    args = request.get_json()
    print(request.get_json(), file=sys.stdout, flush=True)

    try:
        activities = args["activities"]

        if len(activities) == 0:
            return "Empty activities", 400

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
            return "Invalid orderBy", 400
            
        order_desc = args["desc"]
        order_desc_sql = "DESC" if order_desc else "ASC"

        order_by_sql = f"{order_by} {order_desc_sql}"
        
        # additionally order by date for same elements
        if order_by != "date":
            order_by_sql += ",date ASC"

    except KeyError:
        return "Invalid POST request", 400

    sql = f"""
        SELECT
            strftime('%Y-%m-%d ', track_date, 'unixepoch') || strftime('%H:%M', from_date) AS date,
            sport,
            location,
            places_max,
            places_max-places_taken,
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
            "date": x[0],
            "activity": x[1],
            "location": x[2],
            "spots_total": x[3],
            "spots_free": x[4],
        } for x in res
    ]
    return res


@app.route("/api/historyline", methods=["POST"])
def history_line():
    args = request.get_json()
    
    try:
        activities = args["activities"]
        if len(activities) == 0:
            return "Empty activities", 400

        activities_sql = " OR ".join([f"sport LIKE ?" for _ in activities])
        locations = args["locations"]
        locations_sql = " OR ".join([f"location LIKE ?" for _ in locations])
        if len(locations) == 0:
            locations_sql = "TRUE"
            
        from_date = args["from"]
        to_date = args["to"]

    except KeyError:
        return "Invalid POST request", 400
    
    sql = f"""
        SELECT
            strftime('%Y-%m-%d', track_date, 'unixepoch') AS day,
            SUM(places_max-places_taken),
            LOWER(sport),
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE {activities_sql} AND {locations_sql} AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        GROUP BY sport, day"""
    with DB() as conn:
        res = conn.execute(sql, activities + locations + [from_date, to_date]).fetchall()

    # get all the days
    data = {}
    for s in activities:
        data[s.lower()] = []
    for day, value, sport, _ in res:
        data[sport].append({"x": day, "y": value})
    final = []
    for key in data.keys():
        d = {"id": key, "data": data[key.lower()]}
        final.append(d)

    return final


@app.route("/api/weekly", methods=["POST"])
def weekly():
    args = request.get_json()
    
    try:
        activities = args["activities"]
        if len(activities) == 0:
            return "Empty activities", 400

        activities_sql = " OR ".join([f"sport LIKE ?" for _ in activities])
        locations = args["locations"]
        locations_sql = " OR ".join([f"location LIKE ?" for _ in locations])
        if len(locations) == 0:
            locations_sql = "TRUE"
            
        from_date = args["from"]
        to_date = args["to"]

    except KeyError:
        return "Invalid POST request", 400
    
    sql = f"""
        SELECT
            strftime('%H:%M', from_date) AS time,
            strftime('%H:%M', to_date) AS time_to,
            strftime("%w", track_date, 'unixepoch') as weekday,
            ROUND(AVG(places_max-places_taken)),
            LOWER(sport),
            title,
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE {activities_sql} AND {locations_sql} AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        GROUP BY time, weekday"""
        
    with DB() as conn:
        res = conn.execute(sql, activities + locations + [from_date, to_date]).fetchall()
    
    data = {}
    details = {}  # more details when its clicked on
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for t in ["%02d:%s" % (h, m) for h in range(0, 24) for m in ["00", "30"]]:
        data[t] = {}
        details[t] = {}
        for w in weekdays:
            data[t][w] = 0
            # details[t][w] = []

    # rounds the time to seperate by half hour
    def round_time(ti: str):
        h, m = ti.split(":")
        if int(m) < 15:
            return h + ":00"
        if int(m) > 45:
            return "%02d:30" % (int(h)+1)
        return h + ":30"

    for time, time_to, weekday, avg, sport, title, _ in res:
        rt = round_time(time)
        wd = weekdays[int(weekday)]
        data[rt][wd] = avg
        # details[rt].append({"sport": sport, "time": time, "timeTo": time_to, "avg": avg, "title": title})
    
    
    return [{"id": k, "data": [{"x": w, "y": data[k][w]} for w in weekdays]} for k in data.keys()]

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "true") == "true", host="0.0.0.0")
