import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

const InvoiceNavigator = ({navigatorIds, currentInvoiceId, path}) => {
    const navigate = useNavigate();

    const currentInvoiceIndex = navigatorIds.indexOf(parseInt(currentInvoiceId));
    const isPreviousButtonDisabled = currentInvoiceIndex === 0;
    const isNextButtonDisabled = currentInvoiceIndex === navigatorIds.length - 1;

    const handleClickPreviousInvoice = () => {
        navigate(`/${path}/${navigatorIds[currentInvoiceIndex - 1]}`);
    };

    const handleClickNextInvoice = () => {
        navigate(`/${path}/${navigatorIds[currentInvoiceIndex + 1]}`);
    };

    return (
        <Box textAlign="center" mb={1}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleClickPreviousInvoice}
                    disabled={isPreviousButtonDisabled}
                >
                    &laquo; Factura anterior
                </Button>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleClickNextInvoice}
                    disabled={isNextButtonDisabled}
                >
                    Siguiente factura &raquo;
                </Button>
            </Box>
            <Divider />
        </Box>
    );
};

export default InvoiceNavigator;
