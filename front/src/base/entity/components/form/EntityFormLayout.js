import {PageHeading} from "base/ui/heading";
import {Spinner} from "base/ui/other/components";
import {ErrorMessage} from "base/error/components";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const EntityFormLayout = ({
    onSubmit,
    children: form,
    isSaving = false,
    disabled = false,
    formTitle = "",
    error = "",
}) => {
    return (
        <Grid container component="form" onSubmit={onSubmit} justifyContent="center">
            <Grid item my={2} xs={12}>
                <PageHeading heading={formTitle} />
            </Grid>
            {error ? <ErrorMessage message={error} /> : null}
            {form}
            {isSaving ? (
                <Spinner />
            ) : (
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                    sx={{mb: 2}}
                    disabled={disabled}
                >
                    Salvar
                </Button>
            )}
        </Grid>
    );
};

export default EntityFormLayout;
