import {DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Dialog from "@mui/material/Dialog";

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
