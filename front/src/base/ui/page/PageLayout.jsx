import {HEADER_HEIGHT} from "base/ui/app/config/measurements";
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
                mt={`${HEADER_HEIGHT}px`}
                px={sidebar ? 1 : 2}
                pt={1}
            >
                {children}
            </Grid>
        </>
    );
};

export default PageLayout;
