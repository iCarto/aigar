import {PrintInvoicesButton} from "monthlyinvoicing/container/actions";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {UpdateInvoiceButton} from ".";

const InvoicePageSidebar = ({invoice, onDataUpdate, urlPathBack = ""}) => {
    const outputFilename = invoice ? "recibo_" + invoice.numero : null;

    const handleDataUpdate = () => {
        onDataUpdate();
    };

    const menuActions = [
        invoice?.is_active ? <UpdateInvoiceButton invoice={invoice} /> : null,
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
