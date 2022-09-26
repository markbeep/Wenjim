from flask import Flask

app = Flask(__name__)


@app.route("/data")
def api_callback():
    return [
        {
            "sport": "Tennis",
            "location": "Höngg",
            "from_date": "20-2-1 14:40",
            "places_taken": 10,
            "places_max": 24
        }
    ]


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
