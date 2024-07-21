import {NAVBAR_HEIGHT} from "../config/measurements";

import {AppMenuItem} from ".";
import MenuList from "@mui/material/MenuList";

const AppMenu = ({menuItems = []}) => {
    const leftSideItems = menuItems.map((menuItem, index) => (
        <AppMenuItem
            key={index}
            text={menuItem.name}
            to={menuItem.to}
            resolvedPathName={menuItem.pathname}
            resolvedSecondPathName={menuItem.second_pathname || menuItem.pathname}
        />
    ));

    return (
        <MenuList
            component="nav"
            role="menu"
            sx={{
                display: "flex",
                alignItems: "center",
                height: `${NAVBAR_HEIGHT}px`,
            }}
        >
            {leftSideItems}
        </MenuList>
    );
};

export default AppMenu;
