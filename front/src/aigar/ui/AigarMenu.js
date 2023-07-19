import {AppMenu} from "base/ui/app/components";

const AigarMenu = () => {
    const menuItems = [
        {
            name: "Inicio",
            to: "/",
            pathname: "inicio",
        },
        {
            name: "Socios",
            to: "/socios",
            pathname: "socios",
        },
        {
            name: "Facturas",
            to: "/facturas",
            pathname: "facturas",
        },
        {
            name: "Estadísticas",
            to: "/estadisticas",
            pathname: "estadisticas",
        },
    ];

    return (
        <AppMenu menuItems={menuItems}>
            {/* <MenuItem sx={{marginLeft: "auto"}}>
                <AccountMenu />
            </MenuItem> */}
        </AppMenu>
    );
};

export default AigarMenu;
