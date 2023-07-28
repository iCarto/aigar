import {InvoicesStatsFilterFormFields} from "stats/presentational";
import {DomainProvider} from "aigar/domain/provider";

const InvoicesStatsFilterForm = ({handleFilterChange}) => {
    return (
        <DomainProvider>
            <InvoicesStatsFilterFormFields handleChange={handleFilterChange} />
        </DomainProvider>
    );
};

export default InvoicesStatsFilterForm;
