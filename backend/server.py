from typing import List
from flask import Flask
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
    sql = "SELECT DISTINCT LOWER(sport) FROM Entries"
    with DB() as conn:
        res = conn.execute(sql).fetchall()
    return [x[0] for x in res]


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
