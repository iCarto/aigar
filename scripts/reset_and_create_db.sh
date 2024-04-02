#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

reset_django_migrations() {
    # Eliminamos todo para restaurarlo de cero y creamos una bd limpia
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete

    SITE_PACKAGES=$(python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")

    # Eliminamos también las migraciones de los paquetes de django que utilicemos
    # para que no se creen migraciones intermedias
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/auth" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/admin" -path "*/migrations/*.pyc" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find "${SITE_PACKAGES}/django/contrib/contenttypes" -path "*/migrations/*.pyc" -delete
}

if [[ -f back/manage.py ]]; then
    reset_django_migrations
fi

# TODO: Revisar como hacer esto de forma adecuada (funciones?, script?)
# bash "${this_dir}/../server/drop_and_create_db.sh"

bash "${this_dir}"/install.link_back_front.sh

rm -f "${SQLITE_PATH}"
"${this_dir}"/fixtures.sh

# if [[ "${DATABASE_CONTROL_CHANGES_MODE}" == "sqitch" ]]; then
#     (
#         cd "${this_dir}/../db" || exit
#         sqitch deploy
#     )
# else
#     # Crea las migraciones. migrations/__init__.py debe existir para que se cree la
#     # migración inicial de una app o debe invocarse la app de forma concreta
#     # python manage.py makemigrations users
#     python "${this_dir}/../back/manage.py" makemigrations
#     # Ejecuta las migraciones contra la bd
#     python "${this_dir}/../back/manage.py" migrate

#     sqlite3 "${SQLITE_PATH}" "
#         PRAGMA foreign_keys = ON;
#     "
# fi

if [[ -f ${this_dir}/../back/manage.py ]]; then
    # DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD}" python "${this_dir}/../back/manage.py" createsuperuser --no-input --username admin --email=admin@example.com
    python "${this_dir}/../back/manage.py" collectstatic --no-input --clear --verbosity 0
fi

bash "${this_dir}/move_db_state_to.sh" "${1}"
