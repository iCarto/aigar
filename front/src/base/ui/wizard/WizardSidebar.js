import {BackButton} from "components/common";

const WizardSidebar = () => {
    return (
        <div className="sidebar-sticky d-flex flex-column">
            <div className="d-flex flex-column text-center">
                <div className="mt-1 mb-1">
                    <BackButton />
                </div>
            </div>
        </div>
    );
};

export default WizardSidebar;
