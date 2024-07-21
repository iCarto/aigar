import {cloneElement} from "react";

const ValueWithIcon = ({icon = null, value = "", title = ""}) => {
    const valueIcon = icon
        ? cloneElement(icon, {
              sx: {fontSize: "1rem", mr: value ? 1 : 0},
          })
        : null;

    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: value ? "inherit" : "center",
    };

    return (
        <span title={title} style={containerStyle}>
            {valueIcon}
            {value || null}
        </span>
    );
};

export default ValueWithIcon;
