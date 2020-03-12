import React from "react";
import BackToMonthInfo from "components/common/invoicing/BackToMonthInfo";

class EditMemberSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <BackToMonthInfo handleBack={this.props.handleBack} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditMemberSidebar;
