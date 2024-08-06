# https://github.com/FactoryBoy/factory_boy/issues/468
from typing import Generic, TypeVar, get_args

import factory
from factory.base import FactoryMetaClass


T = TypeVar("T")


class BaseFactoryMeta(FactoryMetaClass):
    def __new__(cls, class_name, bases: list[type], attrs):
        orig_bases = attrs.get("__orig_bases__", [])
        for t in orig_bases:
            if t.__name__ == "BaseFactory" and t.__module__ == __name__:
                type_args = get_args(t)
                if len(type_args) == 1:
                    if "Meta" not in attrs:
                        attrs["Meta"] = type("Meta", (), {})
                    attrs["Meta"].model = type_args[0]
        return super().__new__(cls, class_name, bases, attrs)


class BaseFactory(
    Generic[T], factory.django.DjangoModelFactory, metaclass=BaseFactoryMeta
):
    class Meta:
        abstract = True

    @classmethod
    def create(cls, **kwargs) -> T:
        return super().create(**kwargs)

    @classmethod
    def build(cls, **kwargs) -> T:
        return super().build(**kwargs)
