#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys


ERROR_MSG = (
    "Couldn't import Django. Are you sure it's installed and "
    "available on your PYTHONPATH environment variable? Did you "
    "forget to activate a virtual environment?"
)


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(ERROR_MSG) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
