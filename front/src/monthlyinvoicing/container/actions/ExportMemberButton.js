import React from "react";
import {MemberService} from "member/service";
import {Spinner} from "base/common";
import {FileService} from "base/file/service";

class ExportMemberButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messageError: null,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(
            {
                loading: true,
            },
            () => {
                MemberService.getMembersToExport()
                    .then(members => {
                        this.setState({
                            loading: false,
                        });
                        var membersJSONData =
                            "data:text/json;charset=utf-8," +
                            encodeURIComponent(JSON.stringify(members));
                        FileService.downloadURL(membersJSONData, "lecturas.json");
                    })
                    .catch(error => {
                        this.setState({
                            loading: false,
                            messageError: "No se ha podido descargar el listado.",
                        });
                    });
            }
        );
    }

    get message() {
        return this.state.messageError ? (
            <div className="alert alert-danger mt-2" role="alert">
                {this.state.messageError}
            </div>
        ) : null;
    }

    get spinner() {
        return (
            <div className="d-flex align-items-center">
                <Spinner message="Obteniendo fichero" />
            </div>
        );
    }

    get button() {
        return (
            <button
                onClick={this.handleClick}
                className={
                    "btn mt-1 mb-1 " +
                    (this.props.disabled ? "btn-secondary" : "btn-primary")
                }
                disabled={this.props.disabled}
            >
                {this.props.position ? this.props.position + ". " : null}
                Exportar socios
            </button>
        );
    }

    render() {
        return (
            <>
                {this.state.loading ? this.spinner : this.button}
                {this.message}
            </>
        );
    }
}

export default ExportMemberButton;
