#!/bin/bash

source ./scripts/util/env.sh

# build the frontend
(
    cd $FRONTEND_PATH
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
# --include=$FRONTEND_PATH/build \
# --exclude=scripts \
# --exclude="$FRONTEND_PATH/*" \
rsync -avm \
    --exclude-from="$BACKEND_PATH/.gitignore" \
    --exclude"=$BACKEND_PATH/static" \
    "$BACKEND_PATH" prod

cp api/.env prod/api
cp api/db.sqlite3 prod/api

# move the frontend to its place
mv "$FRONTEND_PATH/build" "prod/${BACKEND_PATH}/api/static"
mv "prod/${BACKEND_PATH}/api/static/static/js" "prod/${BACKEND_PATH}/api/static/"
mv "prod/${BACKEND_PATH}/api/static/static/css" "prod/${BACKEND_PATH}/api/static/"
mv "prod/${BACKEND_PATH}/api/static/static/media" "prod/${BACKEND_PATH}/api/static/"
rm -r "prod/${BACKEND_PATH}/api/static/static/"

mkdir -p desktop/gomi
mv "prod/${BACKEND_PATH}" desktop/gomi/src
rm -r prod
# add a production gitignore
# cp ./scripts/util/prod-gitignore prod/.gitignore
