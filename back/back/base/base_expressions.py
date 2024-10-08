from django.db import models
from typing_extensions import override


class GroupConcat(models.Aggregate):
    function = "GROUP_CONCAT"
    template = "%(function)s(%(distinct)s%(expressions)s)"

    @override
    def __init__(self, expression, distinct=False, **extra):
        super().__init__(
            expression,
            distinct="DISTINCT " if distinct else "",
            output_field=models.CharField(),
            **extra,
        )


class JsonGroupArray(models.Aggregate):
    function = "JSON_GROUP_ARRAY"
    output_field = models.JSONField()
    template = "%(function)s(%(distinct)s%(expressions)s)"
