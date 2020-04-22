#!/bin/bash

echo "
Estas son las dependecias y licencias usadas en AIGAR. Se incluyen únicamente aquellas dependencias usadas por la aplicación y no dependencias de desarrollo.

Todas ellas son compatibles con la AGPL usanda para licenciar la aplicación

Dependencias Python:

" > desktop/NOTICE

pip-licenses --ignore-packages $(python scripts/python_notice.py api/requirements.txt) --with-authors --with-urls --from=meta --format=markdown >> desktop/NOTICE

echo "
Dependencias Javascript:
" >> desktop/NOTICE

(cd web && npx license-checker --production --csv --excludePackages 'web@0.1.0') >> desktop/NOTICE

(cd web && npx license-checker --production --summary --excludePackages 'web@0.1.0')
pip-licenses --ignore-packages $(python scripts/python_notice.py api/requirements.txt) --with-authors --with-urls --from=meta --format=markdown --summary
