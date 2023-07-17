import React from "react";
import {MemberDeleteButtonModal, MemberDeleteStatus} from "../presentation/";
import {MemberService} from "service/api";

class DeleteMemberButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
        };
        this.deleteMember = this.deleteMember.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickFinished = this.onClickFinished.bind(this);
    }

    deleteMember() {
        console.log("DeleteMemberButton.deleteMember");
        this.setState({status: MemberDeleteStatus.PROGRESS}, () => {
            MemberService.deleteMember(this.props.member)
                .then(deletedMember => {
                    this.setState({status: MemberDeleteStatus.SUCCESS});
                })
                .catch(error => {
                    console.log(error);
                    this.setState({status: MemberDeleteStatus.ERROR});
                });
        });
    }

    openModal() {
        this.setState({status: MemberDeleteStatus.START});
    }

    closeModal() {
        this.setState({status: null});
    }

    onClickCancel() {
        this.closeModal();
    }

    onClickAccept() {
        this.deleteMember();
    }

    onClickFinished() {
        this.closeModal();
        this.props.handleSuccessDeletedMember();
    }

    get modal() {
        return (
            <MemberDeleteButtonModal
                member={this.props.member}
                modal={this.state.modal}
                status={this.state.status}
                onClickCancel={this.onClickCancel}
                onClickAccept={this.onClickAccept}
                onClickFinished={this.onClickFinished}
            />
        );
    }

    get button() {
        return (
            <button
                className="btn btn-secondary mt-4 mb-1"
                disabled={this.props.disabled}
                onClick={this.openModal}
            >
                <i className="fas fa-trash mr-2" />
                Eliminar
            </button>
        );
    }

    render() {
        return !this.props.hidden ? (
            <>
                {this.button}
                {this.modal}
            </>
        ) : null;
    }
}

export default DeleteMemberButton;
