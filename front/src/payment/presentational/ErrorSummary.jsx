import {ErrorMessage} from "base/error/components";
import Typography from "@mui/material/Typography";

export const ErrorSummary = ({totalErrors, totalPayments, message = null}) => {
    if (totalErrors === 0) return null;

    if (!message) {
        message = (
            <Typography>
                Existen <strong>{totalErrors}</strong> registros con error de un total
                de <strong>{totalPayments}</strong> registros leídos.
            </Typography>
        );
    }

    return <ErrorMessage message={message} />;
};
