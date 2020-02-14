#!/usr/bin/env python3

import argparse
import logging
import os

import pandas as pd
from domains import sectores_comunidades


# https://stackoverflow.com/questions/11548674
# logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

# pd.set_option('display.max_rows', None)
# pd.set_option("display.max_columns", None)
# pd.set_option('display.width', None)
# pd.set_option('display.max_colwidth', -1)
# pd.set_option('display.expand_frame_repr', False)
# pd.set_option('display.width', pd.util.terminal.get_terminal_size()[0])
# with pd.option_context('display.max_rows', -1, 'display.max_columns', 5):
#     print df


def parse_invoice_spreadsheet(xls):
    excel_options = {"dtype": {"NúmeroSocio": object}}
    column_names = {
        "NúmeroS": "sector",
        "NúmeroSocio": "numero_socio",
        "Nombre": "nombre",
        "Canterior": "caudal_anterior",
        "Cactual": "caudal_actual",
        "Consumo": "consumo",
        "Cuota fija": "cuota_fija",
        "Cuotavar": "cuota_variable",
        "Comision": "comision",
        "Ahorro": "ahorro",
        "Mora": "mora",  # =IF(Y2=0,1,0)
        "Derecho": "derecho",
        "Reconexion": "reconexion",
        "Asamblea": "asamblea",
        "TraspasoD": "traspaso",
        "SaldoP": "saldo_pendiente",
        "Saldoanterior": "saldo_anterior",
        "Total": "total",
        "Unnamed: 14": "observaciones",
        "Comentarios": "observaciones",
        "Comunidad": "comunidad",
        "MesFact": "mes_facturado",
        "MesLimite": "mes_limite",
        "ENTREGA": "entrega",
        "Pago1al11": "pago_1_al_11",  # =VLOOKUP($Todos.G2,$del1_10.$A$2:$D$300,3,FALSE())
        "Comprobar": "comprobar_pago_1_al_11",  # =VLOOKUP($Todos.G2,$del1_10.$A$2:$D$300,3,FALSE())
        "Pago11al30": "pago_11_al_30",  # =VLOOKUP($Todos.G2,$del1_10.$A$2:$D$300,3,FALSE())
        "Comprobar.1": "comprobar_pago_11_al_30",  # saldo_pendiente - pago_11_al_30
    }
    df = pd.read_excel(xls, **excel_options)
    df.rename(columns=column_names, inplace=True)
    drop_columns = ["MesFact.1", "NúmeroS_num", "Unnamed: 25", "Unnamed: 27"]
    for d in drop_columns:
        if d in df.columns:
            df.drop(columns=d, inplace=True)

    if "comunidad" not in df.columns:
        df["comunidad"] = df["sector"].apply(sectores_comunidades)

    if "mes_facturado" not in df.columns:
        df["mes_facturado"] = 9
        df["mes_limite"] = 10

    return df


def invoice_spreadsheet_to_json(xls):
    df = parse_invoice_spreadsheet(xls)
    json_file = "/tmp/" + os.path.basename(xls) + ".json"
    df.to_json(json_file, orient="records", lines=False, indent=2, index=True)
    logger.info(f"Created: {json_file}")
    logger.debug("\n" + str(df))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Process the spreadsheet file with monthly invoice and payments data"
    )

    parser.add_argument("spreadsheet", help="Path to the spreadsheet")
    args = parser.parse_args()
    invoice_spreadsheet_to_json(args.spreadsheet)
