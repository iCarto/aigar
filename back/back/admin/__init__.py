from django.conf.locale.es import formats as es_formats
from django.contrib import admin


# from app.admin.project_admin import ProjectAdmin


es_formats.DATETIME_FORMAT = "d/m/Y H:i:s"

admin.site.site_header = "Configuración de AIGAR"
admin.site.site_title = "Configuración de AIGAR"
admin.site.index_title = "Panel de configuración de AIGAR"
