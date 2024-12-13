import React, { useState } from "react";
import { httpClient, HttpClient, securedHttpClient } from "../../../httpClient";
import Loader from "../../Loader/Loader";
import IconButton from "../IconButton/IconButton";
import { colors } from "../../../config";


interface PlayPauseButtonProps {
    value: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    style?: React.CSSProperties;
    apiBaseUrl?: string;
    endpoint: string;
    useInterceptor?: boolean;
    onChangeSuccess?: (newValue: boolean) => void;
    onChangeError?: (error: any) => void;
}

const loaderSizeMap: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
    xs: 16,
    sm: 20,
    md: 30,
    lg: 38,
    xl: 46,
};

const paddingMap: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
    xs: 8,
    sm: 8,
    md: 7,
    lg: 7,
    xl: 7,
};

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
    value = true,
    size = "md",
    className,
    style,
    apiBaseUrl,
    endpoint,
    useInterceptor = false,
    onChangeSuccess,
    onChangeError,
}) => {
    const [processing, setProcessing] = useState(false);

    // Selecciona el cliente HTTP adecuado
    const client: HttpClient = useInterceptor ? securedHttpClient : httpClient;

    // Configura la base URL si está definida
    if (apiBaseUrl) {
        client.setBaseURL(apiBaseUrl);
    }

    const handleClick = async () => {
        setProcessing(true);
        try {
            // Simulates a delay of 2 seconds (2000 ms)
            // await new Promise((resolve) => setTimeout(resolve, 2000));

            const newValue = !value; // Alterna el valor
            await client.post(endpoint, { value: newValue });


            if (onChangeSuccess) {
                onChangeSuccess(newValue);
            }

            setProcessing(false);
        } catch (error: any) {
            console.error("Error while toggling play/pause:", error);

            if (onChangeError) {
                onChangeError(error);
            }

            setProcessing(false);
        }
    };

    return (
        <div className={`cumbre-play-pause-button ${className}`} style={{ ...style }}>
            {processing ? (
                <div
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingRight: paddingMap[size],
                        paddingLeft: paddingMap[size],
                    }}
                >
                    <Loader color={"primary"} size={loaderSizeMap[size]} />
                </div>
            ) : (
                <IconButton
                    type="clear"
                    hasShadow={false}
                    color={value ? "primary" : colors.textTint}
                    onClick={handleClick}
                    icon={value ? "pause" : "play"}
                    size={size}
                />
            )}
        </div>
    );
};

export default PlayPauseButton;
