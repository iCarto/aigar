#!/bin/bash
set -e

./scripts/reset_db_and_migrations.sh
./scripts/util/prod-package.sh
cp web/src/fixtures/electron.exe desktop/gomi
# ./scripts/util/prod-commit.sh
# (
#     cd prod
#     git push heroku prod:master
# )

exit
