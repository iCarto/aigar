import {useList} from "base/entity/provider";
import {MonthlyInvoicingFilterFormFields} from "../presentational";
import {useDomain} from "aigar/domain/provider";

const MonthlyInvoicingFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, memberTypes, invoiceStatus} = useDomain();

    const fields = {
        nombre: filter?.nombre || "",
        sector: filter?.sector || "",
        status: filter?.status || "",
        estado: filter?.estado || "",
    };

    return (
        <MonthlyInvoicingFilterFormFields
            onFieldChange={handleFilterChange}
            fields={fields}
            domains={{sectors, memberTypes, invoiceStatus}}
        />
    );
};

export default MonthlyInvoicingFilterForm;
