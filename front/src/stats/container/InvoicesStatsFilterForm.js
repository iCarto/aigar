import {InvoicesStatsFilterFormFields} from "stats/presentational";
import {DomainProvider} from "aigar/domain/provider";

const InvoicesStatsFilterForm = ({filter, onFilterChange}) => {
    const handleFilterChange = (name, value) => {
        onFilterChange({[name]: value});
    };

    return (
        <DomainProvider>
            <InvoicesStatsFilterFormFields
                filter={filter}
                handleChange={handleFilterChange}
            />
        </DomainProvider>
    );
};

export default InvoicesStatsFilterForm;
