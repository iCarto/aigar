import React from "react";
import {Link, NavLink} from "react-router-dom";
import "./NavBar.css";

function NavBar() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <Link to="/" className="navbar-brand">
                AIGAR
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarmenu"
                aria-controls="navbarmenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarmenu">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <NavLink
                            to="/"
                            exact
                            activeClassName="active"
                            className="nav-link"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink
                            to="/socios"
                            activeClassName="active"
                            className="nav-link"
                        >
                            Socios
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink
                            to="/facturas"
                            activeClassName="active"
                            className="nav-link"
                        >
                            Facturas
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink
                            to="/estadisticas"
                            activeClassName="active"
                            className="nav-link"
                        >
                            Estadísticas
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
