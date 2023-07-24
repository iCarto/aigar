import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useInvoicesTableColumns} from "../data";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import InvoicesFilterForm from "./InvoicesFilterForm";

// TO-DO: Refactor filtering
const ListInvoices = ({
    invoices,
    listView,
    handleChangeListView,
    handleFilterChange,
    filter,
}) => {
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const {tableColumns} = useInvoicesTableColumns();
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredInvoices(filterInvoices(invoices, filter));
    }, [invoices, filter]);

    const filterInvoices = (invoices, filter) => {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.numero) {
                    filtered = invoice.numero.indexOf(filter.numero) >= 0;
                }
                if (filter.nombre) {
                    filtered =
                        filtered &&
                        invoice.nombre
                            .toLowerCase()
                            .indexOf(filter.nombre.toLowerCase()) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
            }
            return filtered; // Return the filtered value
        });
    };

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
        <>
            <EntityListPage
                items={filteredInvoices}
                columns={tableColumns}
                listView={listView}
                handleChangeListView={handleChangeListView}
                filterForm={
                    <InvoicesFilterForm
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                    />
                }
            />
        </>
    );
};

export default ListInvoices;
