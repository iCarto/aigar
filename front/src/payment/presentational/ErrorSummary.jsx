import {ErrorMessage} from "base/error/components";
import Typography from "@mui/material/Typography";

export const ErrorSummary = ({totalErrors, totalPayments}) => {
    if (totalErrors === 0) return null;

    const message = (
        <Typography>
            Existen <strong>{totalErrors}</strong> registros con error de un total de{" "}
            <strong>{totalPayments}</strong> registros leídos.
        </Typography>
    );

    return <ErrorMessage message={message} />;
};
