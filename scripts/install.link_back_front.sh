#!/bin/bash

echo "Linking UI"

this_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && pwd)"

source "${this_dir}"/../server/variables.ini

# Limpiamos el directorio media
# rm -rf "${this_dir}/../back/media/*"

# Creamos los directorios necesarios para los estáticos
python "${this_dir}/../back/manage.py" shell -c "
from django.conf import settings
import os
for d in settings.STATICFILES_DIRS: os.makedirs(d, exist_ok=True)
"
