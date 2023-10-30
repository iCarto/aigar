import {useEffect, useState} from "react";

import {Spinner} from "base/ui/other/components";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useNavigateWithReload} from "base/navigation/hooks";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {ErrorMessage} from "base/error/components";
import {BackToInvoicesButton} from "monthlyinvoicing/presentational";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

// TO-DO: This component & LoadMeasurementsStep4Result can be abstracted into one common component --only the service is different
const LoadPaymentsStep4Result = ({invoicingMonthId, payments}) => {
    const [result, setResult] = useState(null);
    const {setIsDataUpdated} = useMonthlyInvoicingList();

    const navigate = useNavigateWithReload();

    const handleClickBack = () => {
        setIsDataUpdated(prevState => !prevState);
        navigate("/", true);
    };

    useEffect(() => {
        InvoicingMonthService.savePayments(invoicingMonthId, payments)
            .then(() => {
                setResult(true);
            })
            .catch(error => {
                console.log(error);
                setResult(false);
            });
    }, [invoicingMonthId, payments]);

    const SuccessMessage = () => {
        return (
            <Stack>
                <Alert severity="success" sx={{mb: 1}}>
                    Las facturas se han actualizado correctamente.
                </Alert>
                <BackToInvoicesButton onClick={handleClickBack} />
            </Stack>
        );
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems="center"
        >
            {result !== null ? (
                result ? (
                    <SuccessMessage />
                ) : (
                    <ErrorMessage message="Se ha producido un error durante la actualización de las facturas y no se han podido guardar los datos." />
                )
            ) : (
                <Spinner message="Actualizando facturas" />
            )}
        </Box>
    );
};

export default LoadPaymentsStep4Result;
