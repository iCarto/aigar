import {ButtonLink} from "base/navigation/components";

const LoadPaymentsButton = ({invoicingMonth, disabled}) => {
    return (
        <ButtonLink
            text="5. Importar pagos"
            to={`/cargarpagos/${invoicingMonth.id_mes_facturacion}`}
            disabled={disabled}
        />
    );
};

export default LoadPaymentsButton;
