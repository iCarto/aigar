import os

import environ
from corsheaders.defaults import default_headers


# Build paths inside the project like this: base('desired/local/path')
base = environ.Path(__file__) - 2  # Folder of manage.py

env = environ.Env(  # set default values and casting
    DEBUG=(bool, False),
    HTTPS=(str, "off"),
    ALLOWED_HOSTS=(list, []),
    SENTRY_DSN=(str, ""),
)


# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = base()
root = environ.Path(__file__) - 1  # Folder of this file (settings.py)
# PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = root()


environ.Env.read_env(env_file=base(".env"))  # reading .env file


# SECURITY WARNING: set a SECRET_KEY environment variable to a secret value
# before deploying to production!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

# https://stackoverflow.com/questions/54504142/
# If in DEV is needed to access the app in a defined IP or URL fill .env with:
# ALLOWED_HOSTS=.localhost,127.0.0.1,[::1],THE_IP_OR_URL
ALLOWED_HOSTS = env("ALLOWED_HOSTS")


CSRF_COOKIE_SECURE = env("HTTPS")
SESSION_COOKIE_SECURE = env("HTTPS")
SESSION_EXPIRE_AT_BROWSER_CLOSE = env("HTTPS")


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "django_filters",
    "django_extensions",
    "solo",
    "back",
    "domains",
    "app",
]

if DEBUG:
    INSTALLED_APPS.append("debug_toolbar")


# In Sqitch database control changes mode we have to remove migrations for all used modules to avoid errors
MIGRATION_MODULES = (
    {
        "admin": None,
        "contenttypes": None,
        "auth": None,
        "sessions": None,
        "back": None,
        "domains": None,
        "app": None,
    }
    if env("DATABASE_CONTROL_CHANGES_MODE") == "sqitch"
    else {}
)


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "spa.middleware.SPAMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",  # early, but after Gzip
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "back.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "back.wsgi.application"


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
        )
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


appname = "aigar_data"
MEDIA_URL = "/media/"
MEDIA_ROOT = base(appname)
SQLITE_PATH = base(appname, "db.sqlite3")


if not DEBUG:
    from platformdirs import PlatformDirs  # noqa: WPS433

    dirs = PlatformDirs(appname=appname, appauthor=False, ensure_exists=True)
    MEDIA_ROOT = dirs.user_data_dir
    SQLITE_PATH = os.path.join(dirs.user_data_dir, "db.sqlite3")


DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": SQLITE_PATH}}


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

# Force setting locale for format methods
# locale.setlocale(locale.LC_ALL, "es_ES.utf-8")

LANGUAGE_CODE = "es-SV"
TIME_ZONE = "America/El_Salvador"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = root("staticfiles")
STATIC_URL = "/static/"
# Extra places for collectstatic to find static files.
# STATICFILES_DIRS = (root("static"), root("front_build"), base("app/static"))
STATICFILES_DIRS = (root("front_build"),)

# Django SPA - simple setup for serving modern SPAs from Django
# https://github.com/metakermit/django-spa
STORAGES = {"staticfiles": {"BACKEND": "spa.storage.SPAStaticFilesStorage"}}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Django REST Framework
REST_FRAMEWORK = {
    # "DEFAULT_AUTHENTICATION_CLASSES": (
    #     "rest_framework.authentication.SessionAuthentication",
    #     "rest_framework.authentication.BasicAuthentication",
    #     "rest_framework_simplejwt.authentication.JWTAuthentication",
    # ),
    # "DEFAULT_PERMISSION_CLASSES": [
    #     "rest_framework.permissions.IsAuthenticated",
    #     "rest_framework.permissions.DjangoModelPermissions",
    #     "rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly"
    # ]
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 10,
    # "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
}


# Django debug toolbar
INTERNAL_IPS = ["127.0.0.1"]

# CORS header settings
CORS_ALLOW_ALL_ORIGINS = True
# CORS_ORIGIN_WHITELIST = (
#     # 'example.com', # your domain
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:8000",
#     "http://127.0.0.1:8000",
# )
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + ["Content-Disposition", "Cache-Control"]
CORS_EXPOSE_HEADERS = ["Content-Disposition", "Cache-Control"]


CORS_ALLOW_HEADERS = list(default_headers) + ["x-bulk-operation"]

if not DEBUG:
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "root": {"level": "WARNING", "handlers": ["file"]},
        "handlers": {
            "file": {
                "level": "WARNING",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": os.path.join(MEDIA_ROOT, "aigar.log"),
                "formatter": "app",
                "maxBytes": 1024 * 1024,  # 1 MB
                "backupCount": 5,
            }
        },
        "loggers": {
            "django": {"handlers": ["file"], "level": "WARNING", "propagate": True}
        },
        "formatters": {
            "app": {
                "format": (
                    "%(asctime)s [%(levelname)-8s] "
                    "(%(module)s.%(funcName)s) %(message)s"
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",
            }
        },
    }
