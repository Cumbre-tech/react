import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

interface MiniPieChartProps {
    data: DataPoint[];
    width?: number | string;
    height?: number;
    onPeriodChange?: (periodIndex: number, periodData: DataPoint) => void;
    onSliceClick?: (sliceIndex: number, value: Value) => void;
}

const MiniPieChart: React.FC<MiniPieChartProps> = ({
    data,
    width = "100%",
    height = 150,
    onPeriodChange,
    onSliceClick,
}) => {
    const [currentIndex, setCurrentIndex] = useState(data.length - 1);
    const [chartData, setChartData] = useState<ChartData<"pie", number[], string>>({
        labels: [],
        datasets: [],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                // callbacks: {
                //     label: (context: any) => {
                //         return `${context.label}: ${context.raw}`;
                //     },
                // },
            },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const sliceIndex = elements[0].index;
                const selectedValue = data[currentIndex].values[sliceIndex];
                if (onSliceClick) onSliceClick(sliceIndex, selectedValue);
            }
        },
    };

    const adaptDataForChart = (dataPoint: DataPoint): ChartData<"pie", number[], string> => {
        return {
            labels: dataPoint.values.map((item) => item.label),
            datasets: [
                {
                    data: dataPoint.values.map((item) => item.value),
                    backgroundColor: dataPoint.values.map((item) => item.color),
                    borderWidth: 1,
                },
            ],
        };
    };

    useEffect(() => {
        const adaptedData = adaptDataForChart(data[currentIndex]);
        setChartData(adaptedData);
        if (onPeriodChange) onPeriodChange(currentIndex, data[currentIndex]);
    }, [currentIndex]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >

                <div style={{ position: "relative", width, height }}>
                    <Pie data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default MiniPieChart;
