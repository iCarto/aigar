import React from "react";
import {MemberService} from "service/api";
import {Spinner} from "components/common";
import {FileService} from "service/file";

class MembersExport extends React.Component {
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
                        FileService.downloadURL(
                            membersJSONData,
                            "members_database.json"
                        );
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
            <button onClick={this.handleClick} className="btn btn-primary">
                <i className="fas fa-mobile-alt" /> Exportar al móvil
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

export default MembersExport;
