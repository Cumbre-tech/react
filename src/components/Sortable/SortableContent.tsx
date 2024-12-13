import React, { useState } from 'react';
import SortableElement from './SortableElement';
import { useDragHandleContext } from './DragHandleContext';

interface SortableContentProps {
    items: any[];
    onSortEnd: (newOrder: any[]) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
    useDragHandle: boolean;
}

const SortableContent: React.FC<SortableContentProps> = ({
    items,
    onSortEnd,
    renderItem,
    useDragHandle,
}) => {
    const { isPressingDragHandle } = useDragHandleContext();
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const handleDragStart = (index: number, event: React.DragEvent) => {
        if (useDragHandle && !isPressingDragHandle) {
            console.log('Drag blocked: the drag handle is not being pressed');
            event.preventDefault();
            return;
        }
        setDraggingIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggingIndex === null || draggingIndex === index) return;

        const updatedItems = [...items];
        const [movedItem] = updatedItems.splice(draggingIndex, 1);
        updatedItems.splice(index, 0, movedItem);

        setDraggingIndex(index);
        onSortEnd(updatedItems);
    };

    const handleDrop = () => {
        setDraggingIndex(null);
    };

    return (
        <div>
            {items.map((item, index) => (
                <SortableElement
                    key={index}
                    index={index}
                    onDragStart={(event) => handleDragStart(index, event)}
                    onDragOver={() => handleDragOver(index)}
                    onDrop={handleDrop}
                    useDragHandle={useDragHandle}
                >
                    {renderItem(item, index)}
                </SortableElement>
            ))}
        </div>
    );
};

export default SortableContent;
