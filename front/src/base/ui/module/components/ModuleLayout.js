import {Outlet} from "react-router-dom";
import {DrawerHeader} from "./ModuleMenu";
import Box from "@mui/material/Box";

const ModuleLayout = ({menu = null}) => {
    return (
        // <Box sx={{display: "flex"}} role="main">
        //     {menu}
        //     <Box sx={{flexGrow: 1}} role="module">
        //         <DrawerHeader role="drawer-header" />
        //         <Outlet />
        //     </Box>
        // </Box>
        <main className="h-100" role="main">
            <div className="row no-gutters h-100">
                {menu}
                <Outlet />
            </div>
        </main>
    );
};

export default ModuleLayout;
