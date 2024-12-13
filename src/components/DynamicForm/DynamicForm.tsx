import React, { useState, useEffect, Fragment } from 'react';
import * as ev from 'expr-eval';
import Button from '../buttons/Button/Button';
import IconButton from '../buttons/IconButton/IconButton';
import AutocompleteField from '../fields/AutocompleteField/AutocompleteField';
import ColorField from '../fields/ColorField/ColorField';
import TextField from '../fields/TextField/TextField';
import LongTextField from '../fields/LongTextField/LongTextField';
import PastelColorField from '../fields/PastelColorField/PastelColorField';
import RadioField from '../fields/RadioField/RadioField';
import CheckboxField from '../fields/CheckboxField/CheckboxField';
import { httpClient, HttpClient, securedHttpClient } from '../../httpClient';
import PasswordField from '../fields/PasswordField/PasswordField';

interface FieldData {
    type: string;
    label?: string;
    description?: string;
    placeholder?: string;
    name: string;
    value?: string | boolean | number;
    size?: number;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    [key: string]: any;
}

interface DynamicFormProps {
    title?: string;
    fields: FieldData[];
    onSubmit?: (formData: Record<string, any>) => void;
    onSuccess?: (formData: Record<string, any>) => void;
    onError?: (error: any) => void;
    extraData?: Record<string, any>;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    mode?: 'create' | 'edit' | 'globalEdit' | 'readOnly' | 'submit';
    apiBaseUrl?: string;
    endpoint?: string;
    useInterceptor?: boolean;
    sendButtonType?: 'clear' | 'outline' | 'solid';
    sendButtonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    sendButtonColor?: string;
    sendButtonTitle?: string;
    sendButtonIcon?: string;
    sendButtonIconPaths?: any[];
    sendButtonIconSize?: number;
    sendButtonStyle?: React.CSSProperties;
    sendButtonTitleStyle?: React.CSSProperties;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    title,
    fields,
    onSubmit,
    onSuccess,
    onError,
    containerStyle,
    titleStyle,
    headerStyle,
    bodyStyle,
    fieldContainerStyle,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldHeaderStyle,
    fieldBodyStyle,
    className,
    id,
    mode = 'create',
    apiBaseUrl,
    endpoint,
    extraData,
    useInterceptor = false,
    sendButtonType = 'solid',
    sendButtonSize = 'md',
    sendButtonColor = 'primary',
    sendButtonTitle,
    sendButtonIcon,
    sendButtonIconPaths,
    sendButtonIconSize,
    sendButtonStyle,
    sendButtonTitleStyle,
}) => {
    const [processing, setProcessing] = useState(false);
    const [formValues, setFormValues] = useState<Record<string, any>>(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || '' }), {})
    );
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    const handleFieldChange = (name: string, value: any) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getFieldSizeStyle = (size: number | undefined) => {
        const columnSize = isMobile ? 100 : size ? (size / 12) * 100 : 100;
        return {
            flexBasis: `${columnSize}%`,
            maxWidth: `${columnSize}%`,
        };
    };

    const evaluateShow = (exp: any) => {
        try {
            return exp ? ev.Parser.evaluate(exp, formValues) : true;
        } catch (error) {
            console.error('Error evaluating expression:', error);
            return false;
        }
    };

    const shouldShowField = (field: FieldData) => {
        const showInModes = field.showInModes || ['create', 'edit', 'globalEdit', 'readOnly'];
        const modeMatch = showInModes.includes(mode);
        const conditionMatch = field.showIf ? evaluateShow(field.showIf) : true;
        return modeMatch && conditionMatch;
    };

    const renderField = (field: FieldData) => {
        const {
            type,
            label,
            description,
            placeholder,
            name,
            size,
            value,
            containerStyle,
            labelStyle,
            descriptionStyle,
            headerStyle,
            bodyStyle,
            ...additionalProps
        } = field;

        const commonStyle = {
            containerStyle: { ...fieldContainerStyle, ...containerStyle },
            labelStyle: { ...fieldLabelStyle, ...labelStyle },
            descriptionStyle: { ...fieldDescriptionStyle, ...descriptionStyle },
        };

        const conditionalStyle = {
            headerStyle: { ...fieldHeaderStyle, ...headerStyle },
            bodyStyle: { ...fieldBodyStyle, ...bodyStyle },
        };

        switch (type) {
            case 'text':
                return (
                    <TextField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        placeholder={placeholder}
                        inputStyle={additionalProps.inputStyle}
                        {...commonStyle}
                    />
                );
            case 'password':
                return (
                    <PasswordField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        placeholder={placeholder}
                        inputStyle={additionalProps.inputStyle}
                        {...commonStyle}
                    />
                );
            case 'longText':
                return (
                    <LongTextField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        rows={additionalProps.rows}
                        {...commonStyle}
                    />
                );
            case 'color':
                return (
                    <ColorField
                        onChange={(value: string) => handleFieldChange(name, value)}
                        label={label}
                        description={description || '#000000'}
                        value={formValues[name]}
                        {...commonStyle}
                    />
                );
            case 'pastelColor':
                return (
                    <PastelColorField
                        onChange={(value: string) => handleFieldChange(name, value)}
                        label={label}
                        description={description}
                        value={formValues[name] || "#A597CC"}
                        {...commonStyle}
                    />
                );
            case 'radio':
                return (
                    <RadioField
                        onChange={(value: string) => handleFieldChange(name, value)}
                        label={label}
                        description={description}
                        value={formValues[name] || ""}
                        options={additionalProps.options}
                        {...commonStyle}
                        {...conditionalStyle}
                    />
                );

            case 'autocomplete':
                return (
                    <AutocompleteField
                        onChange={(value: any) => handleFieldChange(name, value)}
                        label={label}
                        description={description}
                        value={formValues[name]}
                        options={additionalProps.options}
                        multiple={additionalProps.multiple}
                        baseUrl={additionalProps.baseUrl}
                        path={additionalProps.path}
                        useInterceptor={additionalProps.useInterceptor}
                        searchParam={additionalProps.searchParam}
                        noResultsText={additionalProps.noResultsText}
                        searchingText={additionalProps.searchingText}
                        primaryKey={additionalProps.primaryKey}
                        secondaryKey={additionalProps.secondaryKey}
                        thumbnailKey={additionalProps.thumbnailKey}

                        {...commonStyle}
                        {...conditionalStyle}
                    />
                );
            case 'checkbox':
                return (
                    <CheckboxField
                        checked={Boolean(formValues[name])}
                        onChange={(checked: boolean) => handleFieldChange(name, checked)}
                        label={label}
                        description={description}
                        {...commonStyle}
                        {...conditionalStyle}
                    />
                );
            default:
                return null;
        }
    };
    const client: HttpClient = useInterceptor ? securedHttpClient : httpClient;
    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);
    const handleSubmit = async (formValues: any) => {
        const finalData = { ...formValues, ...(extraData || {}) };

        if (apiBaseUrl && endpoint) {
            setProcessing(true);
            try {
                const response = await client.post(`${endpoint}`, { ...finalData });

                if (onSuccess) {
                    onSuccess(response);
                }
            } catch (error: any) {
                console.error("Error:", error);

                if (onError) {
                    onError(error);
                }
            } finally {
                setProcessing(false);
            }
        } else {
            if (onSubmit) {
                onSubmit(finalData);
            }

        }
    };


    return (
        <form
            id={id}
            className={`dynamic-form-container ${className}`}
            style={{
                background: '#fff',
                padding: 10,
                boxSizing: 'border-box',
                ...containerStyle,
            }}
        >
            <div className='dynamic-form-header' style={{
                display: 'flex',
                justifyContent: 'center',
                boxSizing: "border-box",
                padding: 4,
                ...headerStyle
            }}>
                <h2 style={{
                    padding: 0,
                    margin: 0,
                    boxSizing: "border-box",
                    ...titleStyle
                }}>{title}</h2>
            </div>
            <div
                className='dynamic-form-body'
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    ...bodyStyle,
                }}
            >
                {fields.map((field, index) => (
                    <Fragment key={index}>
                        {shouldShowField(field) && (
                            <div
                                className='field-wrapper'
                                style={{
                                    ...getFieldSizeStyle(field.size),
                                    padding: '5px 5px',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {renderField(field)}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
            {(mode === 'create' || mode === 'globalEdit' || mode === 'submit') && (
                <>
                    {sendButtonTitle ? (
                        <Button
                            onClick={() => handleSubmit(formValues)}
                            startIcon={sendButtonIcon}
                            startIconSize={sendButtonIconSize}
                            startIconPaths={sendButtonIconPaths}
                            title={sendButtonTitle}
                            titleStyle={sendButtonTitleStyle}
                            style={{
                                marginTop: 10,
                                ...sendButtonStyle
                            }}
                            type={sendButtonType}
                            size={sendButtonSize}
                            color={sendButtonColor}
                            disabled={processing}
                        />
                    ) : (
                        <IconButton
                            onClick={() => handleSubmit(formValues)}
                            icon={sendButtonIcon}
                            iconPaths={sendButtonIconPaths}
                            iconSize={sendButtonIconSize}
                            style={sendButtonStyle}
                            type={sendButtonType}
                            size={sendButtonSize}
                            color={sendButtonColor}
                            disabled={processing}
                        />
                    )}
                </>
            )}
        </form>
    );
};

export default DynamicForm;
