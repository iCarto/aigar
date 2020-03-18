#!/usr/bin/env python3

import argparse
import json
import logging
import os

from domains import SECTORES_COMUNIDADES
from invoice_spreadsheet import parse_invoice_spreadsheet
from member_spreadsheet import parse_member_spreadsheet


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_django_fixtures(database):
    fixtures = []
    for m in database["members"]:
        fixture_member = {
            "model": "api.Member",
            "pk": int(m["numero_socio"]),
            "fields": {
                "name": m["nombre"],
                "sector": int(m["sector"]),
                "medidor": str(m["medidor"]),
                "solo_mecha": True if m["medidor"] == "M" else False,
                "orden": 0 if m["ruta"] is None else int(m["ruta"]),
                "observaciones": f"{m['observaciones_1'] or ''} {m['observaciones_2'] or ''}".strip(),
                "consumo_maximo": 0,
                "consumo_reduccion_fija": 0,
            },
        }
        fixtures.append(fixture_member)
    i = 10
    for year, year_invoices in database["invoices"].items():
        for month, month_invoices in year_invoices.items():
            for invoice in month_invoices:
                fixture_invoice = {
                    "model": "api.Invoice",
                    "pk": None,
                    "fields": {
                        "anho": int(year),
                        "member": int(invoice["num_socio"]),
                        "nombre": invoice["nombre"],
                        "sector": int(invoice["sector"]),
                        "ahorro": float(invoice.get("ahorro", 0) or 0),
                        "asamblea": float(invoice.get("asamblea", 0) or 0),
                        "caudal_actual": int(invoice.get("caudal_actual", 0) or 0),
                        "caudal_anterior": int(invoice.get("caudal_anterior", 0) or 0),
                        "comision": float(invoice.get("comision", 0) or 0),
                        # "comprobar_pago_11_al_30": float(m["comprobar_pago_11_al_30", 0)),
                        # "comprobar_pago_1_al_11": float(m["comprobar_pago_1_al_11", 0)),
                        "consumo": int(invoice.get("consumo", 0) or 0),
                        "cuota_fija": float(invoice.get("cuota_fija", 0) or 0),
                        "cuota_variable": float(invoice.get("cuota_variable", 0) or 0),
                        "derecho": float(invoice.get("derecho", 0) or 0),
                        "entrega": True if invoice.get("entrega") == "Si" else False,
                        "mes_facturado": int(invoice.get("mes_facturado") or 0),
                        "mes_limite": int(invoice.get("mes_limite") or 0),
                        "mora": float(invoice.get("mora", 0) or 0),
                        "pago_11_al_30": float(invoice.get("pago_11_al_30", 0) or 0),
                        "pago_1_al_11": float(invoice.get("pago_1_al_11", 0) or 0),
                        "reconexion": float(invoice.get("reconexion", 0) or 0),
                        "saldo_anterior": float(invoice.get("saldo_anterior", 0) or 0),
                        "saldo_pendiente": float(
                            invoice.get("saldo_pendiente", 0) or 0
                        ),
                        "total": float(invoice.get("total", 0) or 0),
                        "traspaso": float(invoice.get("traspaso", 0) or 0),
                        "observaciones": invoice.get("observaciones"),
                        # TODO Revisar como establecer un valor para el estado
                        "estado": "nueva",
                    },
                }
                fixtures.append(fixture_invoice)
                i += 1
    print(json.dumps(fixtures))


def create_database(fileindex, pretty_print, hack):
    dispatch = {
        "invoices": parse_invoice_spreadsheet,
        "members": parse_member_spreadsheet,
    }

    basefolder = os.path.dirname(fileindex)

    database = {
        "members": None,
        "invoices": {},
        "domains": {"sectores_comunidades": SECTORES_COMUNIDADES},
    }

    with open(fileindex) as f:
        for line in f:
            filetype, year, month, filepath = line.strip().split(sep=";")

            df = dispatch[filetype](os.path.join(basefolder, filepath))
            if filetype == "members" and hack:
                df.dropna(subset=["sector", "numero_socio", "nombre"], inplace=True)
            str_json = df.to_json(
                None, orient="records", lines=False, indent=2, index=True
            )
            dict_json = json.loads(str_json)
            if filetype == "members":
                database[filetype] = dict_json
            else:
                if year not in database[filetype]:
                    database[filetype][year] = {}
                if month not in database[filetype][year]:
                    database[filetype][year][month] = dict_json

    database_file_path = os.path.join(basefolder, "database.json")
    json_options = {}
    if pretty_print:
        json_options = {"indent": 2, "sort_keys": True}
    with open(database_file_path, "w") as f:
        json.dump(database, f, **json_options)
    logger.info(f"Created: {database_file_path}")
    logger.warning("No se está limpiando la BD. Puede haber elementos nulos")
    return database


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Has hardcoded paths to a couple of spreadsheet that allows to create a mock database"
    )

    parser.add_argument(
        "fileindex",
        help="Path to a file that lists the spreadsheets need to generate the database",
    )

    parser.add_argument(
        "--pretty-print", action="store_true", help="The json is pretty printed"
    )

    parser.add_argument(
        "--hack",
        action="store_true",
        help="Drops members data with NA in sector, nombre or numero_socio",
    )
    args = parser.parse_args()

    db = create_database(args.fileindex, args.pretty_print, args.hack)
    create_django_fixtures(db)
