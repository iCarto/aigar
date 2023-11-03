import {ESTADOS_FACTURA} from "invoice/model";
import {PrintInvoicesButton} from "monthlyinvoicing/container/actions";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {UpdateInvoiceButton} from ".";

const InvoicePageSidebar = ({invoice, onDataUpdate, urlPathBack = ""}) => {
    const outputFilename = invoice ? "recibo_" + invoice.numero : null;

    const handleDataUpdate = () => {
        onDataUpdate();
    };

    const displayUpdateButton =
        invoice?.estado === ESTADOS_FACTURA.NUEVA ||
        (invoice?.estado === ESTADOS_FACTURA.PENDIENTE_DE_COBRO &&
            !invoice?.payments?.length);

    const menuActions = [
        displayUpdateButton ? <UpdateInvoiceButton invoice={invoice} /> : null,
        <PrintInvoicesButton
            invoices={[invoice]}
            showIcon={true}
            outputFilename={outputFilename}
            onDataUpdate={handleDataUpdate}
        />,
    ];

    return (
        <ActionsSidebarMenu menuActions={invoice ? menuActions : null} showBackButton />
    );
};

export default InvoicePageSidebar;
