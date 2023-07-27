import {useState, useEffect, createContext, useContext} from "react";
import {DomainService} from "aigar/domain/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";

let DomainContext = createContext(null);

export default function DomainProvider({children}) {
    const [sectors, setSectors] = useState([]);
    const [memberTypes, setMemberTypes] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState([]);

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getInvoiceStatus(),
            InvoicingMonthService.getInvoicingMonths(),
        ]).then(([sectors, memberTypes, invoiceStatus, invoicingMonths]) => {
            setSectors(sectors);
            setMemberTypes(memberTypes);
            setInvoiceStatus(invoiceStatus);
            //TO-DO: Refactor sorting
            invoicingMonths.sort((a, b) => {
                if (a.id_mes_facturacion < b.id_mes_facturacion) {
                    return 1;
                }
                if (a.id_mes_facturacion > b.id_mes_facturacion) {
                    return -1;
                }
                return 0;
            });
            setInvoicingMonths(invoicingMonths);
        });
    }, []);

    let value = {
        sectors,
        memberTypes,
        invoiceStatus,
        invoicingMonths,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
