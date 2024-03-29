import {useState, useEffect, createContext, useContext} from "react";
import {InvoiceService} from "invoice/service";

let InvoicesListContext = createContext(null);

export default function InvoicesListProvider({children}) {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [invoicesIds, setInvoicesIds] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        InvoiceService.getInvoices()
            .then(invoices => {
                setInvoices(invoices);
                setInvoicesIds(invoices?.map(invoice => invoice.id));
            })
            .catch(error => console.log(error))
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
        isLoading,
        setIsDataUpdated,
    };

    return (
        <InvoicesListContext.Provider value={value}>
            {children}
        </InvoicesListContext.Provider>
    );
}

function useInvoicesList() {
    return useContext(InvoicesListContext);
}

export {useInvoicesList};
