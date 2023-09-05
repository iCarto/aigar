import {useEffect, useState} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {Spinner} from "base/common";
import {useNavigateWithReload} from "base/navigation/hooks";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const LoadMeasurementsStep4Result = ({id_mes_facturacion, measurements}) => {
    const [result, setResult] = useState(null);
    const {setIsDataUpdated} = useMonthlyInvoicingList();

    const navigate = useNavigateWithReload();

    const handleClick = () => {
        setIsDataUpdated(prevState => !prevState);
        navigate("/", true);
    };

    useEffect(() => {
        InvoicingMonthService.saveMeasurements(id_mes_facturacion, measurements)
            .then(() => {
                setResult(true);
            })
            .catch(error => {
                console.log(error);
                setResult(false);
            });
    }, [id_mes_facturacion, measurements]);

    const ErrorMessage = () => {
        return (
            <Alert severity="error">
                Se ha producido un error durante la actualización de las facturas y no
                se han podido guardar los datos.
            </Alert>
        );
    };

    const BackToInvoicesButton = () => {
        return (
            <button
                className="btn btn-primary center"
                type="button"
                onClick={handleClick}
            >
                Volver al listado de facturas <i className="fas fa-list"></i>
            </button>
        );
    };

    const SuccessMessage = () => {
        return (
            <Alert severity="success">
                <Stack>
                    <Typography mb={3}>
                        Las facturas se han actualizado correctamente.
                    </Typography>
                    <BackToInvoicesButton />
                </Stack>
            </Alert>
        );
    };

    return (
        <div className="d-flex flex-column justify-content-around align-items-center">
            {result !== null ? (
                result ? (
                    <SuccessMessage />
                ) : (
                    <ErrorMessage />
                )
            ) : (
                <Spinner message="Actualizando facturas" />
            )}
        </div>
    );
};

export default LoadMeasurementsStep4Result;
