"""Migrate old database format to new"""

from peewee_migrate import Router
import sys
from scraper.models import database


def main():
    router = Router(database)
    if len(sys.argv) <= 1:
        print(
            "No command given. Current commands:\n"
            + "  - migrate      Runs all unapplied migrations\n"
            + "  - create NAME  Creates a new migration with the given NAME"
        )
        exit(1)

    if sys.argv[1] == "migrate":
        router.run()
        return

    if sys.argv[1] == "create":
        router.create(sys.argv[2], auto="scraper.models")


if __name__ == "__main__":
    main()
