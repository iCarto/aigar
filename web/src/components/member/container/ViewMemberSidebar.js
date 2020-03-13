import React from "react";
import {BackButton} from "components/common";

class ViewMemberSidebar extends React.Component {
    render() {
        return (
            <div className="sidebar-sticky d-flex flex-column">
                <div className="sidebar-group">
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <BackButton handleBack={this.props.handleBack} />
                        </div>
                    </div>
                </div>
                <div className="sidebar-group mt-auto">
                    <label>Acciones</label>
                    <div className="d-flex flex-column text-center">
                        <div className="mt-1 mb-1">
                            <button
                                onClick={this.props.handleClickEditMember}
                                className="btn btn-primary"
                            >
                                <i className="fas mr-2" />
                                Cambiar datos
                            </button>
                        </div>
                        <div className="mt-1 mb-1">
                            <button className="btn btn-warning" disabled>
                                <i className="fas mr-2" />
                                Desconectar
                            </button>
                        </div>
                        <div className="mt-1 mb-4">
                            <button className="btn btn-danger" disabled>
                                <i className="fas fa-trash mr-2" />
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewMemberSidebar;
