import React from "react";

class IconButtonLink extends React.Component {
    handleClick = e => {
        this.props.handleClick();
    };

    render() {
        return this.props.disabled === false ? (
            <a href="#" onClick={this.handleClick}>
                <div style={{fontSize: "1.1rem", color: "grey"}}>
                    <i className={"fa fa-" + this.props.icon} />
                </div>
            </a>
        ) : (
            <div style={{color: "lightgrey", fontSize: "1.1rem"}}>
                <i className={"fa fa-" + this.props.icon} />
            </div>
        );
    }
}

export default IconButtonLink;
