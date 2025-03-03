#!/bin/bash

set -euo pipefail

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

./scripts/reset_and_create_db.sh empty
cp "${SQLITE_PATH}" "${SQLITE_PATH}".empty

bash ./scripts/util/build_web_deploy_file.sh
cp dist/aigar-25.3.3.tar.gz desktop/gomi/

cp tools/fixtures/gomi/electron.exe desktop/gomi

# cp LICENSE desktop/gomi/src
# cp README.md desktop/gomi/src

# ./scripts/create_notice.sh desktop/NOTICE 'web@0.1.0'
# DEBUG=True hace falta para que funcione servir desde /media. Por algún motivo whitenoise
# no lo está sirviendo
bash ./scripts/util/echo_env_back.sh | sed 's/DESKTOP=False/DESKTOP=True/' | sed 's/DEBUG=True/DEBUG=True/' | sed '/^ALLOWED_/d' | sed 's/# ALLOWED_/ALLOWED_/' > desktop/gomi/.env
cp -r back/aigar_data desktop/gomi/
cp ./tools/fixtures/gomi/logo-ascatli.png desktop/gomi/aigar_data

cd "${this_dir}"/../desktop
vagrant halt
vagrant up --provision

rm -rf "${HOME}/VirtualBox VMs/shared/${TODAY}_aigar"
rm -rf "${HOME}/VirtualBox VMs/shared/aigar_data"
cp -r gomi/aigar_data "${HOME}/VirtualBox VMs/shared/"
cp -r "gomi/${TODAY}_aigar" "${HOME}/VirtualBox VMs/shared/"

echo "DONE!"
