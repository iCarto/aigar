import {ModuleConfigProvider} from "base/ui/module/provider";
import {ListProvider} from "base/entity/provider";
import {ModuleLayout} from "base/ui/module/components";
import {MonthlyInvoicingListProvider} from "monthlyinvoicing/provider";

const MonthlyInvoicingModule = () => {
    return (
        <ModuleConfigProvider>
            <ListProvider>
                <MonthlyInvoicingListProvider>
                    <ModuleLayout />
                </MonthlyInvoicingListProvider>
            </ListProvider>
        </ModuleConfigProvider>
    );
};

export default MonthlyInvoicingModule;
