AIGAR: Aplicación Innovadora para la Gestión de Aguas Rurales

# Git Structure

-   api: Django REST API scaffolded with [generator-django-rest](https://github.com/metakermit/generator-django-rest)
-   web: React SPA frontend
-   scripts: For install, deploy and wrangling with data.

## Development

Before getting started, make sure you have a virtualenv with python 3.6 active, and npm installed

If using virtualenvwrapper

```
git clone git@gitlab.com:icarto-private/aigar.git
mkvirtualenv -p $(which python3.6) -a aigar aigar
```

To get started with development, set up the dependencies. This will install all needed stuff (for the three enviroments web, api and scripts). It's safe to launch it more than one time. It will also execute `reset_db_and_migrations.sh`

```shell
./scripts/install.sh
```

The development server can be launched with a script (frontend in 5100 and the backend in 8000) by means of honcho and Procfile.dev

```shell
./scripts/start.sh
```

Or, if you prefer do it _by hand_ just open two terminals:

```shell
cd web && npm start
cd api && python manage.py runserver
```

During the first development phase it will be useful drop all intermediate migrations and restore the full database each time a change is done in the model or in the data itself. This commands needs the `web/src/fixtures` folder:

```shell
./scripts/reset_db_and_migrations.sh
```

Take care. All these scripts **must** be launched from the root of the git repository and with the virtualenv active.

## Deployment

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

## Scripts

-   `requirements.txt` in scripts folder contains the dependencies to use the python scrips. It should be used for a different virtualenv that the application of only in development.
-   `web/src/fixtures` folder must be in place
-   `invoice_spreadsheet.py`, `member_spreadsheet.py`, `domains.py` and `database.py` are used to read the data in spreadsheets that ASCATLI is using now and transform it to json, csv, or fixtures files that can be used in the application, for develoment or for build the database. Commonly you only need to know two commands:

```
python ../scripts/database.py --hack ../web/src/fixtures/database_fileindex.csv > ../api/fixtures.json
python manage.py loaddata fixtures.json
```

or even easier:

```
./scripts/reset_db_and_migrations.sh
```
