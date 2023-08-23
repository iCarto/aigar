import {HashLink} from "react-router-hash-link";

import useTheme from "@mui/material/styles/useTheme";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const LinkCellTable = ({text, to}) => {
    const theme = useTheme();
    const textLinkStyle = {
        display: "inline-block",
        whiteSpace: "nowrap",
        fontWeight: "600",
        fontSize: "inherit",
        // textDecoration: "underline",
        // textDecorationColor: "rgba(0, 123, 196, 0.4)",
        color: "inherit",
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.primary.dark,
        },
    };

    return (
        <Link component={HashLink} to={to} smooth style={textLinkStyle}>
            <Typography sx={textLinkStyle}>{text}</Typography>
        </Link>
    );
};

export default LinkCellTable;
