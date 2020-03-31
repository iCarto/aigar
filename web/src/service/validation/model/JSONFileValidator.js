import Validator from "./Validator";

class JSONFileValidator extends Validator {
    extension(file) {
        if (file.type !== "text/plain" && file.type !== "application/json") {
            return "El fichero no es de tipo texto JSON";
        }
    }

    isJSON(content) {
        try {
            JSON.parse(content);
        } catch (e) {
            console.log(e);
            return "El archivo no tiene un formato correcto.";
        }
    }

    mandatoryFields(mandatoryFields, content) {
        try {
            const jsonElements = JSON.parse(content);
            for (let i = 0; i < jsonElements.length; i++) {
                const jsonElement = jsonElements[i];
                for (let j = 0; j < mandatoryFields.length; j++) {
                    const field = mandatoryFields[j];
                    if (
                        typeof jsonElement[field] === "undefined" ||
                        jsonElement[field] == null
                    ) {
                        return (
                            "El campo '" +
                            field +
                            "' es obligatorio en todas las entradas."
                        );
                    }
                }
            }
        } catch (e) {}
    }
}

export default JSONFileValidator;
