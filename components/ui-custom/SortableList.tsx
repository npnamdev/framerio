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

interface Section {
    id: number;
    position: number;
    title?: string;
    image?: string;
    note?: string;
}

const SortableItem = ({ section, onDelete }: { section: Section; onDelete: (id: number) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
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
            className="p-4 my-2 bg-gray-100 border border-gray-300 rounded min-h-[100px] flex justify-between items-center"
        >
            <div>
                <h3 className="text-lg font-semibold">📌 {section.title || `Section ${section.id}`}</h3>
                <p className="text-sm text-gray-600 italic">{section.note}</p>
                {section.image && (
                    <img src={section.image} alt="Section" className="mt-2 w-24 h-16 object-cover rounded" />
                )}
            </div>
            <button
                onClick={() => onDelete(section.id)} // Truyền đúng ID để xoá section
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 z-100"
            >
                Xoá
            </button>
        </div>
    );
};

const SortableList = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Lấy danh sách section từ API
    const fetchSections = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (Array.isArray(data)) {
                const sorted = data.sort((a, b) => a.position - b.position);
                setSections(sorted);
            }
        } catch (err) {
            console.error("Lỗi khi fetch sections:", err);
        }
    };

    // Xoá section
    const handleDelete = async (id: number) => {
        console.log("Xoá section với ID:", id);

        if (!confirm("Bạn có chắc chắn muốn xoá section này?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                await fetchSections(); // làm mới danh sách
            } else {
                alert("Xoá section thất bại: " + data.error);
            }
        } catch (err) {
            console.error("Lỗi khi xoá section:", err);
            alert("Lỗi khi xoá section.");
        }
    };

    // Thêm section mới với dữ liệu giả
    const handleAddSection = async () => {
        try {
            const newId = Math.max(0, ...sections.map(s => s.id)) + 1;
            const newPosition = sections.length;

            const fakeData = {
                id: newId,
                position: newPosition,
                title: `Section ${newId}`,
                image: "https://picsum.photos/100/60?random=" + newId,
                note: `Ghi chú cho section ${newId}`,
            };

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fakeData),
            });

            const data = await res.json();
            if (data.success) {
                await fetchSections();
            } else {
                alert("Thêm section thất bại: " + data.error);
            }
        } catch (err) {
            console.error("Lỗi khi thêm section:", err);
        }
    };

    // Xử lý sự kiện kết thúc kéo thả
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex(s => s.id === active.id);
        const newIndex = sections.findIndex(s => s.id === over.id);
        const newSections = arrayMove(sections, oldIndex, newIndex);

        setSections(newSections);

        try {
            await Promise.all(
                newSections.map((section, index) =>
                    fetch(`${API_URL}/${section.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ position: index }),
                    })
                )
            );
            console.log("Cập nhật vị trí thành công.");
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
                Thêm section
            </button>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {sections.map((section) => (
                        <SortableItem key={section.id} section={section} onDelete={handleDelete} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default SortableList;
