"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const API_URL = "https://api.wedly.info/api/sections";
interface Section { id: number; position: number; title?: string; image?: string; note?: string; }


const SortableItem = ({
    section,
    onDelete,
    onDuplicate
}: {
    section: Section;
    onDelete: (id: number) => void;
    onDuplicate: (id: number) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const [title, setTitle] = useState(section.title || "");
    const [note, setNote] = useState(section.note || "");

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${API_URL}/${section.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, note })
            });

            const data = await res.json();
            if (!res.ok) {
                alert("Cập nhật thất bại: " + data.error);
            } else {
                alert("Cập nhật thành công");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            alert("Lỗi khi cập nhật section.");
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-4 my-2 bg-gray-100 border border-gray-300 rounded min-h-[100px]"
        >
            <div className="flex items-start justify-between cursor-move" {...attributes} {...listeners}>
                <h3 className="text-lg font-semibold">📌 Section {section.id}</h3>
                {section.image && (
                    <img src={section.image} alt="Section" className="ml-4 w-24 h-16 object-cover rounded" />
                )}
            </div>

            <div className="mt-2">
                <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề"
                />
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú"
                />
            </div>

            <div className="mt-2 flex gap-2">
                <button
                    onClick={handleUpdate}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Cập nhật
                </button>
                <button
                    onClick={() => onDuplicate(section.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Duplicate
                </button>
                <button
                    onClick={() => onDelete(section.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Xoá
                </button>
            </div>
        </div>
    );
};

const SortableList = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xoá section này?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            const data = await response.json();

            if (response.ok) {
                await fetchSections();
            } else {
                alert("Xoá section thất bại: " + data.error);
            }
        } catch (err) {
            console.error("Lỗi khi xoá section:", err);
            alert("Lỗi khi xoá section.");
        }
    };

    const handleAddSection = async () => {
        try {
            const newId = Math.max(0, ...sections.map((s) => s.id)) + 1;
            const newPosition = sections.length;

            const fakeData = {
                id: newId,
                position: newPosition,
                title: `Section ${newId}`,
                image: `https://picsum.photos/100/60?random=${newId}`,
                note: `Ghi chú cho section ${newId}`
            };

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fakeData)
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

    const handleDuplicate = async (id: number) => {
        const newId = Math.max(0, ...sections.map((s) => s.id)) + 1;
        try {
            const res = await fetch(`${API_URL}/${id}/duplicate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newId })
            });

            const data = await res.json();
            if (res.ok) {
                await fetchSections();
            } else {
                alert("Duplicate thất bại: " + data.error);
            }
        } catch (err) {
            console.error("Lỗi khi duplicate section:", err);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        const newSections = arrayMove(sections, oldIndex, newIndex);

        setSections(newSections);

        try {
            await Promise.all(
                newSections.map((section, index) =>
                    fetch(`${API_URL}/${section.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ position: index })
                    })
                )
            );
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
                className="px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Thêm section
            </button>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    {sections.map((section) => (
                        <SortableItem
                            key={section.id}
                            section={section}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default SortableList;