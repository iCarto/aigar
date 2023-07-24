import React from "react";
import _ from "underscore";

class LoadDataInvoicesTableFilter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.filter.text,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.handleChangeDebounced = _.debounce(function () {
            console.log(this.props.name, this.state.value);
            this.props.handleChange.apply(this, [{text: this.state.value}]);
        }, 500);
    }

    componentWillUnmount() {
        this.setState = () => {};
        this.handleChangeDebounced.cancel();
    }

    handleChange(event) {
        this.setState({value: event.target.value}, () => {
            this.handleChangeDebounced();
        });
    }

    get filterByText() {
        return (
            <div className="form-group">
                <input
                    type="text"
                    name="text"
                    className="form-control"
                    placeholder="Buscar"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }

    render() {
        console.log("filterByText");
        return (
            <form className="form-inline d-flex align-self-left mb-2">
                {this.filterByText}
            </form>
        );
    }
}

export default LoadDataInvoicesTableFilter;
