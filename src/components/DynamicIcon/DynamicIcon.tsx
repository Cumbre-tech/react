import React from "react";
import { colors } from "../../config";

interface Path {
    d: string;
    color?: string;
}


interface DynamicIconProps {
    size?: number;
    paths: Path[];
    style?: React.CSSProperties;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ size = 24, paths, style }) => {
    const getColor = (pathColor?: string): string | undefined => {
        if (pathColor && pathColor in colors) {
            return colors[pathColor as keyof typeof colors];
        }
        return pathColor;
    };

    return (
        <svg
            style={{ ...style, width: size, height: size }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            {paths.map((path, index) => (
                <path
                    key={index}
                    fill={getColor(path.color) || colors.text}
                    d={path.d}
                />
            ))}
        </svg>
    );
};

export default DynamicIcon;
