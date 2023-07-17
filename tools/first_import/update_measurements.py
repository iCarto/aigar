import json
from random import randrange


with open("lecturas.json") as f:
    data = json.load(f)

updated_measurements = []
for measurement in data:
    measurement["lectura"] = (
        measurement["lectura_anterior"] + randrange(40)
        if measurement["cuota_fija"] != 2.72
        else measurement["lectura_anterior"]
    )
    updated_measurements.append(measurement)

with open("/home/elias/Proyectos/aecid/test/lecturas_updated.json", "w") as json_file:
    json.dump(updated_measurements, json_file)
