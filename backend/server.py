from flask import Flask
import sqlite3

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


@app.route("/api/alldata")
def all_data():
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
