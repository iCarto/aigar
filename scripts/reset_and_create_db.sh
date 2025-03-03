#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini
# source "${this_dir}"/../tools/db_utils.sh

reset_django_migrations() {
    # Eliminamos todo para restaurarlo de cero y creamos una bd limpia
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete

    SITE_PACKAGES=$(python -c "import sysconfig; print(sysconfig.get_path('platlib'))")

    # Eliminamos también las migraciones de los paquetes de django que utilicemos
    # para que no se creen migraciones intermedias
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.pyc" -delete
}

# reset_django_migrations

# TODO: Revisar como hacer esto de forma adecuada (funciones?, script?)
bash "${this_dir}/../server/drop_and_create_db.sh"

bash "${this_dir}"/install.link_back_front.sh

# Crea las migraciones. migrations/__ini__.py debe existir para que se cree la
# migración inicial de una app o debe invocarse la app de forma concreta
# python manage.py makemigrations users
python "${this_dir}/../back/manage.py" makemigrations
# Ejecuta las migraciones contra la bd
python "${this_dir}/../back/manage.py" migrate

# In install.sh static folders are created
# At this point static assets are collected
python "${this_dir}/../back/manage.py" collectstatic --no-input --clear --verbosity 0

bash "${this_dir}/move_db_state_to.sh" "${1}"

# Aplicar migraciones pendientes tras copiar bd de fixtures
python "${this_dir}/../back/manage.py" migrate
