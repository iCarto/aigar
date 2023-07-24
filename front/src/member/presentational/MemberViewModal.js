import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter} from "base/ui/modal";
import {MemberService} from "member/service";
import {Spinner} from "base/common";
import {ErrorMessage} from "base/error/components";
import {ListMemberInvoices} from "member/container";
import MemberDetail from "./MemberDetail";

class MemberViewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            member: null,
            num_socio: null,
            isLoading: null,
            errorMessage: null,
        };
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio;
        if (num_socio !== prevState.num_socio) {
            return {
                member: null,
                num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.num_socio !== this.state.num_socio) {
            this.loadMember();
        }
    }

    loadMember() {
        if (this.state.num_socio) {
            this.setState({
                isLoading: true,
                errorMessage: null,
            });
            MemberService.getMember(this.state.num_socio)
                .then(member => {
                    this.setState({
                        member,
                        isLoading: false,
                    });
                })
                .catch(error => {
                    this.setState({
                        errorMessage:
                            "Se ha producido un error y no se han podido obtener los datos del socio",
                        isLoading: false,
                    });
                });
        }
    }

    get content() {
        return (
            <>
                <ModalHeader>
                    <h3>Detalle del socio</h3>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={this.props.onClickCancel}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </ModalHeader>
                <ModalBody>
                    {this.state.isLoading === true ? (
                        <Spinner message="Cargando datos" />
                    ) : (
                        <>
                            <ErrorMessage message={this.state.errorMessage} />
                            <MemberDetail member={this.state.member} />
                            {this.state.member ? (
                                <ListMemberInvoices
                                    num_socio={this.state.member.num_socio}
                                />
                            ) : null}
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.onClickCancel}
                    >
                        Cerrar
                    </button>
                </ModalFooter>
            </>
        );
    }

    render() {
        return (
            <Modal isOpen={this.props.showModal === true} size="xl">
                {this.content}
            </Modal>
        );
    }
}

export default MemberViewModal;
