import Validator from "./Validator";

class CSVFileValidator extends Validator {
    extension(file) {
        if (file.type !== "text/plain" && file.type !== "text/csv") {
            return "El fichero no es de tipo texto plano (TXT o CSV)";
        }
        if (!file.name.endsWith("txt") && !file.name.endsWith("csv")) {
            return "La extensión del fichero no es correcta (TXT o CSV)";
        }
    }

    filename(file) {
        if (!file.name.startsWith("ASCATLI")) {
            return "El nombre del fichero no comienza por ASCATLI";
        }
        var twoDatesFormatRegExp = new RegExp("\\d{6}.+\\d{6}");
        if (!twoDatesFormatRegExp.test(file.name)) {
            return "El nombre del fichero no contiene fechas válidas";
        }
    }

    columns(possibleNumberOfColumns, content) {
        let lines = content.split(/\r\n|\r|\n/g);
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
                let paymentRead = lines[i].trim().split(";");
                if (!possibleNumberOfColumns.includes(paymentRead.length)) {
                    return (
                        "Alguna de las entradas del fichero no tiene las columnas necesarias [" +
                        possibleNumberOfColumns.join(",") +
                        "]"
                    );
                }
            }
        }
    }
}

export default CSVFileValidator;
