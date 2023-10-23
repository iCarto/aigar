import {HashLink} from "react-router-hash-link";
import useTheme from "@mui/material/styles/useTheme";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const TextLink = ({text, to, textStyle = {}}) => {
    const theme = useTheme();
    const textLinkStyle = {
        display: "inline-block",
        whiteSpace: "nowrap",
        fontWeight: "600",
        color: "inherit",
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.primary.dark,
        },
    };

    return (
        <Link component={HashLink} to={to} smooth style={textLinkStyle}>
            <Typography
                sx={{...textLinkStyle, ...textStyle}}
                style={{fontSize: "inherit"}}
            >
                {text}
            </Typography>
        </Link>
    );
};

export default TextLink;
