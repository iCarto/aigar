import os

import environ
from corsheaders.defaults import default_headers


env = environ.Env(  # set default values and casting
    DEBUG=(bool, False),
    SECRET_KEY=(str, "h4@c1x9okapu5^#iurp21i(vn14s5c#1lqx!$k-#^v%rd#rn!b"),
    HTTPS=(str, "off"),
)

# Build paths inside the project like this: base('desired/local/path')
# - the path containing manage.py
#   (e.g. ~/code/api)
base = environ.Path(__file__) - 2  # two folders back (/a/b/ - 2 = /)
BASE_DIR = base()
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# - the Django project root containing settings.py
# (e.g. ~/code/api/api)
root = environ.Path(__file__) - 1
PROJECT_ROOT = root()
# PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

environ.Env.read_env(env_file=base(".env"))  # reading .env file

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: set a SECRET_KEY environment variable to a secret value
# before deploying to production!
SECRET_KEY = env("SECRET_KEY")  # default used if not in os.environ

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")  # False if not in os.environ

# Allow all host headers
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

CSRF_COOKIE_SECURE = env("HTTPS") == "on"
SESSION_COOKIE_SECURE = env("HTTPS") == "on"
SESSION_EXPIRE_AT_BROWSER_CLOSE = env("HTTPS") == "on"

# Application definition

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
    "debug_toolbar",
    "django_extensions",
    "back",
    "domains",
]

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


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": base("db.sqlite3")}
}


# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# Media storage backend
MEDIA_ROOT = root("media")
MEDIA_URL = "/media/"

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = "es-SV"
# set your local time zone to more easily analyse data on the backend
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
# CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    # 'example.com', # your domain
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5100",
    "http://127.0.0.1:5100",
)
# CORS_ALLOW_CREDENTIALS = True


CORS_ALLOW_HEADERS = list(default_headers) + ["x-bulk-operation"]
