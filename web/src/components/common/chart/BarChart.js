import React from "react";
import Chart from "chart.js";

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.chart = new Chart(this.chartRef.current, {
            type: "bar",
            data: {
                labels: this.props.data.map(d => d.label),
                datasets: [
                    {
                        label: this.props.title,
                        data: this.props.data.map(d => d.value),
                        backgroundColor: this.props.color,
                    },
                ],
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        });
    }

    componentDidUpdate() {
        this.chart.data.labels = this.props.data.map(d => d.label);
        this.chart.data.datasets[0].label = this.props.title;
        this.chart.data.datasets[0].data = this.props.data.map(d => d.value);
        this.chart.update();
    }

    render() {
        return <canvas ref={this.chartRef} />;
    }
}

export default BarChart;
