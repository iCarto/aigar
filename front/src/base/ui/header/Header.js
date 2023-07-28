import {Link} from "react-router-dom";
import {APP_LOGO_URL} from "aigar/config";

const Header = ({hero = null, menu = null}) => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <Link to="/" className="navbar-brand">
                <img src={process.env.PUBLIC_URL + APP_LOGO_URL} alt="AIGAR Logo" />
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

            <div className="collapse navbar-collapse" id="navbarmenu" role="menu">
                {menu ? menu : null}
            </div>
        </nav>
    );
};

export default Header;
