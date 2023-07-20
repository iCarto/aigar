import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";

const LoadPaymentsStep4Result = ({id_mes_facturacion, payments}) => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        InvoicingMonthService.savePayments(id_mes_facturacion, payments)
            .then(invoicesUpdated => {
                setResult(true);
            })
            .catch(error => {
                setResult(false);
            });
    }, [id_mes_facturacion, payments]);

    const messageError = () => (
        <div className="alert alert-danger text-center" role="alert">
            Se ha producido un error durante la actualización de las facturas y no se
            han podido guardar los datos.
        </div>
    );

    const inicioButton = () => (
        <Link to="/">
            <button className="btn btn-primary center" type="button">
                Volver al listado de facturas <i className="fas fa-list"></i>
            </button>
        </Link>
    );

    const messageOk = () => (
        <>
            <div className="alert alert-success text-center" role="alert">
                Las facturas se han actualizado correctamente.
            </div>
            {inicioButton()}
        </>
    );

    return (
        <div className="d-flex flex-column justify-content-around align-items-center">
            {result !== null ? (
                result ? (
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

export default LoadPaymentsStep4Result;
