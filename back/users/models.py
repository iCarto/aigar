from django.contrib.auth.models import AbstractUser
from django.db import models

import users.constants as c


class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        ordering = ("username",)

    email = models.EmailField("email address", unique=True)
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def in_admin_group(self):
        return self.groups.filter(name=c.GROUP_ADMIN).exists()

    def is_member(self, group):
        return self.groups.filter(name=group).exists()
