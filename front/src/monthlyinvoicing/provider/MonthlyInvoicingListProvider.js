import {useState, useEffect, createContext, useContext} from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";

let MonthlyInvoicingListContext = createContext(null);

export default function MonthlyInvoicingListProvider({children}) {
    const [invoices, setInvoices] = useState([]);
    const [invoicesIds, setInvoicesIds] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState([]);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        let invoicingMonthOpened;
        InvoicingMonthService.getInvoicingMonths()
            .then(invoicingMonths => {
                invoicingMonthOpened = invoicingMonths.find(
                    invoicingMonth => invoicingMonth.is_open
                );
                // Next month add to allow the creation of a new monthly invoicing process
                setInvoicingMonths([
                    ...invoicingMonths,
                    InvoicingMonthService.getNextInvoicingMonthToCreate(
                        invoicingMonthOpened
                    ),
                ]);
                setSelectedInvoicingMonth(invoicingMonthOpened);
            })
            .then(() =>
                InvoicingMonthService.getInvoicingMonthInvoices(
                    invoicingMonthOpened.id_mes_facturacion
                )
                    .then(invoices => {
                        setInvoices(invoices);
                        setInvoicesIds(invoices?.map(invoice => invoice.id));
                    })
                    .catch(error => console.log(error))
            )
            .finally(() => setIsLoading(false));
    }, [isDataUpdated]);

    useEffect(() => {
        if (filteredInvoices.length) {
            const filteredInvoicesIds = filteredInvoices?.map(invoice => invoice.id);
            setInvoicesIds(filteredInvoicesIds);
        }
    }, [filteredInvoices]);

    let value = {
        invoices,
        filteredInvoices,
        setFilteredInvoices,
        invoicesIds,
        setInvoicesIds,
        invoicingMonths,
        setInvoicingMonths,
        selectedInvoicingMonth,
        setSelectedInvoicingMonth,
        isLoading,
        setIsDataUpdated,
    };

    return (
        <MonthlyInvoicingListContext.Provider value={value}>
            {children}
        </MonthlyInvoicingListContext.Provider>
    );
}

function useMonthlyInvoicingList() {
    return useContext(MonthlyInvoicingListContext);
}

export {useMonthlyInvoicingList};
