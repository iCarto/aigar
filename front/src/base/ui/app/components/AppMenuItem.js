import {NavLink} from "react-router-dom";
import "../../../../components/navbar/NavBar.css";

const AppMenuItem = ({
    to,
    icon = null,
    text = "",
    textStyle = {},
    tooltipTitle = "",
    resolvedPathName = null,
    resolvedSecondPathName = null,
    ...props
}) => {
    return (
        <NavLink to={to} activeClassName="active" className="nav-link">
            {text}
        </NavLink>
    );
};

export default AppMenuItem;
