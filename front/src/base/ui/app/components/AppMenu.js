import {AppMenuItem} from ".";
import "../../../../components/navbar/NavBar.css";

const AppMenu = ({children = null, menuItems = []}) => {
    const navItems = menuItems.map((menuItem, index) => (
        <li className="nav-item" key={index}>
            <AppMenuItem
                text={menuItem.name}
                to={menuItem.to}
                resolvedPathName={menuItem.pathname}
                resolvedSecondPathName={menuItem.second_pathname || menuItem.pathname}
            />
        </li>
    ));

    return (
        <ul className="navbar-nav mr-auto">
            {navItems}
            {children}
        </ul>
    );
};

export default AppMenu;
