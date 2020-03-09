import React from "react";
import BackToMonthInfo from "components/common/invoicing/BackToMonthInfo";

class ViewMemberSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky p-3 d-flex flex-column">
                <div className="p-2">
                    <BackToMonthInfo handleBack={this.props.handleBack} />
                </div>
                <div className="p-2">
                    <button
                        onClick={this.props.handleBack}
                        className="btn btn-warning"
                        disabled
                    >
                        <i className="fas mr-2" />
                        Desconectar
                    </button>
                </div>
                <div className="p-2">
                    <button
                        onClick={this.props.handleBack}
                        className="btn btn-danger"
                        disabled
                    >
                        <i className="fas fa-trash mr-2" />
                        Eliminar
                    </button>
                </div>
            </div>
        );
    }
}

export default ViewMemberSidebar;
