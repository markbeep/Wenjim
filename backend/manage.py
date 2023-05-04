"""Migrate old database format to new"""

import random
import string
import sys
import time

from peewee import IntegrityError

from peewee_migrate import Router

from scraper.models import Events, Lessons, Trackings, database


def main():
    router = Router(database)
    if len(sys.argv) <= 1:
        print(
            "No command given. Current commands:\n"
            + "  - migrate      Runs all unapplied migrations\n"
            + "  - create NAME  Creates a new migration with the given NAME\n"
            + "  - testdata     Fill the database with junk entries to test queries"
        )
        exit(1)

    if sys.argv[1] == "migrate":
        database.connect(True)
        router.run()
        database.close()
        return

    if sys.argv[1] == "create":
        database.connect(True)
        router.create(sys.argv[2], auto="scraper.models")
        database.close()
        return

    if sys.argv[1] == "testdata":
        EVENTS_NUM = 10
        LESSONS_NUM = 30
        TRACKINGS_NUM = 1000

        def get_random_word():
            return ''.join(random.choice(string.ascii_letters) for i in range(10))
        cur_time = int(time.time())

        def get_random_time():
            return cur_time + random.randint(-365 * 24 * 60 * 60, 365 * 24 * 60 * 60)

        for e_i in range(EVENTS_NUM):  # events
            event = Events.create(
                sport=get_random_word(),
                title=get_random_word(),
                location=get_random_word(),
                niveau=get_random_word())
            for l_i in range(LESSONS_NUM):  # lessons
                from_date = get_random_time()
                max_places = random.randint(0, 5000)
                try:
                    lesson = Lessons.create(
                            event=event,
                            nid=random.randint(0, 9999999),
                            places_max=max_places,
                            cancelled=False,
                            livestream=False,
                            from_date=from_date,
                            to_date=from_date + 60 * 60,  # +1 hour
                            )
                except IntegrityError:
                    continue

                trackings_away = 7 * 24 * 60 * 60  # -7 days before
                trackings_interval = int(trackings_away / TRACKINGS_NUM)
                trackings_offset = from_date - trackings_away
                with database.atomic():
                    for t_i in range(TRACKINGS_NUM):  # trackings
                        Trackings.create(
                            lesson=lesson,
                            track_date=trackings_offset + t_i * trackings_interval,
                            places_free=random.randint(0, max_places),
                        )
                print(f"  {l_i} Lesson")
            print(f"{e_i} Event")
        return


if __name__ == "__main__":
    main()
