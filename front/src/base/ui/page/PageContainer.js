import {LEFT_SIDEBAR_WIDTH} from "base/ui/app/config/measurements";
import Grid from "@mui/material/Grid";

const PageContainer = ({isSubpage = false, children}) => {
    return (
        <Grid
            role="container"
            container
            flexDirection="column"
            rowSpacing={2}
            px={isSubpage ? 2 : 3}
            ml={isSubpage ? `${LEFT_SIDEBAR_WIDTH}px` : null}
        >
            {children}
        </Grid>
    );
};

export default PageContainer;
