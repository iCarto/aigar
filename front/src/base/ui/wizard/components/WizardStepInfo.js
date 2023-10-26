import Grid from "@mui/material/Grid";

const WizardStepInfo = ({steps, currentStep}) => {
    const step = steps[currentStep - 1];

    if (step) {
        return (
            <Grid
                container
                justifyContent="space-between"
                color="white"
                p={3}
                sx={{
                    backgroundColor: "grey",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                }}
            >
                <div>
                    {step.icon} {step.text}
                </div>
                <div>
                    Paso {step.index} de {steps.length}
                </div>
            </Grid>
        );
    }

    return null;
};

export default WizardStepInfo;
