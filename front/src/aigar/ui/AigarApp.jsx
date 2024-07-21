import {AppLayout} from "base/ui/app/components";
import {AigarMenu} from ".";
import {DomainProvider} from "aigar/domain/provider";
import {AigarConfigModal} from "aigar/domain/components";

const AigarApp = () => {
    return (
        <DomainProvider>
            <AigarConfigModal />
            <AppLayout menu={<AigarMenu />} />
        </DomainProvider>
    );
};

export default AigarApp;
