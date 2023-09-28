#!/bin/bash

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"
source "${this_dir}"/../server/variables.ini

# python ../scripts/database.py --hack ../web/src/fixtures/database_fileindex.csv > ../api/fixtures.json
# python manage.py loaddata fixtures.json

cp "${this_dir}/fixtures/db.sqlite3" "${SQLITE_PATH}"

sqlite3 "${SQLITE_PATH}" "
    PRAGMA foreign_keys = ON;

    DROP TABLE auth_group;
    DROP TABLE users_user_groups;
    DROP TABLE auth_group_permissions;
    DROP TABLE users_user_user_permissions;
    DROP TABLE auth_permission;
    DROP TABLE django_admin_log;
    DROP TABLE django_content_type;
    DROP TABLE django_migrations;
    DROP TABLE django_session;
    DROP TABLE users_user;
    /* DROP TABLE users_user_groups; */
    /* DROP TABLE users_user_user_permissions; */
"
