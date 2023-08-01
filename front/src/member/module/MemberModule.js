import {ModuleConfigProvider} from "base/ui/module/provider";
import {ListProvider} from "base/entity/provider";
import {ModuleLayout} from "base/ui/module/components";
import {MemberSortedListProvider} from "member/provider";

const MemberModule = () => {
    return (
        <ModuleConfigProvider>
            <ListProvider>
                <MemberSortedListProvider>
                    <ModuleLayout />
                </MemberSortedListProvider>
            </ListProvider>
        </ModuleConfigProvider>
    );
};

export default MemberModule;
