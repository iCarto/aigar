import {useList} from "base/entity/provider";
import {InvoicesFilterFormFields} from "../presentational";
import {useDomain} from "aigar/domain/provider";

const InvoicesFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, invoiceStatus} = useDomain();

    const fields = {
        socio_factura: filter?.socio_factura || "",
        numero: filter?.numero || "",
        sector: filter?.sector || "",
        estado: filter?.estado || "",
    };

    return (
        <InvoicesFilterFormFields
            onFieldChange={handleFilterChange}
            fields={fields}
            domains={{sectors, invoiceStatus}}
        />
    );
};

export default InvoicesFilterForm;
