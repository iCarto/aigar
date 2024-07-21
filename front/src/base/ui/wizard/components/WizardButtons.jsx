import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const WizardButtons = ({
    currentStep,
    numberOfSteps,
    isValidStep,
    onClickPrevStep,
    onClickNextStep,
}) => {
    const previousButton = (
        <Button
            variant="outlined"
            color="primary"
            startIcon={<ChevronLeftIcon />}
            onClick={onClickPrevStep}
        >
            Anterior
        </Button>
    );

    const nextButton = (
        <Button
            variant="contained"
            color="primary"
            endIcon={<ChevronRightIcon />}
            disabled={!isValidStep}
            onClick={onClickNextStep}
        >
            Siguiente
        </Button>
    );

    if (currentStep === 1) {
        return (
            <Grid container justifyContent="flex-end">
                <Grid item>{nextButton}</Grid>
            </Grid>
        );
    }
    if (currentStep === numberOfSteps) {
        return (
            <Grid container justifyContent="flex-start">
                <Grid item>{previousButton}</Grid>
            </Grid>
        );
    }

    return (
        <Grid container justifyContent="space-between">
            <Grid item>{previousButton}</Grid>
            <Grid item>{nextButton}</Grid>
        </Grid>
    );
};

export default WizardButtons;
