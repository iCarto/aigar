import {Outlet} from "react-router-dom";
import {ListProvider} from "base/entity/provider";

//TO-DO: Review: we are now handling the ListProvider in entity Module so this component may no longer be necessary

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
