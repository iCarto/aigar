import {useState, useEffect, createContext, useContext} from "react";
import {DomainService} from "aigar/domain/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";

let DomainContext = createContext(null);

export default function DomainProvider({children}) {
    const [sectors, setSectors] = useState([]);
    const [sectorsLong, setSectorsLong] = useState([]);
    const [readingDays, setReadingDays] = useState([]);
    const [memberTypes, setMemberTypes] = useState([]);
    const [memberUseTypes, setMemberUseTypes] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState([]);

    const sortInvoicingMonths = invoicingMonths => {
        return invoicingMonths.sort(
            (a, b) => b.id_mes_facturacion - a.id_mes_facturacion
        );
    };

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getMemberUseTypes(),
            DomainService.getInvoiceStatus(),
            InvoicingMonthService.getInvoicingMonths(),
        ]).then(
            ([
                sectors,
                memberTypes,
                memberUseTypes,
                invoiceStatus,
                invoicingMonths,
            ]) => {
                setSectors(sectors.short);
                setSectorsLong(sectors.long);
                setReadingDays(sectors.readingDays);
                setMemberTypes(memberTypes);
                setMemberUseTypes(memberUseTypes);
                setInvoiceStatus(invoiceStatus);
                setInvoicingMonths(sortInvoicingMonths(invoicingMonths));
            }
        );
    }, []);

    let value = {
        sectors,
        sectorsLong,
        readingDays,
        memberTypes,
        memberUseTypes,
        invoiceStatus,
        invoicingMonths,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
