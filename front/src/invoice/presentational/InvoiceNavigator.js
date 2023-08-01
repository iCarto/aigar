import {useNavigate} from "react-router-dom";

const InvoiceNavigator = ({navigatorIds, currentInvoiceId, path}) => {
    const navigate = useNavigate();

    const currentInvoiceIndex = navigatorIds.indexOf(parseInt(currentInvoiceId));
    const isPreviousButtonDisabled = currentInvoiceIndex === 0;
    const isNextButtonDisabled = currentInvoiceIndex === navigatorIds.length - 1;

    const handleClickPreviousInvoice = () => {
        navigate(`/${path}/${navigatorIds[currentInvoiceIndex - 1]}`);
    };

    const handleClickNextInvoice = () => {
        navigate(`/${path}/${navigatorIds[currentInvoiceIndex + 1]}`);
    };

    return (
        <div className="text-center mb-2" style={{borderBottom: "1px solid #ccc"}}>
            <form className="form-inline d-flex justify-content-between m-1">
                <button
                    type="button"
                    className="btn mr-1"
                    onClick={handleClickPreviousInvoice}
                    disabled={isPreviousButtonDisabled}
                >
                    &laquo; Factura anterior
                </button>
                <button
                    type="button"
                    className="btn ml-1"
                    onClick={handleClickNextInvoice}
                    disabled={isNextButtonDisabled}
                >
                    Siguiente factura &raquo;
                </button>
            </form>
        </div>
    );
};

export default InvoiceNavigator;
