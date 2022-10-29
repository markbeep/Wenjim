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


@app.route("/api/countdaybar")
def count_day_sport():
    sql = f"""
        SELECT
            strftime('%Y-%m-%d', track_date, 'unixepoch') AS day,
            SUM(places_taken),
            LOWER(sport)
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        GROUP BY sport, day"""
    with DB() as conn:
        res = conn.execute(sql).fetchall()

    # get all the days
    sql = f"""
        SELECT
            DISTINCT sport
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)"""
    all_sports = sports()
    data = {}
    for s in all_sports:
        data[s] = []
    for day, value, sport in res:
        data[sport].append({"x": day, "y": value})
    final = []
    for key in data.keys():
        d = {"id": key, "data": data[key]}
        final.append(d)

    return final


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
def count_history():
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
        if order_by not in ["date", "sport", "location", "places_max", "places_taken"]:
            return "Invalid orderBy", 400

        order_desc = args["desc"]
        order_desc_sql = "DESC" if order_desc else "ASC"

    except KeyError:
        return "Invalid POST request", 400

    sql = f"""
        SELECT
            strftime('%Y-%m-%d ', track_date, 'unixepoch') || from_date AS date,
            sport,
            location,
            places_max,
            places_taken,
            DATE(track_date, 'unixepoch') as cmp_date
        FROM Entries
        INNER JOIN Timestamps USING (entry_id)
        WHERE ({activities_sql}) AND ({locations_sql}) AND DATE(?) <= cmp_date AND DATE(?) >= cmp_date
        ORDER BY {order_by} {order_desc_sql}
        """
    with DB() as conn:
        res = conn.execute(sql, activities+locations +
                           [from_date, to_date]).fetchall()
    res = [
        {
            "date": x[0],
            "activity": x[1],
            "location": x[2],
            "spots_available": x[3],
            "spots_taken": x[4],
        } for x in res
    ]
    return res


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
