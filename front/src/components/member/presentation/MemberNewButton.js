import React from "react";

class MemberNewButton extends React.Component {
    render() {
        return (
            <button
                onClick={this.props.handleClickCreateMember}
                className="btn btn-primary mb-1 mt-1"
            >
                <i className="fas fa-user-plus" /> Nuevo Socio
            </button>
        );
    }
}

export default MemberNewButton;
