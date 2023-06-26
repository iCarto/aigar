#!/bin/bash

# build the frontend
(
    cd front
    npm install
    npm run build
)

# clean out files
mkdir -p prod
if [ -d ./prod/.git ]; then
    (
        cd prod
        git rm -rf .
        git clean -fxd
    )
else
    (rm -rf ./prod/*)
fi

# copy all of the backend and only the build frontend
# --exclude=.git \
# --include=front/build \
# --exclude=scripts \
# --exclude="front/*" \
rsync -avm \
    --exclude-from="back/.gitignore" \
    --exclude"=back/static" \
    back prod

cp api/.env prod/api
cp api/db.sqlite3 prod/api
cp api/db.sqlite3.empty prod/api

# move the frontend to its place
mv "front/build" "prod/back/api/static"
mv "prod/back/api/static/static/js" "prod/back/api/static/"
mv "prod/back/api/static/static/css" "prod/back/api/static/"
mv "prod/back/api/static/static/media" "prod/back/api/static/"
rm -r "prod/back/api/static/static/"

mkdir -p desktop/gomi
mv "prod/back" desktop/gomi/src
rm -r prod
# add a production gitignore
# cp ./scripts/util/prod-gitignore prod/.gitignore
