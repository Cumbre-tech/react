import React from 'react';
import { useDragHandleContext } from './DragHandleContext';

interface SortableElementProps {
    index: number;
    useDragHandle: boolean;

    onDragStart: (event: React.DragEvent) => void;
    onDragOver: () => void;
    onDrop: () => void;
    children: React.ReactNode;
}

const SortableElement: React.FC<SortableElementProps> = ({
    useDragHandle = false,

    onDragStart,
    onDragOver,
    onDrop,
    children,
}) => {
    const { isPressingDragHandle } = useDragHandleContext();
    return (
        <div
            draggable={!useDragHandle || (useDragHandle && isPressingDragHandle)}
            onDragStart={onDragStart}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver();
            }}
            onDrop={onDrop}
            style={{
                cursor: useDragHandle ? 'default' : 'grab',
            }}
        >
            {children}
        </div>
    );
};

export default SortableElement;
