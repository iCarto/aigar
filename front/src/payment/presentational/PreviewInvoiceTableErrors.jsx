import {ErrorMessage} from "base/error/components";
import Typography from "@mui/material/Typography";
import {getTotalErrors, getTotalWarnings} from "payment/model";
import {useEffect} from "react";

export const PreviewInvoiceTableErrors = ({invoices, onValidateStep}) => {
    useEffect(() => {
        // https://stackoverflow.com/questions/62336340/
        if (getTotalErrors(invoices)) {
            onValidateStep(false);
        } else {
            onValidateStep(true);
        }
    }, [invoices]);

    const totalInvoicesWithErrors = getTotalErrors(invoices);
    const totalInvoicesWithWarnings = getTotalWarnings(invoices);

    let errorsMessage = null;
    if (totalInvoicesWithErrors) {
        errorsMessage = (
            <Typography>
                Existen <strong>{totalInvoicesWithErrors}</strong> recibos con errores
                que debe revisar antes de poder continuar.
            </Typography>
        );
    }

    let warningsMessage = null;
    if (totalInvoicesWithWarnings) {
        warningsMessage = (
            <Typography>
                Existen <strong>{totalInvoicesWithWarnings}</strong> recibos con alertas
                que debería revisar.
            </Typography>
        );
    }
    let alertsMessage = null;
    if (errorsMessage || warningsMessage) {
        alertsMessage = (
            <>
                {errorsMessage}
                <br />
                {warningsMessage}
            </>
        );
    }

    return <ErrorMessage message={alertsMessage} />;
};
