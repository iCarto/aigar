import {ModuleLayout} from "base/ui/module/components";
import {ModuleConfigProvider} from "base/ui/module/provider";

const InvoiceModule = () => {
    return (
        <ModuleConfigProvider>
            <ModuleLayout />
        </ModuleConfigProvider>
    );
};

export default InvoiceModule;
