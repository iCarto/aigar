import Button from "@mui/material/Button";
import ListIcon from "@mui/icons-material/List";

const BackToInvoicesButton = ({onClick}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            startIcon={<ListIcon />}
            onClick={onClick}
        >
            Volver al listado de facturas
        </Button>
    );
};

export default BackToInvoicesButton;
