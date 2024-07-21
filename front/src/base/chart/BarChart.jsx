import {useEffect, useRef} from "react";
import Chart from "chart.js/auto";

const BarChart = ({dataLabels, dataLabelsFormat, dataDatasets}) => {
    const chartRef = useRef(null);
    const chart = useRef(null);

    useEffect(() => {
        chart.current = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels: getDataLabels(),
                datasets: getDatasets(),
            },
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                    },
                },
            },
        });
        return () => {
            chart.current.destroy();
        };
    }, []);

    useEffect(() => {
        chart.current.data.labels = getDataLabels();
        chart.current.data.datasets = getDatasets();
        chart.current.update();
    }, [dataLabels, dataDatasets]);

    const getDataLabels = () => {
        return dataLabels.map(dataLabelsFormat);
    };

    const getDatasets = () => {
        return dataDatasets.map(dataset => {
            return {
                label: dataset.label,
                data: dataset.data.map(d => d.value),
                backgroundColor: dataset.backgroundColor,
            };
        });
    };

    return <canvas ref={chartRef} />;
};

export default BarChart;
