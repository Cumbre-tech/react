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
import { colors } from "../../../config";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataPoint {
    period: string;
    displayPeriod?: string;
    total?: number;
}

interface MiniBarChartProps {
    data: DataPoint[];
    width?: number | string;
    height?: number;
    barColor?: string;
    barBorderWidth?: number;
    barBorderColor?: string;
    highlightIndex?: number;
    highlightColor?: string;
    decimalPrecision?: number;
    onBarClick?: (dataPoint: DataPoint, index: number) => void;
}

const MiniBarChart: React.FC<MiniBarChartProps> = ({
    data,
    width = "100%",
    height = 70,
    barColor = colors.medium,
    barBorderWidth = 0,
    barBorderColor = "transparent",
    highlightIndex,
    highlightColor = colors.primary,
    decimalPrecision = 2,
    onBarClick,
}) => {
    const [currentIndex, setCurrentIndex] = useState(highlightIndex ?? data.length - 1);
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
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        onClick: (event: any, elements: any) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setCurrentIndex(index);
                if (onBarClick) onBarClick(data[index], index);
            }
        },
    };

    const adaptDataForChart = (data: DataPoint[]): ChartData<"bar", number[], string> => {
        const labels = data.map((item) => item.displayPeriod || item.period);
        const values = data.map((item) => parseFloat((item.total ?? 0).toFixed(decimalPrecision)));

        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: data.map((_, index) =>
                        index === currentIndex ? highlightColor : barColor
                    ),
                    borderColor: barBorderColor,
                    borderWidth: barBorderWidth,
                },
            ],
        };
    };

    useEffect(() => {
        const adaptedData = adaptDataForChart(data);
        setChartData(adaptedData);
    }, [data, currentIndex]);

    return (
        <div style={{ position: "relative", width, height }}>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default MiniBarChart;
