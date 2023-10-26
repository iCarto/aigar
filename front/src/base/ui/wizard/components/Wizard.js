import {useState} from "react";

import {PageLayout} from "../../page";
import {PageHeading} from "../../heading";
import {WizardButtons, WizardStepInfo, WizardStepper} from ".";
import {ActionsSidebarMenu} from "../../menu/components";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const Wizard = ({heading, steps, isValidStep, onChangeStep, children}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        const newStep =
            currentStep >= steps?.length - 1 ? steps?.length : currentStep + 1;
        setCurrentStep(newStep);
        onChangeStep(newStep);
    };

    const handlePrevStep = () => {
        const newStep = currentStep <= 1 ? 1 : currentStep - 1;
        setCurrentStep(newStep);
        onChangeStep(newStep);
    };

    const stepper = steps ? (
        <WizardStepper
            steps={steps}
            currentStep={currentStep}
            isValidStep={isValidStep}
        />
    ) : null;

    const stepInfo = steps ? (
        <WizardStepInfo steps={steps} currentStep={currentStep} />
    ) : null;

    const buttons = (
        <WizardButtons
            currentStep={currentStep}
            numberOfSteps={steps?.length}
            isValidStep={isValidStep}
            onClickNextStep={handleNextStep}
            onClickPrevStep={handlePrevStep}
        />
    );

    const sidebar = <ActionsSidebarMenu showBackButton />;

    const content = (
        <Grid flexDirection="column" justifyContent="content-between">
            <PageHeading heading={heading} />
            <Box mb={4} mt={3}>
                {stepper}
            </Box>
            <Box
                sx={{
                    borderRadius: 1,
                }}
            >
                {stepInfo}
            </Box>
            <Box
                sx={{
                    border: 1,
                    borderTop: 0,
                    borderBottom: 0,
                    borderColor: "grey.300",
                    p: 1,
                }}
            >
                {children}
            </Box>
            <Box
                sx={{
                    mb: 1,
                    border: 1,
                    borderTop: 0,
                    borderRadius: 1,
                    padding: 2,
                    borderColor: "grey.300",
                }}
            >
                {buttons}
            </Box>
        </Grid>
    );

    return <PageLayout sidebar={sidebar}>{content}</PageLayout>;
};

export default Wizard;
