import React, { CSSProperties, useState } from "react";
import { colors } from "../../../config";
import AnimatedNumber from "../../AnimatedNumber/AnimatedNumber";
import Icon from "../../Icon/Icon";

interface DataPoint {
    period: string;
    displayPeriod: string;
    total: number;
}

interface SummaryIndicatorProps {
    data: DataPoint[];
    decimalPlaces?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    measurementUnit?: string; // Unit of measurement (e.g., %, Unid)
    measurementUnitStyle?: CSSProperties; // Custom styles for the unit text
}

const SummaryIndicator: React.FC<SummaryIndicatorProps> = ({
    data,
    decimalPlaces = 0,
    thousandSeparator = ',',
    decimalSeparator = '.',
    measurementUnit,
    measurementUnitStyle
}) => {
    const [currentIndex, setCurrentIndex] = useState(data.length - 1);
    const currentTotal = data[currentIndex].total;
    const previousTotal = currentIndex > 0 ? data[currentIndex - 1].total : null;
    const absoluteVariation = previousTotal !== null ? currentTotal - previousTotal : null;
    const percentageVariation =
        previousTotal !== null ? ((absoluteVariation! / previousTotal) * 100).toFixed(0) : null;


    const isPositive = absoluteVariation !== null && absoluteVariation >= 0;
    const variationColor = isPositive ? colors.success : colors.danger;
    const variationIcon = isPositive ? "upArrow" : "downArrow";


    const formatValue = (value: number): string => {
        const parts = value.toFixed(decimalPlaces).split('.');
        const integerPart = parts[0]
            .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator); // Apply thousand separator
        const decimalPart = parts[1] ? `${decimalSeparator}${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
    };
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    position: "relative",
                    flex: 1,
                    height: 100,

                }}
            >


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>

                    <AnimatedNumber
                        from={0}
                        to={currentTotal}
                        duration={500}
                        decimalPlaces={decimalPlaces}
                        thousandSeparator={thousandSeparator}
                        decimalSeparator={decimalSeparator}
                        style={{
                            fontSize: "27px",
                            fontWeight: "900",
                            color: colors.textShade
                        }}
                    />

                    {absoluteVariation !== null && percentageVariation !== null && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            top: -7
                            //gap: "5px"
                        }}>
                            <Icon name={variationIcon} color={variationColor} size={17} />
                            <div style={{ color: variationColor, fontSize: "14px" }}>
                                {absoluteVariation > 0 ? "+" : ""}
                                {formatValue(absoluteVariation)} ({percentageVariation}%)
                            </div>
                        </div>
                    )}
                    {
                        measurementUnit && <span style={{
                            display: 'block',
                            marginTop: 10,
                            textAlign: 'center',
                            fontWeight: '300',
                            color: colors.textTint,
                            fontStyle: 'italic',
                            ...measurementUnitStyle
                        }}>({measurementUnit})</span>
                    }
                </div>
            </div>
        </div>

    );
};

export default SummaryIndicator;
