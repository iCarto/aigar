import {DomainProvider} from "aigar/domain/provider";
import {InvoicesFilterFormFields} from "../presentational";

const InvoicesFilterForm = ({handleFilterChange}) => {
    return (
        <DomainProvider>
            <InvoicesFilterFormFields handleChange={handleFilterChange} />
        </DomainProvider>
    );
};

export default InvoicesFilterForm;
