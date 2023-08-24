import {alpha} from "@mui/material/styles";

import {ActionsBurgerMenu} from "base/ui/menu/components";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const TableToolbar = ({totalSelected, tableActions = []}) => {
    const selectedMessage =
        totalSelected === 1
            ? `${totalSelected} elemento seleccionado`
            : `${totalSelected} elementos seleccionados`;

    return totalSelected > 0 ? (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                py: 0,
                minHeight: {xs: "52px", xl: "64px"},
                ...{
                    bgcolor: theme =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                },
            }}
        >
            <Typography
                sx={{flex: "1 1 100%"}}
                color="inherit"
                variant="body1"
                fontWeight={600}
            >
                {selectedMessage}
            </Typography>

            {tableActions.length > 0 ? (
                <ActionsBurgerMenu>{tableActions}</ActionsBurgerMenu>
            ) : null}
        </Toolbar>
    ) : null;
};

export default TableToolbar;
