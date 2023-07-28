import {useState} from "react";
import {MemberService} from "member/service";
import {Spinner} from "base/common";
import {FileService} from "base/file/service";
import Button from "@mui/material/Button";

const ExportMemberButton = ({disabled}) => {
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

    const message = messageError ? (
        <div className="alert alert-danger mt-2" role="alert">
            {messageError}
        </div>
    ) : null;

    const spinner = loading ? (
        <div className="d-flex align-items-center">
            <Spinner message="Obteniendo fichero" />
        </div>
    ) : null;

    const button = (
        <Button onClick={handleClick} disabled={disabled} variant="contained" fullWidth>
            4. Exportar socios
        </Button>
    );

    return (
        <>
            {loading ? spinner : button}
            {message}
        </>
    );
};

export default ExportMemberButton;
