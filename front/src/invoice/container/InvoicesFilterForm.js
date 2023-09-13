import {useList} from "base/entity/provider";
import {InvoicesFilterFormFields} from "../presentational";
import {useDomain} from "aigar/domain/provider";

const InvoicesFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, invoiceStatus} = useDomain();

    const fields = {
        numero: filter?.numero || "",
        nombre: filter?.nombre || "",
        sector: filter?.sector || "",
    };

    return (
        <>
            <InvoicesFilterFormFields
                onFieldChange={handleFilterChange}
                fields={fields}
                domains={{sectors, invoiceStatus}}
            />
        </>
    );
};

export default InvoicesFilterForm;
