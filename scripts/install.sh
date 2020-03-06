#!/bin/bash
set -e

source ./scripts/util/env.sh
source ./scripts/util/check-os-deps.sh

[[ -z $VIRTUAL_ENV ]] && echo "El virtualenv debe estar activo" && exit 1

# DEV stuff
npm install
pip install -r requirements-dev.txt
pre-commit install --install-hooks

if [ -z "$(command -v shfmt)" ]; then
    echo "shfmt no está instalado. El código bash no será formateado."
fi

# backend stuff
# -------------

## Python setup

pip install -r ${BACKEND_PATH}/requirements.txt
pip install -r ${BACKEND_PATH}/requirements-dev.txt
pip install -r scripts/requirements.txt

# frontend stuff
# -------------

if [ ! -d $FRONTEND_PATH ]; then
    create-react-app $FRONTEND_PATH
fi
# build the frontend
(
    cd $FRONTEND_PATH
    npm install
)
./scripts/util/prod-package.sh

# TODO
# link to UI
if [[ ! -e ${BACKEND_PATH}/api/static && ! -L ${BACKEND_PATH}/api/static ]]; then
    echo "* linking Django app to the JS frontend"
    CURDIR=$(pwd)
    cd ${BACKEND_PATH}/api
    ln -s ../../${FRONTEND_PATH}/build static
    cd $CURDIR
else
    echo "* frontend already linked"
fi

# app-specific
#-------------
./scripts/util/setup-custom.sh
./scripts/reset_db_and_migrations.sh

echo "* DONE :)"

exit
