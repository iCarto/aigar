import functools
import itertools

from django.db.models import signals
from django.dispatch import receiver

from domains.exceptions import ConfigError
from domains.models.locality import Locality
from domains.models.zone import Zone


class CreateZones(object):
    def __init__(self):
        self.all_locs = Locality.objects.all()

    @property
    def localities_with_sectors(self) -> int:
        return sum(loc.number_of_sectors > 0 for loc in self.all_locs)

    @property
    def localities_without_sectors(self) -> int:
        return sum(loc.number_of_sectors == 0 for loc in self.all_locs)

    @property
    def all_zones(self) -> list[Locality]:
        return functools.reduce(
            lambda acc, l: list(
                itertools.chain(acc, [l] * l.number_of_sectors)  # noqa: WPS435
            ),
            self.all_locs,
            [],
        )

    def exec(self):
        Zone.objects.all().delete()

        if self.localities_with_sectors and self.localities_without_sectors:
            raise ConfigError(
                "No puede haber comunidades con 0 sectores y otras con más de 0 a la vez"
            )

        if self.localities_without_sectors:
            for loc in self.all_locs:
                Zone.objects.create(locality=loc, code=None)

        if self.localities_with_sectors:
            for index, zone in enumerate(self.all_zones):
                Zone.objects.create(locality=zone, code=str(index + 1))


@receiver(signals.post_save, sender=Locality, weak=False)
def create_zones_callback(**kwargs):
    CreateZones().exec()
