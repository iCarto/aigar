import {useState} from "react";
import {useLocation} from "react-router-dom";

import {useNavigateWithReload} from "base/navigation/hooks";

import {MenuAction} from "base/ui/menu/components";
import {AlertError} from "base/error/components";

import DeleteIcon from "@mui/icons-material/Delete";

export function useMenuGenericDeleteAction(service) {
    const navigate = useNavigateWithReload();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [error, setError] = useState("");
    const location = useLocation();

    const handleClickDelete = element => {
        setItemToDelete(element);
        setIsDeleteDialogOpen(true);
    };

    const action = (
        <MenuAction
            key="table-delete-action"
            icon={<DeleteIcon color="error" />}
            text="Eliminar"
            handleClick={handleClickDelete}
        />
    );

    return {action, handleClickDelete};
}
