import createTheme from "@mui/material/styles/createTheme";
import {tableCellClasses} from "@mui/material/TableCell";
import {esES} from "@mui/material/locale";

import grey from "@mui/material/colors/grey";

// For the palette, only the "main" variant is required. If no other variant is provided, "dark" & "light" variants will be calculated by default through the createTheme method.
// Specific colors can be imported from the MUI color palettes https://mui.com/material-ui/customization/color/ to be used as objects containing all the different hues and shades of that specific palette.

// When no customTheme is available, just export defaultTheme in order to use MUI default theme.
const defaultTheme = createTheme();

export const CUSTOM_FONT_FAMILY = [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
].join(",");

const customHeadingsStyle = {fontFamily: CUSTOM_FONT_FAMILY, fontWeight: "bold"};

// We are defining colors in a global variable so that we can use them in files other than React components (like hooks). If this was not needed, we would just define the colors inside the palette object.
export const CUSTOM_COLORS = {
    primary: {
        main: "#025eaa",
        light: "#538bdc",
        lighter: "#ddebff",
        dark: "#00357a",
        contrastText: "#fff",
        hover: "#f5f9fc",
    },
    secondary: {
        dark: "#002b4a",
        main: "#7FBCE1",
        light: "#BFDDF0",
        lighter: "#E5F1F8",
    },
    error: {
        main: "#d32f2f",
        dark: "#c62828",
    },
    pageBackground: "#e0e0e0",
    text: {
        primary: "#283838",
    },
    grey: grey,
    white: "#fff",
};

const customTheme = createTheme(
    {
        palette: {},

        typography: {
            // fontSize: 12,
        },

        components: {
            MuiTypography: {
                styleOverrides: {
                    h1: customHeadingsStyle,
                    h2: customHeadingsStyle,
                    h3: customHeadingsStyle,
                    h4: customHeadingsStyle,
                    h5: customHeadingsStyle,
                    h6: {...customHeadingsStyle, color: CUSTOM_COLORS.secondary.dark},
                },
            },

            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        "&.Mui-selected": {
                            // <-- mixing the two classes
                            backgroundColor: CUSTOM_COLORS.secondary.light,
                        },
                    },
                },
            },

            MuiTableRow: {
                styleOverrides: {
                    root: {
                        "&:nth-of-type(odd)": {
                            backgroundColor: defaultTheme.palette.action.hover,
                        },
                    },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    root: {
                        padding: "8px",
                        border: `0.5px solid ${defaultTheme.palette.divider}`,
                        [`&.${tableCellClasses.head}`]: {
                            backgroundColor: defaultTheme.palette.grey[800],
                            color: defaultTheme.palette.common.white,
                        },
                    },
                },
            },

            MuiTableSortLabel: {
                styleOverrides: {
                    root: {
                        color: defaultTheme.palette.common.white,
                        lineHeight: "1rem",
                        "&.Mui-active": {
                            color: "inherit",
                        },
                        "&:hover": {
                            color: "inherit",
                        },
                        "&:focus": {
                            color: "inherit",
                            fontWeight: 800,
                        },
                    },
                    // icon: {
                    //     "&:active": {
                    //         opacity: 1,
                    //     },
                    // },
                },
            },

            MuiTablePagination: {
                styleOverrides: {
                    selectLabel: {
                        margin: 0,
                    },
                    displayedRows: {
                        margin: 0,
                    },
                },
            },
        },
    },
    // Language for UI localization
    esES
);

export const theme = customTheme;

const commonTypography = {
    fontSize: "0.8rem",
    [theme.breakpoints.up("xl")]: {
        fontSize: "1rem",
    },
};

theme.typography.body1 = commonTypography;
theme.typography.body2 = commonTypography;
