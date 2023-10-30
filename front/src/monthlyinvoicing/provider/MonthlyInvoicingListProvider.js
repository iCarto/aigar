import {useState, useEffect, createContext, useContext} from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useInvoicingMonths} from "monthlyinvoicing/hooks";

let MonthlyInvoicingListContext = createContext(null);

export default function MonthlyInvoicingListProvider({children}) {
    const [invoices, setInvoices] = useState([]);
    const [invoicesIds, setInvoicesIds] = useState([]);
    const [invoicesToUpdate, setInvoicesToUpdate] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState([]);
    const [invoicingMonthsForNavigator, setInvoicingMonthsForNavigator] = useState([]);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [areInvoicesLoading, setAreInvoicesLoading] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    const {getCurrentInvoicingMonth, getNextInvoicingMonth} = useInvoicingMonths();

    useEffect(() => {
        InvoicingMonthService.getInvoicingMonths().then(months => {
            const currentMonth = getCurrentInvoicingMonth(months);
            const nextMonth = getNextInvoicingMonth(currentMonth);
            setInvoicingMonths(months);
            setSelectedInvoicingMonth(currentMonth);
            setInvoicingMonthsForNavigator([...months, nextMonth]);
        });
    }, [isDataUpdated]);

    useEffect(() => {
        setAreInvoicesLoading(true);
        if (selectedInvoicingMonth) {
            InvoicingMonthService.getInvoicingMonthInvoices(
                selectedInvoicingMonth?.id_mes_facturacion
            )
                .then(invoices => {
                    setInvoices(invoices);
                    setInvoicesIds(invoices?.map(invoice => invoice.id));
                })
                .catch(error => console.log(error))
                .finally(() => setAreInvoicesLoading(false));
        }
    }, [isDataUpdated, invoicingMonths, selectedInvoicingMonth]);

    let value = {
        invoices,
        invoicesIds,
        invoicesToUpdate,
        setInvoicesToUpdate,
        areInvoicesLoading,
        setIsDataUpdated,
        invoicingMonths,
        invoicingMonthsForNavigator,
        selectedInvoicingMonth,
        setSelectedInvoicingMonth,
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
