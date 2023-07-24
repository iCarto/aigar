import {MonthlyInvoicingFilterFormFields} from "../presentational";
import {DomainProvider} from "aigar/domain/provider";

const MonthlyInvoicingFilterForm = ({filter, handleFilterChange}) => {
    const handleChange = (name, value) => {
        console.log("handleFilterChange", {name}, {value});
        handleFilterChange({[name]: value});
    };

    return (
        <DomainProvider>
            <MonthlyInvoicingFilterFormFields
                filter={filter}
                handleChange={handleChange}
            />
        </DomainProvider>
    );
};

export default MonthlyInvoicingFilterForm;
