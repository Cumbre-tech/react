import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSpring, animated } from "react-spring";
import { colors } from "../../config";
import IconButton from "../buttons/IconButton/IconButton";

// Props interface for the Toast component
interface ToastProps {
    title?: string; // Optional title for the toast
    message: string; // Main message displayed in the toast
    color?: string; // Background color of the toast
    onClose?: () => void; // Callback function triggered when the toast is closed
    duration?: number; // Time in milliseconds before the toast disappears automatically
    isOpen: boolean; // Controls whether the toast is visible or not
    containerStyle?: React.CSSProperties; // Custom styles for the toast container
    titleStyle?: React.CSSProperties; // Custom styles for the title
    messageStyle?: React.CSSProperties; // Custom styles for the message
}

const screenWidth = window.innerWidth;
const isMobile = screenWidth < 768;

const Toast: React.FC<ToastProps> = ({
    title,
    message,
    color,
    onClose,
    duration = 3000, // Default duration is 3 seconds
    isOpen,
    containerStyle,
    titleStyle,
    messageStyle,
}) => {
    // React Spring animation for the toast visibility
    const animationProps = useSpring({
        transform: isOpen ? "translateY(0px)" : `translateY(100px)`,
        opacity: isOpen ? 1 : 0,
        from: { transform: `translateY(100px)`, opacity: 0 },
        config: { tension: 170, friction: 20 },
    });

    // Automatically close the toast after the specified duration
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timeout = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timeout); // Cleanup timeout on unmount
        }
    }, [isOpen, duration, onClose]);

    // Use React Portal to ensure the toast is rendered at the top level of the DOM
    return isOpen
        ? ReactDOM.createPortal(
            <animated.div
                style={{
                    ...animationProps,
                    position: "fixed",
                    padding: "20px",
                    borderRadius: "5px",
                    backgroundColor: color || colors.primary,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bottom: isMobile ? 20 : 50,
                    left: isMobile ? 20 : 50,
                    right: isMobile ? 20 : "auto",
                    zIndex: 1000,
                    width: isMobile ? "90%" : "auto",
                    boxSizing: "border-box",
                    ...containerStyle, // Apply custom container styles
                }}
            >
                <div style={{ flex: 1 }}>
                    {title && (
                        <strong
                            style={{
                                color: colors.textShade,
                                fontSize: "18px",
                                ...titleStyle, // Apply custom title styles
                            }}
                        >
                            {title}
                        </strong>
                    )}
                    <p
                        style={{
                            color: colors.textShade,
                            fontSize: "16px",
                            margin: 0,
                            ...messageStyle, // Apply custom message styles
                        }}
                    >
                        {message}
                    </p>
                </div>
                {onClose && (
                    <IconButton
                        style={{ marginLeft: "10px" }}
                        icon="close"
                        color={colors.textShade}
                        onClick={onClose}
                        type="clear"
                        size="xs"
                        hasShadow={false}
                    />
                )}
            </animated.div>,
            document.body // Render the toast inside the body element
        )
        : null;
};

export default Toast;
