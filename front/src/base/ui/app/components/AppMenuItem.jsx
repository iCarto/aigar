import {useNavigate} from "react-router-dom";

import {CUSTOM_FONT_FAMILY} from "Theme";
import {usePathMatch} from "base/navigation/hooks";

import MenuItem from "@mui/material/MenuItem";
import useTheme from "@mui/material/styles/useTheme";

const AppMenuItem = ({
    to,
    icon = null,
    text = "",
    textStyle = {},
    tooltipTitle = "",
    resolvedPathName = null,
    resolvedSecondPathName = null,
    ...props
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const isItemSelected = usePathMatch(to, resolvedPathName, resolvedSecondPathName);

    const defaultItemStyle = {
        color: theme.palette.grey[400],
        fontFamily: CUSTOM_FONT_FAMILY,
        ...textStyle,
    };

    const selectedItemtStyle = {
        ...defaultItemStyle,
        "&.Mui-selected": {
            backgroundColor: "transparent",
            color: "white",
            fontWeight: 600,
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
    };

    return (
        <MenuItem
            role="tab"
            tabIndex={0}
            aria-selected="true"
            onClick={() => {
                navigate(to);
            }}
            selected={isItemSelected}
            sx={isItemSelected ? selectedItemtStyle : defaultItemStyle}
        >
            {text}
        </MenuItem>
    );
};

export default AppMenuItem;
