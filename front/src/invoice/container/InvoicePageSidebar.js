import {PrintInvoicesButton} from "monthlyinvoicing/container/actions";
import {ActionsSidebarMenu} from "base/ui/menu/components";
import {UpdateInvoiceButton} from ".";

const InvoicePageSidebar = ({invoice, urlPathBack = ""}) => {
    const outputFilename = invoice ? "recibo_" + invoice.numero : null;

    const menuActions = [
        invoice?.is_active ? <UpdateInvoiceButton invoice={invoice} /> : null,
        <PrintInvoicesButton
            invoices={[invoice]}
            showIcon={true}
            outputFilename={outputFilename}
        />,
    ];

    return (
        <ActionsSidebarMenu
            menuActions={invoice ? menuActions : null}
            showBackButton
            urlPathBack={urlPathBack}
        />
    );
};

export default InvoicePageSidebar;
