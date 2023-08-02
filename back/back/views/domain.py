from django.db import models
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from back.models.invoice import InvoiceStatus


class Sectores(models.IntegerChoices):
    UNO = 1, ("TIHUAPA NORTE")
    DOS = 2, ("TIHUAPA NORTE")
    TRES = 3, ("TIHUAPA NORTE")
    CUATRO = 4, ("TIHUAPA NORTE")
    CINCO = 5, ("TLACUXTLI")
    SEIS = 6, ("TLACUXTLI")
    SIETE = 7, ("TLACUXTLI")


class DomainsView(ListAPIView):
    def get(self, request, entity, format=None):
        if entity == "sectores":
            return Response(Sectores.choices)
        if entity == "estados":
            return Response(InvoiceStatus.choices)
