import React from 'react';
import { colors } from '../../config';


interface SpinnerLoaderProps {
    color?: string;
    size?: number;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ color = 'text', size = 40 }) => {
    const resolvedColor = color in colors ? colors[color as keyof typeof colors] : color;

    const sizeInPx = size;

    const borderWidth = `${sizeInPx * 0.1}px`;

    const spinnerLoaderStyle: React.CSSProperties = {
        display: 'inline-block',
        width: size,
        height: size,
        border: `${borderWidth} solid ${colors.light}`,
        borderTop: `${borderWidth} solid ${resolvedColor}`,
        borderRadius: '50%',
        boxSizing: 'border-box',
        animation: 'spinner-animation 2s linear infinite',
    };

    const keyframes = `
    @keyframes spinner-animation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    const insertKeyframes = () => {
        const styleSheet = document.styleSheets[0];
        if (styleSheet) {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        }
    };

    React.useEffect(() => {
        insertKeyframes();
    }, []);

    return <div className="cumbre-spinner-loader" style={spinnerLoaderStyle}></div>;
};

export default SpinnerLoader;
