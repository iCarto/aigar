import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

const InvoiceNavigator = ({navigatorIds, path}) => {
    const navigate = useNavigate();
    const {idFactura} = useParams();

    const currentInvoiceIndex = navigatorIds.indexOf(parseInt(idFactura));
    const isPreviousButtonDisabled =
        !navigatorIds.length || currentInvoiceIndex === 0 || currentInvoiceIndex === -1;
    const isNextButtonDisabled =
        !navigatorIds.length || currentInvoiceIndex === navigatorIds.length - 1;

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
                    &laquo; Recibo anterior
                </Button>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleClickNextInvoice}
                    disabled={isNextButtonDisabled}
                >
                    Siguiente recibo &raquo;
                </Button>
            </Box>
            <Divider />
        </Box>
    );
};

export default InvoiceNavigator;
