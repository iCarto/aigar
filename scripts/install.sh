#!/bin/bash -i
# We use -i to read .bashrc and have commands like rmvirtualenv available

set -euo pipefail

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

bash -i "${this_dir}"/util/check-os-deps.sh

source "${this_dir}"/../server/variables.ini
cd "${this_dir}"/..

# Clean up
command -v deactivate && deactivate

: "${PROJECT_NAME}" # checks that project_name exists, if not an unbound variable is raised

# virtualenv commands print weird warnings with set -u
(set +u && rmvirtualenv "${PROJECT_NAME}")

# Developer Experience Setup
if ! pyenv versions | grep "${PYTHON_VERSION}" > /dev/null 2>&1; then
    pyenv update
    # https://github.com/pyenv/pyenv/blob/master/plugins/python-build/README.md
    # "--enable-shared"
    env PYTHON_CONFIGURE_OPTS='--enable-optimizations --with-lto' PYTHON_CFLAGS='-march=native -mtune=native' pyenv install "${PYTHON_VERSION}"
fi
PYTHON_VERSION_BINARY_PATH="$(pyenv shell "${PYTHON_VERSION}" && pyenv which python)"

set +u
# https://github.com/pexpect/pexpect/commit/71bbdf52ac153c7eaca631637ec96e63de50c2c7
mkvirtualenv -p "${PYTHON_VERSION_BINARY_PATH}" -a . "${PROJECT_NAME}" || true
workon "${PROJECT_NAME}"
set -u

if ! command -v deactivate; then
    echo "Not in a virtualenv. Can not continue."
    exit 1
fi

python -m pip install --upgrade pip
python -m pip install --upgrade build

# backend and dev dependencies
pip install --editable '.[all]'

npm install
pre-commit clean
pre-commit gc
pre-commit install --install-hooks --overwrite

# backend stuff
bash scripts/install.back.sh

# frontend stuf
bash scripts/install.front.sh

# ./scripts/util/prod-package.sh

# link to UI
bash scripts/install.link_back_front.sh

# app-specific
#-------------
"${this_dir}"/util/setup-custom.sh
"${this_dir}"/reset_and_create_db.sh

echo "* DONE :)"
