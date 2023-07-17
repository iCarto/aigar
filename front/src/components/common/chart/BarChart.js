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
                labels: this.getDataLabels(),
                datasets: this.getDatasets(),
            },
            options: {
                scales: {
                    xAxes: [{stacked: true}],
                    yAxes: [
                        {
                            stacked: true,
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
        this.chart.data.labels = this.getDataLabels();
        this.chart.data.datasets = this.getDatasets();
        this.chart.update();
    }

    getDataLabels() {
        return this.props.dataLabels.map(this.props.dataLabelsFormat);
    }

    getDatasets() {
        return this.props.dataDatasets.map(dataset => {
            return {
                label: dataset.label,
                data: dataset.data.map(d => d.value),
                backgroundColor: dataset.backgroundColor,
            };
        });
    }

    render() {
        return <canvas ref={this.chartRef} />;
    }
}

export default BarChart;
