#!/bin/bash
set -euo pipefail

./scripts/reset_db_and_migrations.sh "CREAR_VACIA"
cp back/db.sqlite3 back/db.sqlite3.empty

./scripts/reset_db_and_migrations.sh

./scripts/util/prod-package.sh
cp front/src/fixtures/electron.exe desktop/gomi

cp LICENSE desktop/gomi/src
cp README.md desktop/gomi/src

./scripts/create_notice.sh desktop/NOTICE 'web@0.1.0'
