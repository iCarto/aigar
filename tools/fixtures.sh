#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

# python ../scripts/database.py --hack ../web/src/fixtures/database_fileindex.csv > ../api/fixtures.json
# python manage.py loaddata fixtures.json

cp "${this_dir}/fixtures/db.sqlite3" ../back/db.sqlite3
