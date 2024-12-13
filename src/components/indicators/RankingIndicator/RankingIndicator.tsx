import React from "react";
import { colors } from "../../../config";
import Thumbnail from "../../Thumbnail/Thumbnail";


interface RankingValue {
    label: string;
    value: number;
    color: string;
    thumbnailSrc?: string;
}

interface RankingIndicatorProps {
    data: RankingValue[];
    maxItemsToShow?: number;
}

const RankingIndicator: React.FC<RankingIndicatorProps> = ({
    data,
    maxItemsToShow = 10,
}) => {
    const sortedData = data.slice(0, maxItemsToShow);

    return (
        <div style={{ width: "100%", padding: "0px", boxSizing: "border-box" }}>
            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
                {sortedData.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "3px",
                            padding: "3px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "6px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        {/* Position number */}
                        <span
                            style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                marginRight: "4px",
                                color: colors.text,
                            }}
                        >
                            {index + 1}.
                        </span>


                        {item.thumbnailSrc && (
                            <Thumbnail
                                src={item.thumbnailSrc}
                                alt={item.label}
                                shape="circle"
                                border="thin"
                                style={{
                                    marginRight: "3px",
                                    width: 25,
                                    height: 25,
                                    borderWidth: 0
                                }}
                            />
                        )}


                        <div style={{
                            height: 32,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <span style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "400",
                                lineHeight: 1.1
                            }}>
                                {item.label}
                            </span>
                        </div>



                        <span
                            style={{
                                fontWeight: "900",
                                fontSize: "13px",
                                color: colors.primary,
                                paddingLeft: 3

                            }}
                        >
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RankingIndicator;
