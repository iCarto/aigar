import React from "react";
import {BackButton} from "components/common";

class CreateInvoiceSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="d-flex flex-column text-center">
                    <div className="mt-1 mb-1">
                        <BackButton handleBack={this.props.handleBack} />
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateInvoiceSidebar;
