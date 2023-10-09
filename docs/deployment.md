# Deployment

Empaquetado de la aplicación de Escritorio

```shell
./scripts/deploy.sh
cd desktop
vagrant halt
vagrant up --provision
```

Tras esto la carpeta `desktop/gomi/$(date +%y%m%d)_aigar` contendrá la aplicación de escritorio. Puede zipearse (mejor con 7zip) y ser redistribuida.

El fichero `package.json` se habrá modificado automáticamente con la nueva versión (fecha). Cuando sean versiones internas puede descartarse. Con versiones externas:

```
git add package.json
git commit -m "New Version: $(date +%y%m%d)"
git tag "$(date +%y%m%d)"
git push --tags origin master
```

## Test deployment

Una forma no muy cómoda pero funcional de probar el "bundle" en linux sería:

```
# En un terminal dentro del virtualenv
python desktop/gomi/$(date +%y%m%d)_aigar/src/manage.py runserver_plus

# En otro terminal
npx electron desktop/gomi/$(date +%y%m%d)_aigar/resources/app/main.js
```
