import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECTORES_COMUNIDADES = {
    "1": "TIHUAPA NORTE",
    "2": "TIHUAPA NORTE",
    "3": "TIHUAPA NORTE",
    "4": "TIHUAPA NORTE",
    "5": "TLACUXTLI",
    "6": "TLACUXTLI",
    "7": "TLACUXTLI",
}


def sectores_comunidades(sector):
    return SECTORES_COMUNIDADES.get(str(sector))
