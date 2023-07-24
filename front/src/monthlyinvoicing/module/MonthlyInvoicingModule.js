import {ModuleLayout} from "base/ui/module/components";
import {ModuleConfigProvider} from "base/ui/module/provider";

const MonthlyInvoicingModule = () => {
    return (
        <ModuleConfigProvider>
            <ModuleLayout />
        </ModuleConfigProvider>
    );
};

export default MonthlyInvoicingModule;
