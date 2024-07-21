import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const WizardStepInfo = ({steps, currentStep}) => {
    const step = steps[currentStep - 1];

    if (step) {
        return (
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                color="white"
                p={3}
                sx={{
                    backgroundColor: "grey",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                }}
            >
                <Box display="flex" alignItems="center">
                    {step.icon} <Typography pl={2}>{step.text}</Typography>
                </Box>
                <div>
                    Paso {step.index} de {steps.length}
                </div>
            </Grid>
        );
    }

    return null;
};

export default WizardStepInfo;
