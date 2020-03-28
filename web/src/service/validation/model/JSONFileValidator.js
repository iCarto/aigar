import Validator from "./Validator";

class JSONFileValidator extends Validator {
    extension(file) {
        if (file.type !== "text/plain" && file.type !== "application/json") {
            return "El fichero no es de tipo texto JSON";
        }
    }
}

export default JSONFileValidator;
