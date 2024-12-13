import React, { useState } from "react";
import Icon from "../../Icon/Icon";
import DynamicIcon from "../../DynamicIcon/DynamicIcon";
import { colors } from "../../../config";
import Touchable from "../../Touchable/Touchable";

const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

const isDarkColor = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return false;

    const { r, g, b } = rgb;
    // Formula for calculating brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
};

const resolveIcon = (
    icon: string | undefined,
    paths?: any[],
    size?: number,
    color?: string
) => {
    if (icon) {
        return <Icon name={icon} size={size} color={color} />;
    } else if (paths) {
        return <DynamicIcon paths={paths} size={size} />;
    }
    return null;
};

interface ButtonProps {
    title: string;
    onClick: () => void;
    color?: keyof typeof colors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    startIcon?: string;
    startIconPaths?: string[];
    startIconSize?: number;
    endIcon?: string;
    endIconPaths?: string[];
    endIconSize?: number;
    hasShadow?: boolean;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeStyles = {
    xs: { padding: "4px", fontSize: "10px", iconSize: 12 },
    sm: { padding: "6px", fontSize: "12px", iconSize: 16 },
    md: { padding: "10px", fontSize: "16px", iconSize: 24 }, // Default size
    lg: { padding: "14px", fontSize: "18px", iconSize: 32 },
    xl: { padding: "18px", fontSize: "22px", iconSize: 40 },
};

const Button: React.FC<ButtonProps> = ({
    title,
    onClick,
    color = "primary",
    borderRadius = 4,
    type = "solid",
    disabled = false,
    startIcon,
    startIconPaths,
    startIconSize,
    endIcon,
    endIconPaths,
    endIconSize,
    hasShadow = true,
    style,
    titleStyle,
    size = "md",
    className = "button",
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressStart = () => {
        if (!disabled) {
            setIsPressed(true);
        }
    };

    const handlePressEnd = () => {
        if (!disabled) {
            setIsPressed(false);
        }
    };

    const iconSize = sizeStyles[size]?.iconSize;

    const resolvedColor = color in colors ? colors[color as keyof typeof colors] : color;

    const contentColor =
        type === "solid"
            ? isDarkColor(resolvedColor || "")
                ? "#fff"
                : colors.textShade
            : resolvedColor;

    const buttonStyle: React.CSSProperties = {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: sizeStyles[size]?.padding,
        borderRadius: `${borderRadius}px`,
        border: type === "outline" ? `2px solid ${resolvedColor}` : "none",
        backgroundColor: type === "solid" ? resolvedColor : "transparent",
        color: contentColor,
        boxShadow: hasShadow
            ? isPressed
                ? "none"
                : "0px 2px 5px rgba(0, 0, 0, 0.2)"
            : "none",
        transform: isPressed ? "scale(0.98)" : "scale(1)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
        opacity: disabled ? 0.6 : 1,
        boxSizing: "border-box",
        ...style,
    };

    const textStyle: React.CSSProperties = {
        fontSize: sizeStyles[size]?.fontSize,
        margin: "0 8px",
        color: contentColor,
        ...titleStyle,
    };

    return (
        <Touchable className={className} onClick={onClick} style={buttonStyle}>
            <button
                onClick={(e) => e.preventDefault()}
                onMouseDown={handlePressStart} // Desktop
                onMouseUp={handlePressEnd} // Desktop
                onMouseLeave={handlePressEnd} // Desktop
                onTouchStart={handlePressStart} // Mobil
                onTouchEnd={handlePressEnd} // Mobil
                style={{
                    border: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "inherit",  // Inherit cursor from parent
                    outline: "none",   // Remove default button outline
                }}
                disabled={disabled}
            >
                {resolveIcon(
                    startIcon,
                    startIconPaths,
                    startIconSize ?? iconSize,
                    contentColor
                )}
                <span style={textStyle}>{title}</span>
                {resolveIcon(
                    endIcon,
                    endIconPaths,
                    endIconSize ?? iconSize,
                    contentColor
                )}
            </button>
        </Touchable>
    );
};

export default Button;