import {Link} from "react-router-dom";
import {APP_LOGO_URL, APP_NAME} from "aigar/config";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Header = ({hero = null, menu = null}) => {
    return (
        <AppBar
            position="fixed"
            sx={{height: "60px", backgroundColor: "#343a40", boxShadow: "none"}}
        >
            <Toolbar disableGutters>
                <Link to="/" style={{textDecoration: "none", color: "inherit"}}>
                    <img
                        src={APP_LOGO_URL}
                        alt={`Logo de ${APP_NAME}`}
                        style={{
                            height: "40px",
                            margin: "8px 8px 8px 16px",
                            padding: "2px 20px",
                            backgroundColor: "#fff",
                            borderRadius: "5px",
                        }}
                    />
                </Link>
                {menu ? menu : null}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
