import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Value {
    label: string;
    value: number;
    color: string;
}

interface DataPoint {
    period: string;
    displayPeriod: string;
    values: Value[];
}

interface MiniGroupedBarChartProps {
    data: DataPoint[];
    width?: number | string;
    height?: number;
    groupSpacing?: number;
    barSpacing?: number;
    onSubBarClick?: (value: Value, index: number, group: DataPoint) => void;
}

const MiniGroupedBarChart: React.FC<MiniGroupedBarChartProps> = ({
    data,
    width = "100%",
    height = 80,
    groupSpacing = 0.3,
    barSpacing = 0.2,
    onSubBarClick,
}) => {
    const [chartData, setChartData] = useState<ChartData<"bar", number[], string>>({
        labels: [],
        datasets: [],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const datasetIndex = elements[0].datasetIndex;
                const index = elements[0].index;
                const group = data[index];
                const value = group.values[datasetIndex];
                if (onSubBarClick) onSubBarClick(value, datasetIndex, group);
            }
        },
    };

    // Adapt data for Chart.js
    const adaptDataForChart = (data: DataPoint[]): ChartData<"bar", number[], string> => {
        const labels = data.map((item) => item.displayPeriod);
        const datasets = data[0].values.map((value, datasetIndex) => ({
            label: value.label,
            data: data.map((item) => item.values[datasetIndex].value),
            backgroundColor: value.color,
            barPercentage: 1 - barSpacing,
            categoryPercentage: 1 - groupSpacing, // Reduce el ancho de cada grupo para crear margen
        }));

        return { labels, datasets };
    };

    useEffect(() => {
        const adaptedData = adaptDataForChart(data);
        setChartData(adaptedData);
    }, [data, groupSpacing, barSpacing]);

    return (
        <div style={{ position: "relative", width, height }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default MiniGroupedBarChart;
