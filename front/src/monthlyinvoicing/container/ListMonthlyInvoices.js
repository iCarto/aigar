import {useState, useEffect} from "react";

import {useMonthlyInvoicingTableColumns} from "monthlyinvoicing/data";
import ListMonthlyInvoicesSidebar from "./ListMonthlyInvoicesSidebar";
import EntityListPage from "base/entity/components/presentational/EntityListPage";
import {MonthlyInvoicingFilterForm} from ".";
import "base/ui/mainpage/SideBar.css";

const ListMonthlyInvoices = ({
    invoices,
    listView,
    handleChangeListView,
    handleFilterChange,
    invoicingMonths,
    selectedInvoicingMonth,
    handleChangeInvoicingMonth,
    handleSuccessCreateInvoices,
    filter,
}) => {
    const [filteredInvoices, setFilderedInvoices] = useState(null);
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    useEffect(() => {
        setFilderedInvoices(filterInvoices(invoices, filter));
    }, [selectedInvoicingMonth]);

    const handleSuccessPrintInvoices = () => {
        // loadInvoices();
    };

    const handleClickViewInvoice = id_factura => {
        const filteredInvoices = filter(invoices, filter);
        const filteredInvoicesIds = filteredInvoices.map(invoice => invoice.id_factura);
        handleClickViewInvoice(id_factura, filteredInvoicesIds);
    };

    const filterInvoices = (invoices, filter) => {
        if (invoices) {
            return invoices.filter(invoice => {
                var filtered = true;
                if (filter) {
                    if (filter.nombre) {
                        filtered =
                            filtered &&
                            invoice.nombre
                                .toLowerCase()
                                .indexOf(filter.nombre.toLowerCase()) >= 0;
                    }
                    if (filter.sector) {
                        filtered =
                            filtered && invoice.sector === parseInt(filter.sector);
                    }
                    if (filter.tipo_socio) {
                        filtered = filtered && invoice.tipo_socio === filter.tipo_socio;
                    }
                    if (filter.estado) {
                        filtered = filtered && invoice.estado === filter.estado;
                    }
                }
                return filtered;
            });
        }
        return null;
    };

    return (
        <>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <ListMonthlyInvoicesSidebar
                    invoices={filteredInvoices}
                    invoicingMonths={invoicingMonths}
                    selectedInvoicingMonth={selectedInvoicingMonth}
                    handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                    handleSuccessCreateInvoices={handleSuccessCreateInvoices}
                    handleSuccessPrintInvoices={handleSuccessPrintInvoices}
                />
            </nav>
            <EntityListPage
                isSubpage={true}
                items={filteredInvoices}
                columns={tableColumns}
                listView={listView}
                filterForm={
                    <MonthlyInvoicingFilterForm
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                    />
                }
                handleChangeListView={handleChangeListView}
            />
        </>
    );
};

export default ListMonthlyInvoices;
