import {Fragment} from "react";
import {alpha} from "@mui/material/styles";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

const TableToolbar = ({selectedRows, tableActions = []}) => {
    const selectedMessage =
        selectedRows?.length === 1
            ? `${selectedRows.length} elemento seleccionado`
            : `${selectedRows.length} elementos seleccionados`;

    return selectedRows?.length > 0 ? (
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
                <List dense disablePadding sx={{display: "flex"}}>
                    {tableActions.map((action, index) => (
                        <Fragment key={index}>{action}</Fragment>
                    ))}
                </List>
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
