import json
from datetime import datetime
import os
import time
import requests
import dateutil.parser
from pytz import timezone
from models import Events, Lessons, Trackings, create_all_tables


# global timezone as all times received are based in Zurich
tz = timezone("Europe/Zurich")


def fetch(limit, offset=0):
    return json.loads(
        requests.get(
            f"https://asvz.ch/asvz_api/event_search?_format=json&limit={limit}&offset={offset}",
            timeout=20,
        ).text
    )


def scrape(FETCH, hours_to_scrape=24):
    """
    Fetches the next few hours with all activities
    Args:
        FETCH: If the script should fetch. Else it will simply take the local entries.json file.
        hours_to_scrape (int): Amount of hours into the future to scrape.
    """
    if FETCH:
        entries = []
        dt = datetime.now().astimezone(tz)
        all_scraped = False
        js = {}
        i = 0
        while not all_scraped:
            js = fetch(800, i * 800)
            for e in js["results"]:
                if e["cancelled"]:
                    continue
                from_date = dateutil.parser.isoparse(e["from_date"]).astimezone(tz)
                if (from_date - dt).total_seconds() / 3600 >= hours_to_scrape:
                    all_scraped = True
                    break
                try:
                    t = {
                        "nid": e["nid"],
                        "sport": e["sport_name"],
                        "title": e["title"],
                        "location": e["location"],
                        "places_free": e.get("places_free", 0),
                        "places_max": e.get("places_max", 0),
                        "places_taken": e.get("places_taken", e.get("places_max", 0)),
                        "from_date": e["from_date"],
                        "to_date": e["to_date"],
                        "niveau_name": e["niveau_name"],
                        "cancelled": e["cancelled"],
                        "livestream": e["livestream"],
                        "oe_from_date": e["oe_from_date"],
                    }
                    entries.append(t)
                except KeyError:
                    print(f"Wasn't able to parse {e}")
            i += 1
            print(f"Fetching iteration: {i}")

        print(f"Entries: {len(entries)}")

        with open("data/entries.json", "w", encoding="utf-8") as f:
            json.dump(entries, f, indent=4)

        # updates the sports.json file with all the current sport types
        sports = {}
        for fa in js["facets"]:
            if fa["id"] != "sport":
                continue
            for s in fa["terms"]:
                sports[s["tid"]] = s["label"]
        with open("sports.json", "w", encoding="utf-8") as f:
            json.dump(sports, f, indent=4)
    else:
        with open("data/entries.json", "r", encoding="utf-8") as f:
            entries: list = json.load(f)

    # converts datetime to datetime objects for ease of use
    for e in entries:
        e["from_date"] = dateutil.parser.isoparse(e["from_date"]).astimezone(tz)
        e["to_date"] = dateutil.parser.isoparse(e["to_date"]).astimezone(tz)
        e["oe_from_date"] = dateutil.parser.isoparse(e["oe_from_date"]).astimezone(tz)

    return entries


def add_to_db(entries: list):
    current_time = int(time.time())
    update_lessons = []
    for e in entries:
        # create new activity
        event, _ = Events.get_or_create(
            sport=e["sport"],
            title=e["title"],
            location=e["location"],
            niveau=e["niveau_name"],
        )

        # Case 1: Same event ID, but from/toDate/places_max might've been modified
        lesson = Lessons.get_or_none(nid=e["nid"])

        # Case 2: event ID not stored yet. Either ID was changed or new lesson, but event & time overlap (so same event)
        if not lesson:
            lesson, _ = Lessons.get_or_create(
                event=event,
                from_date=int(e["from_date"].timestamp()),
                to_date=int(e["to_date"].timestamp()),
                defaults={
                    "nid": e["nid"],
                    "places_max": 0,
                    "cancelled": False,
                    "livestream": False,
                    "from_date": 0,
                    "to_date": 0,
                },
            )
        else:
            lesson.from_date = int(e["from_date"].timestamp())
            lesson.to_date = int(e["to_date"].timestamp())

        # always update lessons to make sure values are up to date (they might change)
        lesson.places_max = e["places_max"]
        lesson.cancelled = e["cancelled"]
        lesson.livestream = e["livestream"]
        update_lessons.append(lesson)


        # checks if the signup is open already
        if e["oe_from_date"].timestamp() <= current_time:
            # check free/taken spots
            Trackings.create(
                lesson=lesson,
                track_date=current_time,
                places_free=e["places_free"],
            )

    # bulk update all
    Lessons.bulk_update(
        update_lessons,
        fields=[
            Lessons.from_date,
            Lessons.to_date,
            Lessons.places_max,
            Lessons.cancelled,
            Lessons.livestream,
        ],
    )

    print(f"Successfully inserted/updated {len(entries)} entries into the db")


def main():
    if not os.path.exists("data/entries.db"):
        print("Creating database")
        try:
            os.mkdir("data")
        except OSError:
            pass
        create_all_tables()
    entries = scrape(True, 24 * 7)  # scrape 7 days
    add_to_db(entries)


if __name__ == "__main__":
    main()
