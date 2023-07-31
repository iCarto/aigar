"""StrictCharField is a customized version of CharField.

Applies philosophy "Parse don't validate" to enforce some rules:

* `empty_strings_allowed = False` so it does not convert `None` to `''` by default
* Remove leading and trailing whitespaces
* Replace newline, tab and multiple consecutive spaces with a single space
* Remove unicode control characters
* Apply the str.<self.apply> method to the input
* `max_lenght` by default is `256`
* `min_length` by default is `2`

Example:
    name = StrictCharField(
        null=False,
        blank=False,
        apply='capitalize',
        min_length=3,
    )

Notes:
    * Revisar implementación. Se están sobreescribiendo muchos métodos pero la doc no es
      clara, y el código fuente de Django tampoco.
    * Revisar naming. ¿NormalizedCharField?, ¿EnforzedCharField?
"""


import unicodedata

from django.core import validators
from django.db import models


class StrictCharField(models.CharField):
    description = "CharField with enforzed constraints"
    empty_strings_allowed = False

    def __init__(self, apply: str = "", min_length: int = 2, *args, **kwargs):
        """StringCharField.

        Args:
            apply (str): aplies to the value the str method passed as a string
            min_length (int): default 2. Use 0 to disable MinLengthValidator
            args: positional arguments
            kwargs: named arguments
        """
        self.apply = apply
        kwargs.setdefault("max_length", 255)
        super().__init__(*args, **kwargs)
        self.min_length = min_length
        if self.min_length:
            self.validators.append(validators.MinLengthValidator(self.min_length))

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        # We do not exclude max_length if it matches default as we want to change
        # the default in future.
        if self.apply:
            kwargs["apply"] = self.apply
        if self.min_length != 2:
            kwargs["min_length"] = self.min_length
        return name, path, args, kwargs

    # def formfield(self, **kwargs):
    #     # As with CharField, this will cause email validation to be performed
    #     # twice.
    #     return super().formfield(**{"form_class": forms.EmailField, **kwargs})

    def to_python(self, value):
        return self._normalize(super().to_python(value))

    def pre_save(self, model_instance, add):
        value = self._normalize(super().pre_save(model_instance, add))
        setattr(model_instance, self.attname, value)
        return self.clean(value, model_instance)

    def get_prep_value(self, value):
        return self._normalize(super().get_prep_value(value))

    def get_db_prep_value(self, value, connection, prepared=False):
        return self._normalize(super().get_db_prep_value(value, connection, prepared))

    def _normalize(self, value: str | None) -> str | None:
        """Normalizes a string.

        * Removes leading and trailing whitespaces
        * Replaces newline, tab and multiple consecutive spaces with a single space
        * Removes unicode control characters
        * Applies the str.<self.apply> method.

        Args:
            value (str | None): the string to be normalized

        Returns:
            str | None: empty string or None if this is de input. Or the normalized string.
        """
        if not value:
            return value

        # https://stackoverflow.com/a/10711166/930271
        remove_invalid_whitespaces = " ".join(value.split())
        # https://stackoverflow.com/questions/4324790/
        stripped_control_chars = "".join(
            ch
            for ch in remove_invalid_whitespaces
            if unicodedata.category(ch)[0] != "C"
        )
        fn = getattr(str, self.apply, noop)
        return fn(stripped_control_chars)


def noop(*args, **kwds):
    return args[0] if args else None
