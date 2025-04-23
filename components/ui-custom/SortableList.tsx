"use client";

import React, { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const SortableItem = ({ id }: { id: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 my-2 bg-gray-100 border border-gray-300 rounded cursor-grab min-h-[400px]"
        >
            section {id}
        </div>
    );
};

const SortableList = () => {
    const [items, setItems] = useState<number[]>([1, 2, 3]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        setItems((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    // const handleDragEnd = async (event: DragEndEvent) => {
    //     const { active, over } = event;
    //     if (!over || active.id === over.id) return;

    //     const oldIndex = items.indexOf(active.id as number);
    //     const newIndex = items.indexOf(over.id as number);
    //     const newItems = arrayMove(items, oldIndex, newIndex);

    //     // Cập nhật state trong frontend
    //     setItems(newItems);

    //     // Gửi yêu cầu POST để cập nhật vị trí trong cơ sở dữ liệu
    //     try {
    //         const response = await fetch('http://localhost:3000/update-sections', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ items: newItems }), // Gửi danh sách id theo thứ tự mới
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             console.log('Sections updated successfully!');
    //         } else {
    //             console.log('Failed to update sections:', data.error);
    //         }
    //     } catch (error) {
    //         console.log('Error while updating sections:', error);
    //     }
    // };


    return (
        <div className="container mx-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((id) => (
                        <SortableItem key={id} id={id} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default SortableList;
