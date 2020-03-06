#!/bin/bash

source ./scripts/util/env.sh

# build the frontend
(
    cd $FRONTEND_PATH
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
rsync -avm \
    --include=$FRONTEND_PATH/build \
    --exclude-from=./.gitignore \
    --exclude=.git \
    --exclude=$BACKEND_PATH/static \
    --exclude=scripts \
    --exclude="$FRONTEND_PATH/*" \
    . prod

# move the frontend to its place
mv prod/$(basename $FRONTEND_PATH)/build prod/$BACKEND_PATH/static
rmdir prod/$(basename $FRONTEND_PATH)

# add a production gitignore
cp ./scripts/util/prod-gitignore prod/.gitignore
