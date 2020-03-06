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
