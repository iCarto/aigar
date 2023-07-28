import {PAGE_MENU_DRAWER_WIDTH} from "base/ui/app/config/measurements";
import {styled} from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import MuiDrawer from "@mui/material/Drawer";

const LeftSideBar = ({children}) => {
    const theme = useTheme();

    const DrawerHeader = styled("div")(({theme}) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const Drawer = styled(MuiDrawer)(() => ({
        width: `${PAGE_MENU_DRAWER_WIDTH}px`,
        flexShrink: 0,
        whiteSpace: "normal",
        boxSizing: "border-box",
    }));

    return (
        <Drawer
            variant="permanent"
            role="left-side-page-menu"
            PaperProps={{
                sx: {
                    zIndex: 0,
                    width: `${PAGE_MENU_DRAWER_WIDTH}px`,
                    borderRight: "3px solid " + theme.palette.text,
                    px: 1,
                },
            }}
        >
            <DrawerHeader />
            {children}
        </Drawer>
    );
};

export default LeftSideBar;
