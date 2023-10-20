import os
from pathlib import Path

import environ
from corsheaders.defaults import default_headers


# Build paths inside the project like:
# * managepy_dir / "subpath" / "subpath"
# * or  Path(managepy_dir, "../subpath"), ...
managepy_dir = Path(__file__, "..", "..").resolve(strict=True)


env = environ.Env(  # set default values and casting
    DEBUG=(bool, True),
    HTTPS=(str, "off"),
    ALLOWED_HOSTS=(list, []),
    SENTRY_DSN=(str, ""),
    DESKTOP=(bool, True),
)
env_file = (managepy_dir / ".env").resolve()
environ.Env.read_env(env_file=env_file)


SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
DESKTOP = env("DESKTOP")

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
    "back.spa.BackSPAMiddleware",
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
        "DIRS": [managepy_dir / "templates"],
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
MEDIA_ROOT = managepy_dir / appname
SQLITE_PATH = str(managepy_dir / appname / "db.sqlite3")


if DESKTOP:
    from platformdirs import PlatformDirs  # noqa: WPS433

    dirs = PlatformDirs(appname=appname, appauthor=False, ensure_exists=True)
    MEDIA_ROOT = dirs.user_documents_dir
    print(MEDIA_ROOT)  # noqa: WPS421
    SQLITE_PATH = os.path.join(dirs.user_documents_dir, "db.sqlite3")


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
STATIC_ROOT = managepy_dir / "static"
STATIC_URL = "/staticfiles/"
# Extra places for collectstatic to find static files.
if not DESKTOP:
    front_build = managepy_dir / ".." / "front" / "build"
    STATICFILES_DIRS = (front_build,)

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
    # ],
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 10,
    # "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
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

if not DEBUG and not DESKTOP:
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "django.server": {
                "()": "django.utils.log.ServerFormatter",
                "format": "[{server_time}] {message}",
                "style": "{",
            }
        },
        "handlers": {
            "console": {"level": "INFO", "class": "logging.StreamHandler"},
            "django.server": {
                "level": "INFO",
                "class": "logging.StreamHandler",
                "formatter": "django.server",
            },
        },
        "loggers": {
            "django": {"handlers": ["console"], "level": "INFO"},
            "django.server": {
                "handlers": ["django.server"],
                "level": "INFO",
                "propagate": False,
            },
        },
    }

if not DEBUG and DESKTOP:
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
                    "%(asctime)s [%(levelname)-8s] "  # noqa: WPS323
                    "(%(module)s.%(funcName)s) %(message)s"  # noqa: WPS32
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",  # noqa: WPS323
            }
        },
    }


SHELL_PLUS_IMPORTS = ["from django.db import models"]
SHELL_PLUS_PRINT_SQL = True
SHELL_PLUS_PRINT_SQL_TRUNCATE = None
