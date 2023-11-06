from typing import Any

from django.contrib import admin

from app.models.invoicing_month import InvoicingMonth


@admin.register(InvoicingMonth)
class InvoicingMonthAdmin(admin.ModelAdmin):
    list_display = ("id_mes_facturacion", "anho", "mes", "is_open")
    list_filter = ("anho", "mes")
    list_max_show_all = 10
    ordering = ("-id_mes_facturacion",)

    def save_model(self, request: Any, obj: Any, form: Any, change: Any) -> None:
        super().save_model(request, obj, form, change)
        InvoicingMonth.objects.create_new_invoices(obj)
