from typing import Any

from django import forms
from django.contrib import admin
from django.db.models.query import QuerySet
from django.http.request import HttpRequest
from django.utils.html import format_html_join
from solo.admin import SingletonModelAdmin

from domains.models import Locality, Zone
from domains.models.aigar_config import AigarConfig


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
    class Meta:
        model = Locality
        fields = "__all__"


class LocalityChangeForm(forms.ModelForm):
    class Meta:
        model = Locality
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_tmp in self.fields.values():
            field: forms.Field = field_tmp
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


@admin.register(AigarConfig)
class AigarConfigAdmin(SingletonModelAdmin):
    fieldsets = (
        (None, {"fields": ["name"]}),
        (
            "Pagos",
            {
                "classes": ["collapse"],
                "fields": ["payment_due_day", "payment_method", "payment_csv"],
            },
        ),
        (
            "Cuota Fija",
            {
                "classes": ["collapse", "wide"],
                "fields": [
                    "humano_cuota_fija",
                    "comercial_cuota_fija",
                    "comision",
                    "ahorro",
                ],
            },
        ),
        (
            "Recibos - Conceptos Generales",
            {
                "classes": ["collapse"],
                "fields": [
                    # "comision",
                    "recargo_mora",
                    "asamblea",
                    "jornada_trabajo",
                    "reconexion",
                    # "ahorro",
                    "traspaso_derecho",
                ],
            },
        ),
        (
            "Nuevo derecho",
            {
                "classes": ["collapse", "wide"],
                "fields": [
                    (
                        "humano_nuevo_derecho_total",
                        "humano_nuevo_derecho_primera_cuota",
                    ),
                    (
                        "comercial_nuevo_derecho_total",
                        "comercial_nuevo_derecho_primera_cuota",
                    ),
                    (
                        "nuevo_derecho_siguientes_cuotas_opcion1",
                        "nuevo_derecho_siguientes_cuotas_opcion2",
                        "nuevo_derecho_siguientes_cuotas_opcion3",
                        "nuevo_derecho_siguientes_cuotas_opcion4",
                        "nuevo_derecho_siguientes_cuotas_opcion5",
                        "nuevo_derecho_siguientes_cuotas_opcion6",
                    ),
                ],
            },
        ),
        (
            "Consumo Humano - Cuota Variable",
            {
                "classes": ["collapse", "wide"],
                "fields": [
                    (
                        "humano_cuota_variable_primer_tramo_cantidad",
                        "humano_cuota_variable_primer_tramo_coste",
                    ),
                    (
                        "humano_cuota_variable_segundo_tramo_cantidad",
                        "humano_cuota_variable_segundo_tramo_coste",
                    ),
                    (
                        "humano_cuota_variable_tercer_tramo_cantidad",
                        "humano_cuota_variable_tercer_tramo_coste",
                    ),
                    (
                        "humano_cuota_variable_cuarto_tramo_cantidad",
                        "humano_cuota_variable_cuarto_tramo_coste",
                    ),
                    (
                        "humano_cuota_variable_quinto_tramo_cantidad",
                        "humano_cuota_variable_quinto_tramo_coste",
                    ),
                    (
                        "humano_cuota_variable_sexto_tramo_cantidad",
                        "humano_cuota_variable_sexto_tramo_coste",
                    ),
                ],
            },
        ),
        (
            "Consumo Comercial - Cuota Variable",
            {
                "classes": ["collapse", "wide"],
                "fields": [
                    (
                        "comercial_cuota_variable_primer_tramo_cantidad",
                        "comercial_cuota_variable_primer_tramo_coste",
                    ),
                    (
                        "comercial_cuota_variable_segundo_tramo_cantidad",
                        "comercial_cuota_variable_segundo_tramo_coste",
                    ),
                    (
                        "comercial_cuota_variable_tercer_tramo_cantidad",
                        "comercial_cuota_variable_tercer_tramo_coste",
                    ),
                    (
                        "comercial_cuota_variable_cuarto_tramo_cantidad",
                        "comercial_cuota_variable_cuarto_tramo_coste",
                    ),
                    (
                        "comercial_cuota_variable_quinto_tramo_cantidad",
                        "comercial_cuota_variable_quinto_tramo_coste",
                    ),
                    (
                        "comercial_cuota_variable_sexto_tramo_cantidad",
                        "comercial_cuota_variable_sexto_tramo_coste",
                    ),
                ],
            },
        ),
    )
