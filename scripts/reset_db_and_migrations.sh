#!/bin/bash

source ./scripts/util/env.sh

cd "${BACKEND_PATH}" || {
    echo "Can not access: ${BACKEND_PATH}"
    exit 1
}

# Eliminamos todo para restaurarlo de cero
rm db.sqlite3
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Crea las migraciones. migrations/__ini__.py debe existir para que se cree la
# migración inicial de una app o debe invocarse la app de forma concreta
# python manage.py makemigrations users
python manage.py makemigrations

# Ejecuta las migraciones contra la bd
python manage.py migrate

export DJANGO_SUPERUSER_PASSWORD
python manage.py createsuperuser --no-input --username admin

python ../scripts/database.py --hack ../web/src/fixtures/database_fileindex.csv > ../api/fixtures.json
python manage.py loaddata fixtures.json
