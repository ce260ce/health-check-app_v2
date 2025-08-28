// src/components/todo/DndBoard.jsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TodoGroupSection } from "./TodoGroupSection";
import { TodoItem } from "../list/TodoItem";

export function DndBoard({ categories, view, items, setItems, updateItem, removeItem }) {
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        const srcGroup = source.droppableId;
        const destGroup = destination.droppableId;

        setItems((prev) => {
            const movedId = String(draggableId);
            const next = prev.map((it) => ({ ...it }));

            const movedItem = next.find((it) => String(it.id) === movedId);
            if (!movedItem) return prev;

            // グループ更新（同一グループ内でもOK）
            movedItem.group = destGroup;

            // 目的グループ内の並びを作り直す
            const destItems = next.filter((it) => (it.group || "未分類") === destGroup);
            const destIds = destItems.map((it) => String(it.id)).filter((id) => id !== movedId);
            // 空のグループでも index 0 に挿入できる
            const destIndex = Math.max(0, Math.min(destination.index, destIds.length));
            destIds.splice(destIndex, 0, movedId);

            const applyOrderFor = (groupName, ids) => {
                const orderMap = new Map(ids.map((id, idx) => [id, idx]));
                for (const it of next) {
                    const key = String(it.id);
                    if ((it.group || "未分類") === groupName && orderMap.has(key)) {
                        it.order = orderMap.get(key);
                    }
                }
            };

            applyOrderFor(destGroup, destIds);

            // 別グループから来た場合、元グループも再採番して“空き番”を解消
            if (srcGroup !== destGroup) {
                const srcIds = next
                    .filter((it) => (it.group || "未分類") === srcGroup)
                    .map((it) => String(it.id));
                applyOrderFor(srcGroup, srcIds);
            }

            return next;
        });
    };

    // ドロップ領域のスタイル（空でも掴みやすい受け皿）
    const dropZoneStyle = (isOver) => ({
        minHeight: 48,             // ★ 空でもドロップ可能
        padding: 4,
        border: "1px dashed #e5e7eb",
        borderRadius: 8,
        background: isOver ? "#f0f9ff" : "#fafafa",
    });

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            {categories.map((group) => (
                <Droppable key={group} droppableId={group} direction="vertical">
                    {(provided, snapshot) => (
                        <TodoGroupSection title={group}>
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={dropZoneStyle(snapshot.isDraggingOver)}
                            >
                                {(view[group] || []).map((it, index) => (
                                    <Draggable key={String(it.id)} draggableId={String(it.id)} index={index}>
                                        {(prov) => (
                                            <div
                                                ref={prov.innerRef}
                                                {...prov.draggableProps}
                                                {...prov.dragHandleProps}
                                                style={{ marginBottom: 8, ...prov.draggableProps.style }}
                                            >
                                                <TodoItem
                                                    item={it}
                                                    onToggle={() =>
                                                        updateItem(it.id, {
                                                            done: !items.find((x) => String(x.id) === String(it.id))?.done,
                                                        })
                                                    }
                                                    onPatch={(patch) => updateItem(it.id, patch)}
                                                    onRemove={() => removeItem(it.id)}
                                                    categories={categories}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        </TodoGroupSection>
                    )}
                </Droppable>
            ))}
        </DragDropContext>
    );
}
