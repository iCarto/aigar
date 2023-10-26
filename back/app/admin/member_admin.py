from typing import Any

from django.contrib import admin

from app.models.member import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    search_help_text = "Busqueda por nombre"
    list_display = (
        "id",
        "name",
        "orden",
        "status",
        "sector",
        "created_at",
        "updated_at",
    )
    list_select_related = True
    list_filter = ("sector", "status", "created_at", "updated_at")
    ordering = ("name",)

    def save_model(self, request: Any, obj: Any, form: Any, change: Any) -> None:
        super().save_model(request, obj, form, change)
        obj.forthcominginvoiceitem_set.delete()
