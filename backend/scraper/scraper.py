import json
import requests
from datetime import datetime
import dateutil.parser
from pytz import timezone
import time
from models import Activities, Entries, Trackings, create_all_tables
import os


tz = timezone("Europe/Zurich")


def fetch(limit, offset=0):
    return json.loads(requests.get(f"https://asvz.ch/asvz_api/event_search?_format=json&limit={limit}&offset={offset}").text)


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
        all_scraped = 0
        i = 0
        while not all_scraped:
            js: dict = fetch(120, i * 120)
            for e in js["results"]:
                if e["cancelled"]:
                    continue
                from_date = dateutil.parser.isoparse(
                    e['from_date']).astimezone(tz)
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
                        "places_max": e["places_max"],
                        "places_taken": e.get("places_taken", e["places_max"]),
                        "from_date": e['from_date'],
                        "to_date": e['to_date']
                    }
                except KeyError:
                    continue
                entries.append(t)
            i += 1
            print(f"Fetching iteration: {i}")

        print(f"Entries: {len(entries)}")

        with open("data/entries.json", "w") as f:
            json.dump(entries, f, indent=4)

        # updates the sports.json file with all the current sport types
        sports = {}
        for fa in js["facets"]:
            if fa["id"] != "sport":
                continue
            for s in fa["terms"]:
                sports[s["tid"]] = s["label"]
        with open("sports.json", "w") as f:
            json.dump(sports, f, indent=4)
    else:
        with open("data/entries.json", "r") as f:
            entries: list = json.load(f)

    # converts datetime to datetime objects for ease of use
    for e in entries:
        e["from_date"] = dateutil.parser.isoparse(
            e['from_date']).astimezone(tz)
        e["to_date"] = dateutil.parser.isoparse(
            e['to_date']).astimezone(tz)

    return entries


def add_to_db(entries: list):
    secs = int(time.time())
    add_entries = []
    add_timestamps = []
    update_timestamps = []
    for e in entries:
        # create new activity
        entry, created = Activities.get_or_create(
            sport=e["sport"],
            time=e["title"],
            location=e["location"],
            niveau = e["niveau"],
        )
        if created:
            add_entries.append(entry)
            
        ts, created = Timestamps.get_or_create(
            id=e["nid"], 
            defaults={
                "entry": entry, 
                "last_space_date": None, 
                "places_max": e["places_max"],
                "places_taken": e["places_taken"],
                "track_date": secs,
                "start_date": int(e["from_date"].timestamp())
            }
        )
        if not created:
            ts.last_space_date = secs if e["places_max"]-e["places_taken"]>0 else ts.last_space_date
            ts.track_date = secs
            ts.places_taken = e["places_taken"]
            update_timestamps.append(ts)
        else:
            add_timestamps.append(ts)
    
    # save the values
    Entries.bulk_create(add_entries)
    Timestamps.bulk_create(add_timestamps)
    Timestamps.bulk_update(update_timestamps, fields=[Timestamps.last_space_date, Timestamps.track_date, Timestamps.places_taken])
    
    print(
        f"Successfully inserted/updated {len(entries)} entries into the db")
    

if __name__ == "__main__":
    if not os.path.exists("data/entries.db"):
        create_all_tables()
    entries = scrape(True, 24)  # scrape x hours in advance
    add_to_db(entries)
