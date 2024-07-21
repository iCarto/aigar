import {Outlet} from "react-router-dom";
import Box from "@mui/material/Box";

const ModuleLayout = ({menu = null}) => {
    return (
        <Box sx={{display: "flex"}} component="main" role="main">
            {menu}
            <Outlet />
        </Box>
    );
};

export default ModuleLayout;
