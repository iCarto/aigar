import {ButtonLink} from "base/navigation/components";

const LoadMeasurementsButton = ({invoicingMonth, disabled}) => {
    return (
        <ButtonLink
            text="2. Importar lecturas"
            to={"/cargarlecturas/" + invoicingMonth.id_mes_facturacion}
            disabled={disabled}
        />
    );
};

export default LoadMeasurementsButton;
