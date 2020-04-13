import React from "react";

class MemberNewButton extends React.Component {
    render() {
        return (
            <button
                onClick={this.props.handleClickCreateMember}
                className="btn btn-secondary"
            >
                <i className="fas fa-plus" /> Nuevo Socio
            </button>
        );
    }
}

export default MemberNewButton;
