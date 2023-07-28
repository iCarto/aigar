import {useNavigate} from "react-router-dom";
import {useInvoicesTableColumns} from "../data";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import InvoicesFilterForm from "./InvoicesFilterForm";

const ListInvoices = ({invoices, handleFilterChange}) => {
    const {tableColumns} = useInvoicesTableColumns();
    const navigate = useNavigate();

    const handleClickView = idFactura => {
        navigate(idFactura);
        // const filteredInvoices = filter(invoices, filter);
        // const filteredInvoicesIds = filteredInvoices.map(invoice => invoice.id_factura);
        // handleClickViewInvoice(id_factura, filteredInvoicesIds);
    };

    const handleClickCreateInvoice = () => {
        //TO-DO: Implement
        return null;
    };

    return (
        <EntityListPage
            items={invoices}
            columns={tableColumns}
            filterForm={<InvoicesFilterForm handleFilterChange={handleFilterChange} />}
        />
    );
};

export default ListInvoices;
