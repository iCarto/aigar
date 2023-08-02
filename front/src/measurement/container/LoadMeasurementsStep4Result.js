import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {Spinner} from "base/common";

const LoadMeasurementsStep4Result = ({id_mes_facturacion, measurements}) => {
    const [result, setResult] = useState(null);

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

    /* VIEW SUBCOMPONENTS */
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
            <Link to="/">
                <button className="btn btn-primary center" type="button">
                    Volver al listado de facturas <i className="fas fa-list"></i>
                </button>
            </Link>
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
