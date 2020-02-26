import React from "react";
import {Link} from "react-router-dom";

class MemberNewButton extends React.Component {
    render() {
        return (
            <Link to="/socios/nuevo" className="btn btn-primary">
                Nuevo Socio
            </Link>
        );
    }
}

export default MemberNewButton;
