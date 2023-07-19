import {Outlet} from "react-router-dom";
import {Header} from "base/ui/header";

const AppLayout = ({hero = null, menu = null, footer = null}) => {
    return (
        <main role="main">
            <Header hero={hero} menu={menu} />
            <Outlet />
            {footer}
        </main>
    );
};

export default AppLayout;
