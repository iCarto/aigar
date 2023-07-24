import {Outlet} from "react-router-dom";
import {ListProvider} from "base/entity/provider";

/**
 * High Order Component that stores filter and entity list
 * @returns
 */
const EntityManagePage = () => {
    return (
        <ListProvider>
            <Outlet />
        </ListProvider>
    );
};

export default EntityManagePage;
