from django.contrib import admin

from back.models.member import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    search_help_text = "Busqueda por nombre"
    list_display = (
        "num_socio",
        "name",
        "orden",
        "is_active",
        "sector",
        "created_at",
        "updated_at",
    )
    list_filter = ("sector", "is_active", "created_at", "updated_at")
    ordering = ("name",)
