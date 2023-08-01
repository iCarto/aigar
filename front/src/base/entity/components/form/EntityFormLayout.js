import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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
                <Typography
                    component="h1"
                    variant="h6"
                    sx={{textAlign: "center", textTransform: "upperCase"}}
                >
                    {formTitle}
                </Typography>
            </Grid>
            {error ? <ErrorMessage message={error} /> : null}
            {form}
            {isSaving ? (
                <Spinner />
            ) : (
                <button type="submit" className="btn btn-primary" disabled={disabled}>
                    <i className="fas fa-save mr-2" />
                    Salvar
                </button>
            )}
        </Grid>
    );
};

export default EntityFormLayout;
