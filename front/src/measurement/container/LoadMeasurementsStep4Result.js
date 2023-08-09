import {useEffect, useState} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {Spinner} from "base/common";
import {useNavigateWithReload} from "base/navigation/hooks";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";

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
            <div className="alert alert-danger text-center" role="alert">
                Se ha producido un error durante la actualización de las facturas y no
                se han podido guardar los datos.
            </div>
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
            <>
                <div className="alert alert-success text-center" role="alert">
                    Las facturas se han actualizado correctamente.
                </div>
                <BackToInvoicesButton />
            </>
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
