#!/bin/bash
set -e

./scripts/reset_db_and_migrations.sh
./scripts/util/prod-package.sh
cp web/src/fixtures/electron.exe desktop/gomi

DATE=$(date +%y%m%d)
sed -i "s/\"version\":.*/\"version\": \"${DATE}\",/" "package.json"
cp LICENSE desktop/gomi/src

# ./scripts/util/prod-commit.sh
# (
#     cd prod
#     git push heroku prod:master
# )

exit
