import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";

const LinkAccessorCellTable = ({row, column, cell}) => {
    const props = column.getProps();
    const item = row.original;

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
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: theme.palette.primary.dark,
        },
    };

    return (
        <Typography
            sx={textLinkStyle}
            onClick={() => {
                props.handleClick(item[props.linkAccessor]);
            }}
        >
            {cell.value}
        </Typography>
    );
};

export default LinkAccessorCellTable;
