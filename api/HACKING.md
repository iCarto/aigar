# Development

Setup your api development environment:

```shell
./scripts/install.sh
```

And start developing

```shell
./scripts/start.sh
```

## Frontend details

When you call _./deploy.sh_ everything gets compiled into a _prod/_ folder,
including minified frontend code,
commited into a _prod_ branch and pushed to Heroku.

Note that create-react-app includes a service worker that caches everything
into local storage which is good for performance reasons, but messes up routing
for server-side routes like /admin. If you still wish to use these, disable
the service worker by commenting out the line `registerServiceWorker();`
in _index.js_.

# Deployment

You can deploy your Django web app to different PaaS providers
in just a few commands.

## Heroku

You can quickly deploy api to Heroku:

```shell
heroku login
heroku create api
heroku git:remote -a api
heroku addons:create heroku-postgresql:hobby-dev # for the DB
heroku addons:create heroku-redis:hobby-dev # for Celery
./scripts/deploy.sh
heroku run python manage.py migrate
```

Once this initial setup is working, you normally deploy by issuing:

```shell
./scripts/deploy.sh
```

And you're running on Heroku! 🚀

## Dokku

Dokku is an alternative to Heroku that you can self-host. We assume that your
Dokku server uses the hostname (and email) _dokku.me_ in the commands bellow –
replace with your actual information.

SSH into your Dokku host and create the app:

```shell
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku plugin:install https://github.com/dokku/dokku-postgres.git
dokku plugin:install https://github.com/dokku/dokku-redis.git
dokku apps:create api
dokku postgres:create apidb
dokku postgres:link apidb api
dokku redis:create apiredis
dokku redis:link apiredis api
dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=youremail@dokku.me
```

Inside your project do:

```shell
git remote add dokku dokku@dokku.me:api
git push dokku master
```

Now a few more commands on the server:

```shell
dokku letsencrypt api
dokku run api python manage.py migrate
```

That's it! Your app should be live on https://api.dokku.me 🚀
