import {MonthlyInvoicingFilterFormFields} from "../presentational";
import {DomainProvider} from "aigar/domain/provider";

const MonthlyInvoicingFilterForm = ({handleFilterChange}) => {
    return (
        <DomainProvider>
            <MonthlyInvoicingFilterFormFields handleChange={handleFilterChange} />
        </DomainProvider>
    );
};

export default MonthlyInvoicingFilterForm;
