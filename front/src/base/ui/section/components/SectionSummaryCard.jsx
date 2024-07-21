import Grid from "@mui/material/Grid";

const SectionSummaryCard = ({children}) => {
    return (
        <Grid
            container
            sx={{
                height: "100%",
                alignContent: "flex-start",
                p: 1,
                border: 1,
                borderColor: "grey.200",
                borderRadius: 1,
                bgcolor: "grey.100",
            }}
        >
            {children}
        </Grid>
    );
};

export default SectionSummaryCard;
