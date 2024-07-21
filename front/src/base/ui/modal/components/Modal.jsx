import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Modal = ({isOpen, onClose, header = null, body, footer = null}) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{header}</DialogTitle>
            <DialogContent>{body}</DialogContent>
            <DialogActions>{footer}</DialogActions>
        </Dialog>
    );
};

export default Modal;
