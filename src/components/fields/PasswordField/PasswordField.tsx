import React from 'react';
import { colors } from '../../../config';


interface PasswordFieldProps {
    label?: string;
    description?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    [key: string]: any;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label,
    description,
    value,
    onChange,
    placeholder,
    containerStyle,
    labelStyle,
    inputStyle,
    descriptionStyle,
    className,
    id,
    ...props
}) => {
    return (
        <>
            <div className={`text-field-container ${className}`}
                style={{
                    background: "#fff",
                    width: "100%",
                    borderColor: colors.medium,
                    borderWidth: "2px",
                    borderRadius: "10px",
                    borderStyle: "solid",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    position: "relative",
                    padding: "10px",
                    marginTop: "10px",
                    ...containerStyle
                }}>
                <label style={{
                    position: "absolute",
                    top: "-13px",
                    left: "10px",
                    display: "inline-block",
                    padding: "0 5px",
                    background: "#fff",
                    fontWeight: "600",
                    color: colors.text,
                    ...labelStyle
                }}>{label}</label>

                <input
                    type='password'
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    id={id}
                    style={{
                        outline: "none",
                        backgroundColor: "transparent",
                        border: "none",
                        width: "100%",
                        color: colors.text,
                        ...inputStyle
                    }}
                    {...props}
                />
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

export default PasswordField;
