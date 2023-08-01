from django.contrib import admin
from django.utils.html import format_html_join

from domains.models import Locality, Zone


class ZoneInline(admin.TabularInline):
    model = Zone
    extra = 0

    show_change_link = False
    fields = ("name",)
    template = "admin/domains/edit_inline/tabular.html"

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(Locality)
class LocalityAdmin(admin.ModelAdmin):
    inlines = [ZoneInline]
    list_display = ("name", "short_name", "get_zones")
    ordering = ("short_name",)

    @admin.display(description="sectores")
    def get_zones(self, obj):
        zone_names = obj.zone_set.values_list("name", flat=True)
        return format_html_join("", "{0}<br>", ((name,) for name in zone_names))
