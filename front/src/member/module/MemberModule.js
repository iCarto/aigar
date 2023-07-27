import {ModuleConfigProvider} from "base/ui/module/provider";
import {ListProvider} from "base/entity/provider";
import {ModuleLayout} from "base/ui/module/components";

const MemberModule = () => {
    return (
        <ModuleConfigProvider>
            <ListProvider>
                <ModuleLayout />
            </ListProvider>
        </ModuleConfigProvider>
    );
};

export default MemberModule;
