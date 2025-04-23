"use client";

import React, { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_URL = "http://localhost:8080/api/sections";

const SortableItem = ({ id }: { id: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 my-2 bg-gray-100 border border-gray-300 rounded cursor-grab min-h-[100px]"
        >
            Section {id}
        </div>
    );
};

const SortableList = () => {
    const [items, setItems] = useState<number[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch all sections
    const fetchSections = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (Array.isArray(data)) {
                // Sắp xếp theo vị trí
                const sorted = data.sort((a, b) => a.position - b.position);
                setItems(sorted.map((s) => s.id));
            }
        } catch (err) {
            console.error("Error fetching sections:", err);
        }
    };

    // Add a new section
    const handleAddSection = async () => {
        try {
            const newId = Math.max(0, ...items) + 1;
            const newPosition = items.length;

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: newId, position: newPosition }),
            });

            const data = await res.json();
            if (data.success) {
                await fetchSections(); // Refresh after adding
            } else {
                alert("Thêm section thất bại: " + data.error);
            }
        } catch (err) {
            console.error("Error adding section:", err);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        const newItems = arrayMove(items, oldIndex, newIndex);

        setItems(newItems);

        // Gửi từng request PUT để cập nhật position mới
        try {
            await Promise.all(
                newItems.map((id, index) =>
                    fetch(`${API_URL}/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ position: index }),
                    })
                )
            );
            console.log("Vị trí các section đã được cập nhật.");
        } catch (err) {
            console.error("Lỗi khi cập nhật vị trí:", err);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div className="container mx-auto py-4">
            <button
                onClick={handleAddSection}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ➕ Thêm section
            </button>

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
