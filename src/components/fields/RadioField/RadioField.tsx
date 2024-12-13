import React from 'react';
import { colors } from '../../../config';


interface RadioFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (optionName: string) => void;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;

    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    options: any[];
    [key: string]: any;
}

const RadioField: React.FC<RadioFieldProps> = ({
    label,
    description,
    value,
    onChange,
    placeholder,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    id,
    options = [],
    ...props
}) => {
    const handleClick = (index: number) => {
        onChange(options[index]['name']);
    };
    return (
        <>
            <div className={`radio-field-container ${className}`}
                style={{
                    backgroundColor: colors.light,
                    borderRadius: "10px",
                    padding: 10,
                    position: "relative",
                    ...containerStyle
                }}>
                <div className={'field-header'}
                    style={{
                        display: "flex",
                        justifyContent: "justify-content",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                        boxSizing: "border-box",
                        ...headerStyle
                    }}
                >
                    <label style={{
                        fontWeight: "600",
                        color: colors.text,
                        ...labelStyle
                    }}>{label}</label>
                </div>
                <div
                    className={'field-body'}
                    style={{
                        padding: "5px 10px 10px 10px",
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        cursor: "pointer",
                        ...bodyStyle
                    }}>
                    <div>
                        {options.map((option: any, index: any) => {
                            const isActive = value == option.name
                            return (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClick(index)
                                    }}
                                    className={isActive ? "active" : ""}
                                    style={{
                                        display: "inline-block",
                                        borderRadius: "99px",
                                        border: `2px solid ${colors.primary}`,
                                        padding: "5px 10px",
                                        fontWeight: isActive ? 500 : 300,
                                        color: isActive ? "#fff" : colors.primary,
                                        fontSize: ".9em",
                                        margin: "3px",
                                        cursor: "pointer",
                                        backgroundColor: isActive ? colors.primary : "transparent"
                                    }}
                                >
                                    <span>{option?.displayName}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>


            </div>
            {description && <p style={{
                fontWeight: 300,
                fontStyle: "italic",
                display: "block",
                padding: "3px",
                margin: 0,
                color: colors.textTint,
                fontSize: ".9em",
                ...descriptionStyle
            }}>{description}</p>}
        </>

    );
};

export default RadioField;
