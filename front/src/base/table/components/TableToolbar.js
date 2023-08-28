import {alpha} from "@mui/material/styles";

import {ActionsBurgerMenu} from "base/ui/menu/components";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const TableToolbar = ({totalSelected, tableActions = []}) => {
    const selectedMessage =
        totalSelected === 1
            ? `${totalSelected} elemento seleccionado`
            : `${totalSelected} elementos seleccionados`;

    return totalSelected > 0 ? (
        <Toolbar
            sx={{
                pl: {sm: 1},
                pr: {xs: 1, sm: 2},
                py: 0,
                minHeight: {xs: "52px", xl: "64px"},
                justifyItems: "space-between",
                ...{
                    bgcolor: theme =>
                        alpha(
                            theme.palette.grey["500"],
                            theme.palette.action.activatedOpacity
                        ),
                },
            }}
        >
            {tableActions.length > 0 ? (
                <Stack>
                    <ActionsBurgerMenu>{tableActions}</ActionsBurgerMenu>
                </Stack>
            ) : null}

            <Typography
                sx={{flex: "1 1 100%", textAlign: "right"}}
                color="inherit"
                variant="body1"
                fontWeight={600}
            >
                {selectedMessage}
            </Typography>
        </Toolbar>
    ) : null;
};

export default TableToolbar;
