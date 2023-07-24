import {DomainProvider} from "aigar/domain/provider";
import {InvoicesFilterFormFields} from "../presentational";

const InvoicesFilterForm = ({filter, handleFilterChange}) => {
    const handleChange = (name, value) => {
        console.log("handleFilterChange", {name}, {value});
        handleFilterChange({[name]: value});
    };

    return (
        <DomainProvider>
            <InvoicesFilterFormFields filter={filter} handleChange={handleChange} />
        </DomainProvider>
    );
};

export default InvoicesFilterForm;
