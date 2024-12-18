import React from 'react';
import { colors } from '../../../config';
import IconButton from '../IconButton/IconButton';

interface CartButtonProps {
    onClick: () => void; // Action when button is clicked
    className?: string; // Additional CSS classes
    color?: keyof typeof colors | string;
    borderRadius?: number;
    type?: "clear" | "outline" | "solid";
    disabled?: boolean;
    icon?: string;
    iconPaths?: any[];
    iconSize?: number;
    totalItems: number;
    hasShadow?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    badgeStyle?: React.CSSProperties;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CartButton: React.FC<CartButtonProps> = ({
    onClick,
    className,
    color,
    borderRadius = 99,
    type = "solid",
    disabled,
    icon = 'cart',
    iconPaths,
    iconSize,
    hasShadow = false,
    containerStyle,
    buttonStyle,
    badgeStyle,
    size = "xl",
    totalItems
}) => {

    return (
        <div
            className={`cumbre-cart-button ${className || ''}`}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                ...containerStyle
            }}
        >
            {totalItems > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        background: colors.textShade,
                        color: "#fff",
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: 5,
                        paddingTop: 5,
                        borderRadius: 99,
                        lineHeight: 1,
                        fontWeight: '700',
                        zIndex: 1,
                        ...badgeStyle
                    }}
                    className="cart-badge"
                >{totalItems}</div>
            )}
            <IconButton
                onClick={onClick}
                icon={icon}
                size={size}
                type={type}
                color={color}
                borderRadius={borderRadius}
                disabled={disabled}
                iconPaths={iconPaths}
                iconSize={iconSize}
                hasShadow={hasShadow}
                style={buttonStyle}
            />

        </div>
    );
};

export default CartButton;
