import {useState} from "react";
import {MemberService} from "member/service";
import {FileService} from "base/file/service";
import {Spinner} from "base/ui/other/components";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";

const ExportMemberButton = ({disabled = false}) => {
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);

    const handleClick = () => {
        setLoading(true);
        MemberService.getMembersToExport()
            .then(members => {
                setLoading(false);
                const membersJSONData =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(members));
                FileService.downloadURL(membersJSONData, "lecturas.json");
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                setMessageError("No se ha podido descargar el listado.");
            });
    };

    const errorMessage = messageError ? (
        <Alert severity="error" sx={{mt: 1}}>
            {messageError}
        </Alert>
    ) : null;

    const spinner = (
        <Grid mb={1}>
            <Spinner message="Obteniendo fichero" />
        </Grid>
    );

    const button = (
        <Button onClick={handleClick} disabled={disabled} variant="contained" fullWidth>
            4. Exportar socios
        </Button>
    );

    return (
        <>
            {loading ? spinner : button}
            {errorMessage}
        </>
    );
};

export default ExportMemberButton;
