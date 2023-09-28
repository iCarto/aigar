import {AppLayout} from "base/ui/app/components";
import {AigarMenu} from ".";
import {DomainProvider} from "aigar/domain/provider";

const AigarApp = () => {
    return (
        <DomainProvider>
            <AppLayout menu={<AigarMenu />} />
        </DomainProvider>
    );
};

export default AigarApp;
