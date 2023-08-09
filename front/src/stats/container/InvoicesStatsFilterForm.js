import {useDomain} from "aigar/domain/provider";
import {useList} from "base/entity/provider";
import {InvoicesStatsFilterFormFields} from "stats/presentational";

const InvoicesStatsFilterForm = ({handleFilterChange}) => {
    const {filter} = useList();
    const {sectors, invoicingMonths} = useDomain();

    const fields = {
        sector: filter?.sector || "",
        startInvoicingMonth: filter?.startInvoicingMonth || "",
        endInvoicingMonth: filter?.endInvoicingMonth || "",
    };

    return (
        <>
            <InvoicesStatsFilterFormFields
                onFieldChange={handleFilterChange}
                fields={fields}
                domains={{sectors, invoicingMonths}}
            />
        </>
    );
};

export default InvoicesStatsFilterForm;
