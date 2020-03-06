from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField("email address", unique=True)
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []
