import {LEFT_SIDEBAR_WIDTH} from "base/ui/app/config/measurements";
import {LeftSideBar} from "../sidebar";
import Grid from "@mui/material/Grid";

const PageLayout = ({sidebar = null, children}) => {
    return (
        <>
            {sidebar ? <LeftSideBar>{sidebar}</LeftSideBar> : null}
            <Grid
                role="container"
                container
                flexDirection="column"
                rowSpacing={1}
                px={sidebar ? 2 : 3}
                ml={sidebar ? `${LEFT_SIDEBAR_WIDTH}px` : null}
                // mb={3}
            >
                {children}
            </Grid>
        </>
    );
};

export default PageLayout;
