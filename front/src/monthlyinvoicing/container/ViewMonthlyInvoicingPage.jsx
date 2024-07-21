import {useEffect, useState} from "react";
import {useList} from "base/entity/provider";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {useButtonDisablingLogic} from "monthlyinvoicing/hooks";
import {useFilter} from "base/filter/hooks";

import {ListMonthlyInvoicesPage, ListMonthlyInvoicesSidebar} from ".";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/ui/other/components";
import {Modal} from "base/ui/modal/components";
import Alert from "@mui/material/Alert";

const ViewMonthlyInvoicingPage = () => {
    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const {
        invoices,
        areInvoicesLoading,
        selectedInvoicingMonth,
        invoicingMonthsForNavigator,
        setSelectedInvoicingMonth,
        setInvoicesToUpdate,
        isDataUpdated,
        setIsDataUpdated,
    } = useMonthlyInvoicingList();

    const buttonDisableRules = useButtonDisablingLogic(
        invoices,
        invoicingMonthsForNavigator,
        selectedInvoicingMonth
    );

    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [loading, setLoading] = useState(areInvoicesLoading);

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
        if (invoices) setLoading(false);
    }, [invoices, filter]);

    const handleFilterChange = newFilter => {
        const filterValue = Object.values(newFilter)[0];
        if (filterValue === "") {
            const updatedFilter = {...filter};
            delete updatedFilter[Object.keys(newFilter)[0]];
            setFilter(updatedFilter);
        } else {
            setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        }
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        setLoading(true);
        setSelectedInvoicingMonth(selectedInvoicingMonth);
    };

    const handleSelectedTableRows = selectedInvoices => {
        setSelectedInvoices(selectedInvoices);
        setInvoicesToUpdate(selectedInvoices);
    };

    const refreshTable = () => {
        setIsDataUpdated(prevState => !prevState);
        setIsSuccessModalOpen(true);
    };

    const closeModal = () => {
        setIsSuccessModalOpen(false);
    };

    const successModalMessage = (
        <Alert severity="success">Los recibos se han actualizado correctamente.</Alert>
    );

    return (
        <PageLayout
            sidebar={
                selectedInvoicingMonth && filteredInvoices ? (
                    <ListMonthlyInvoicesSidebar
                        selectedInvoices={selectedInvoices}
                        invoicingMonths={invoicingMonthsForNavigator}
                        selectedInvoicingMonth={selectedInvoicingMonth}
                        buttonDisableRules={buttonDisableRules}
                        handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                        handleDataUpdate={refreshTable}
                    />
                ) : null
            }
        >
            {areInvoicesLoading || loading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListMonthlyInvoicesPage
                    key={isDataUpdated}
                    invoices={filteredInvoices}
                    selectedTableRows={selectedInvoices}
                    onFilterChange={handleFilterChange}
                    onClickTableRows={handleSelectedTableRows}
                    refreshTable={refreshTable}
                />
            )}
            {isSuccessModalOpen ? (
                <Modal
                    isOpen={isSuccessModalOpen}
                    onClose={closeModal}
                    body={successModalMessage}
                />
            ) : null}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
