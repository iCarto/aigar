import {PrintInvoicesButton} from "monthlyinvoicing/container/actions";
import {ActionsSidebarMenu} from "base/ui/menu";
import {UpdateInvoiceButton} from ".";

const InvoicePageSidebar = ({invoice}) => {
    const getOutputFilename = () => {
        if (invoice) {
            return "recibo_" + invoice.numero;
        }
        return null;
    };

    const menuActions = [
        invoice?.is_active ? <UpdateInvoiceButton invoice={invoice} /> : null,
        <PrintInvoicesButton
            invoices={[invoice]}
            showIcon={true}
            outputFilename={getOutputFilename()}
        />,
    ];

    return (
        <ActionsSidebarMenu menuActions={invoice ? menuActions : null} showBackButton />
    );
};

export default InvoicePageSidebar;
