#!/usr/bin/env python3

import argparse
import logging
import os

import pandas as pd


# https://stackoverflow.com/questions/11548674
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
# logging.getLogger().setLevel(logging.DEBUG)


def parse_member_spreadsheet(spreadsheet):
    excel_options = {
        "header": None,
        "names": [
            "sector",
            "numero_socio",
            "nombre",
            "medidor",
            "ruta",
            "observaciones_1",
            "observaciones_2",
        ],
        "usecols": "A:G",
        "skiprows": range(0, 5),
        "converters": {"numero_socio": lambda x: str(x).zfill(4)},
        # "dtype": {"ruta": int},
    }

    df = pd.read_excel(spreadsheet, **excel_options)
    return df


def member_spreadsheet_to_json(xls):
    df = parse_member_spreadsheet(xls)
    json_file = "/tmp/" + os.path.basename(xls) + ".json"
    df.to_json(json_file, orient="records", lines=False, indent=2, index=True)
    logger.info(f"Created: {json_file}")
    logger.debug("\n" + str(df))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Process the spreadsheet file with the basic info about the members"
    )

    parser.add_argument("spreadsheet", help="Path to the spreadsheet")
    args = parser.parse_args()
    member_spreadsheet_to_json(args.spreadsheet)
