import {ModuleLayout} from "base/ui/module/components";
import {ModuleConfigProvider} from "base/ui/module/provider";

const StatsModule = () => {
    return (
        <ModuleConfigProvider>
            <ModuleLayout />
        </ModuleConfigProvider>
    );
};

export default StatsModule;
