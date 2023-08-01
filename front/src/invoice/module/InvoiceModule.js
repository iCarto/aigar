import {ModuleConfigProvider} from "base/ui/module/provider";
import {ListProvider} from "base/entity/provider";
import {ModuleLayout} from "base/ui/module/components";
import {InvoicesListProvider} from "invoice/provider";

const InvoiceModule = () => {
    return (
        <ModuleConfigProvider>
            <ListProvider>
                <InvoicesListProvider>
                    <ModuleLayout />
                </InvoicesListProvider>
            </ListProvider>
        </ModuleConfigProvider>
    );
};

export default InvoiceModule;
