import React, { useState } from 'react';

import Icon from '../Icon/Icon';
import Thumbnail from '../Thumbnail/Thumbnail';
import StepTracker from '../StepTracker/StepTracker';

import Color from '../Color/Color';
import PlayPauseButton from '../buttons/PlayPauseButton/PlayPauseButton';
import LockToggleButton from '../buttons/LockToggleButton/LockToggleButton';
import InterpolatedContent from '../InterpolatedContent/InterpolatedContent';
import ActionsMenuButton from '../buttons/ActionsMenuButton/ActionsMenuButton';
import SortableHandle from '../Sortable/SortableHandle';
import SortableContainer from '../Sortable/SortableContainer';
import Text from '../Text/Text';
import PillGroup from '../PillGroup/PillGroup';



interface SlotConfig {
    type: string;
    name: string;
    displayName: string;
    config?: Record<string, any>;
}

interface DynamicListProps {
    className?: string;
    containerStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    startSlots?: SlotConfig[];
    endSlots?: SlotConfig[];
    data: any[];
    apiBaseUrl?: string;
    baseUrl?: string;
    endpoint?: string;
    displayMode?: 'row' | 'grid';
    noContentText?: string;
    noContentIcon?: string;
    forceRefresh?: boolean;
    isSortable?: boolean;
    onOrderChange?: (newOrder: any[]) => void;
    onItemChangeSuccess?: (item: any, fieldName: string, newValue: boolean) => void;
    onItemChangeError?: (item: any, fieldName: string, error: any) => void;
}

const DynamicList: React.FC<DynamicListProps> = ({
    className,
    containerStyle,
    itemStyle,
    startSlots = [],
    endSlots = [],
    baseUrl,
    data = [],
    isSortable = false,
    onOrderChange,
    onItemChangeSuccess,
    onItemChangeError,

}) => {
    const [items, setItems] = useState(data);

    const handleSortEnd = (newOrder: any[]) => {
        setItems(newOrder);
        if (onOrderChange) onOrderChange(newOrder);
    };

    const resolveSlotComponent: any = (type: string) => {
        switch (type) {
            case 'text':
                return Text;
            case 'icon':
                return Icon;
            case 'color':
                return Color;
            case 'playPause':
                return PlayPauseButton;
            case 'lockToggle':
                return LockToggleButton;
            case 'thumbnail':
                return Thumbnail;
            case 'interpolatedContent':
                return InterpolatedContent;
            case 'stepTracker':
                return StepTracker;
            case 'actionsMenu':
                return ActionsMenuButton;
            case 'pillGroup':
                return PillGroup;
            default:
                throw new Error(`Unknown slot type: ${type}`);
        }
    };

    const renderItem = (item: any, index: number) => (
        <div
            key={`item-${item.id}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '5px',
                marginTop: '5px',
                ...itemStyle,
            }}
            className="precooked-dynamic-list-item"
        >
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isSortable && (
                    <SortableHandle>
                        <Icon name="drag" />
                    </SortableHandle>
                )}
                {startSlots.map((slot, slotIndex) => {
                    const SlotComponent = resolveSlotComponent(slot.type);
                    const resolvedSrc = (baseUrl && item[slot.name]) ? `${baseUrl}${item[slot.name]}` : slot?.config?.defaultImage;

                    return (
                        <div key={slotIndex} style={{ padding: 5 }}>
                            <SlotComponent
                                src={resolvedSrc}
                                pills={item[slot.name]}
                                steps={item[slot.name]}
                                value={item[slot.name]}
                                name={slot.name}
                                extraData={item}
                                onChangeSuccess={(newValue: any) =>
                                    onItemChangeSuccess?.(item, slot.name, newValue)
                                }
                                onChangeError={(error: any) =>
                                    onItemChangeError?.(item, slot.name, error)
                                }
                                {...slot.config}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {endSlots.map((slot, slotIndex) => {
                    const SlotComponent = resolveSlotComponent(slot.type);
                    const resolvedSrc = (baseUrl && item[slot.name]) ? `${baseUrl}${item[slot.name]}` : slot?.config?.defaultImage;
                    return (
                        <div key={slotIndex} style={{ padding: 5 }}>
                            <SlotComponent
                                src={resolvedSrc}
                                pills={item[slot.name]}
                                steps={item[slot.name]}
                                value={item[slot.name]}
                                name={slot.name}
                                extraData={item}
                                onChangeSuccess={(newValue: any) =>
                                    onItemChangeSuccess?.(item, slot.name, newValue)
                                }
                                onChangeError={(error: any) =>
                                    onItemChangeError?.(item, slot.name, error)
                                }
                                {...slot.config}
                            />
                        </div>
                    );
                })}

            </div>
        </div>
    );

    return isSortable ? (
        <SortableContainer
            items={items}
            onSortEnd={handleSortEnd}
            renderItem={renderItem}
            useDragHandle={true}
        />
    ) : (
        <div style={containerStyle} className={className}>
            {items.map((item, index) => renderItem(item, index))}
        </div>
    );
};

export default DynamicList;
