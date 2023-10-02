from typing import Any

from django import forms
from django.contrib import admin
from django.db.models.query import QuerySet
from django.http.request import HttpRequest
from django.utils.html import format_html_join

from domains.models import Locality, Zone
from domains.models.basic_config import BasicConfig


class ZoneInline(admin.TabularInline):
    model = Zone
    extra = 0
    # https://stackoverflow.com/questions/41376406/remove-title-from-tabularinline-in-admin
    classes = ("hide-title",)

    fields = ("name", "reading_day")
    readonly_fields = ("name",)

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return True

    def has_delete_permission(self, request, obj):
        return False


class LocalityAddForm(forms.ModelForm):
    class Meta(object):
        model = Locality
        fields = "__all__"


class LocalityChangeForm(forms.ModelForm):
    class Meta(object):
        model = Locality
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_tmp in self.fields.values():
            field: forms.Field = field_tmp  # type: ignore
            field.widget.attrs["style"] = "border:none;"
            field.help_text = ""
            field.disabled = True
            field.required = False


@admin.register(Locality)
class LocalityAdmin(admin.ModelAdmin):
    list_display = ("name", "short_name", "get_zones")
    ordering = ("short_name",)

    def add_view(self, request, form_url="", extra_context=None):
        self.form = LocalityAddForm
        self.inlines = []
        return super().add_view(request, form_url, extra_context)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        self.form = LocalityChangeForm
        self.inlines = [ZoneInline]
        return super().change_view(request, object_id, form_url, extra_context)

    def save_related(self, request: Any, form: Any, formsets: Any, change: Any) -> None:
        super().save_related(request, form, formsets, change)
        if not change:
            Locality.objects.create_with_zones(form.instance)

    def delete_model(self, request: HttpRequest, obj: Any) -> None:
        super().delete_model(request, obj)
        Locality.objects.create_with_zones()

    def delete_queryset(self, request: HttpRequest, queryset: QuerySet[Any]) -> None:
        super().delete_queryset(request, queryset)
        Locality.objects.create_with_zones()

    @admin.display(description="sectores")
    def get_zones(self, obj):
        zone_names = obj.zone_set.values_list("name", flat=True)
        return format_html_join("", "{0}<br>", ((name,) for name in zone_names))


@admin.register(BasicConfig)
class BasicConfigAdmin(admin.ModelAdmin):
    list_display = ("name", "payments_csv")

    def has_add_permission(self, request, obj=None):
        return not BasicConfig.objects.count()

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return False
