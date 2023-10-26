import {BackButton} from "base/ui/buttons/components";
import MenuList from "@mui/material/MenuList";

const ActionsSidebarMenu = ({
    menuActions = null,
    showBackButton = false,
    urlPathBack = "",
}) => {
    return (
        <MenuList
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 0,
            }}
        >
            {showBackButton ? <BackButton path={urlPathBack} /> : null}
            {menuActions?.length
                ? menuActions.map((action, index) => {
                      return (
                          <li key={index} style={{width: "100%", marginTop: "6px"}}>
                              {action}
                          </li>
                      );
                  })
                : null}
        </MenuList>
    );
};

export default ActionsSidebarMenu;
