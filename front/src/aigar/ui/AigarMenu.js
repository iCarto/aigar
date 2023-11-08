import {AppMenu} from "base/ui/app/components";

const AigarMenu = () => {
    const menuItems = [
        {
            name: "Inicio",
            to: "/",
            pathname: "inicio",
        },
        {
            name: "Socios/as",
            to: "/socios",
            pathname: "socios",
        },
        // Ver: #4374
        // {
        //     name: "Facturas",
        //     to: "/facturas",
        //     pathname: "facturas",
        // },
        {
            name: "Estadísticas",
            to: "/estadisticas",
            pathname: "estadisticas",
        },
    ];

    return <AppMenu menuItems={menuItems}></AppMenu>;
};

export default AigarMenu;
