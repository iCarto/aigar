import React from "react";
import {BackButton} from "components/common";
import DeleteMemberButton from "./DeleteMemberButton";
import DisconnectMemberButton from "./DisconnectMemberButton";
import ConnectMemberButton from "./ConnectMemberButton";

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
                {this.props.member && this.props.member.is_active ? (
                    <div className="sidebar-group">
                        <label>Acciones</label>
                        <div className="d-flex flex-column text-center pr-4 pl-4">
                            <button
                                onClick={this.props.handleClickEditMember}
                                className="btn btn-primary mt-1 mb-1"
                            >
                                <i className="fas fa-edit mr-2" />
                                Cambiar datos
                            </button>
                            {this.props.member.solo_mecha ? (
                                <ConnectMemberButton
                                    member={this.props.member}
                                    handleSuccessConnectMember={
                                        this.props.handleSuccessConnectMember
                                    }
                                />
                            ) : (
                                <DisconnectMemberButton
                                    member={this.props.member}
                                    handleSuccessDisconnectMember={
                                        this.props.handleSuccessDisconnectMember
                                    }
                                />
                            )}
                            <DeleteMemberButton
                                member={this.props.member}
                                handleSuccessDeletedMember={
                                    this.props.handleSuccessDeletedMember
                                }
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ViewMemberSidebar;
