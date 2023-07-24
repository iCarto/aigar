import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {Spinner} from "base/common";
import {InvoicingMonthService} from "monthlyinvoicing/service";

const LoadMeasurementsStep4Result = ({id_mes_facturacion, measurements}) => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        InvoicingMonthService.saveMeasurements(id_mes_facturacion, measurements)
            .then(invoicesUpdated => {
                setResult(true);
            })
            .catch(error => {
                setResult(false);
            });
    }, [id_mes_facturacion, measurements]);

    /* VIEW SUBCOMPONENTS */
    const messageError = () => {
        return (
            <div className="alert alert-danger text-center" role="alert">
                Se ha producido un error durante la actualización de las facturas y no
                se han podido guardar los datos.
            </div>
        );
    };

    const inicioButton = () => {
        return (
            <Link to="/">
                <button className="btn btn-primary center" type="button">
                    Volver al listado de facturas <i className="fas fa-list"></i>
                </button>
            </Link>
        );
    };

    const messageOk = () => {
        return (
            <>
                <div className="alert alert-success text-center" role="alert">
                    Las facturas se han actualizado correctamente.
                </div>
                {inicioButton()}
            </>
        );
    };

    return (
        <div className="d-flex flex-column justify-content-around align-items-center">
            {result !== null ? (
                result === true ? (
                    messageOk()
                ) : (
                    messageError()
                )
            ) : (
                <Spinner message="Actualizando facturas" />
            )}
        </div>
    );
};

export default LoadMeasurementsStep4Result;
