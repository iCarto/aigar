import {BackButton} from "base/common";
import MenuList from "@mui/material/MenuList";

const ActionsSidebarMenu = ({menuActions = null, showBackButton = false}) => {
    return (
        <MenuList
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {showBackButton ? <BackButton /> : null}
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
