// src/components/todo/view/TodoPersonalView.jsx
import React from "react";
import "./TodoPersonalView.css";
import { TodoForm } from "../form/TodoForm";
import { CategoryForm } from "../category/CategoryForm";
import { DndBoard } from "../board/DndBoard";

/**
 * props:
 * - title, subtitle
 * - formsCollapsed, onToggleForms
 * - categories: string[]
 * - onAddCategory(name: string)
 * - onRemoveCategory(name: string)
 * - items, view, onAddItem, onUpdateItem, onRemoveItem, setItems
 * - onReorderCategories(nextOrder: string[])  ← ★ 追加
 */
export function TodoPersonalView({
    title,
    subtitle,
    formsCollapsed,
    onToggleForms,
    categories,
    onAddCategory,
    onRemoveCategory,
    items,
    view,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
    setItems,
    onReorderCategories, // ★
}) {
    return (
        <div className="todo-page">
            <div className="todo-title-row">
                <h1 className="todo-title">{title}</h1>
                {subtitle ? <span className="todo-subtitle">{subtitle}</span> : null}
            </div>

            <div className="todo-toggle-bar">
                <button
                    onClick={onToggleForms}
                    className="todo-toggle-btn"
                    title={formsCollapsed ? "フォームを表示" : "フォームを隠す"}
                >
                    {formsCollapsed ? "▶ フォームを表示" : "◀ フォームを隠す"}
                </button>
                <div className="todo-toggle-msg">
                    {formsCollapsed
                        ? "フォーム非表示中"
                        : "上段を折りたたんで作業スペースを広げられます"}
                </div>
            </div>

            {!formsCollapsed && (
                <div className="todo-forms-row">
                    <aside className="todo-card todo-card-left">
                        <h3 style={{ marginTop: 0 }}>📝 タスク追加</h3>
                        <TodoForm onAdd={onAddItem} categories={categories} />
                    </aside>

                    <aside className="todo-card todo-card-right">
                        <h4 className="todo-category-title">📂 カテゴリ追加</h4>
                        <CategoryForm onAdd={onAddCategory} />

                        {/* ▼ 並べ替え対応カテゴリリスト */}
                        <DraggableCategoryList
                            categories={categories}
                            onRemoveCategory={onRemoveCategory}
                            onReorderCategories={onReorderCategories}
                        />
                    </aside>
                </div>
            )}

            <main className="todo-board">
                <DndBoard
                    categories={categories}
                    view={view}
                    items={items}
                    setItems={setItems}
                    updateItem={onUpdateItem}
                    removeItem={onRemoveItem}
                />
            </main>
        </div>
    );
}

/**
 * ドラッグ&ドロップでカテゴリ順を変更するミニコンポーネント。
 * ▲▼ボタンでも並べ替え可能（キーボード/タッチ操作向け）。
 * 「未分類」を固定したい場合は isLocked の条件を true に。
 */
function DraggableCategoryList({
    categories,
    onRemoveCategory,
    onReorderCategories,
}) {
    const [dragIndex, setDragIndex] = React.useState(null);
    const draggingRef = React.useRef(null);

    // 例: name === "未分類" なら固定
    const isLocked = (name) => false;

    const moveItem = (from, to) => {
        if (to < 0 || to >= categories.length || from === to) return;
        const next = [...categories];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onReorderCategories?.(next);
    };

    const handleDragStart = (index) => (e) => {
        if (isLocked(categories[index])) {
            e.preventDefault();
            return;
        }
        setDragIndex(index);
        draggingRef.current = index;
        e.dataTransfer.effectAllowed = "move";
        // Firefox 対策：setData が必要
        e.dataTransfer.setData("text/plain", String(index));
    };

    const handleDragOver = (index) => (e) => {
        e.preventDefault(); // drop 可能化
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (index) => (e) => {
        e.preventDefault();
        const from =
            draggingRef.current != null
                ? draggingRef.current
                : Number(e.dataTransfer.getData("text/plain"));
        const to = index;
        setDragIndex(null);
        draggingRef.current = null;

        if (Number.isNaN(from) || from == null || from === to) return;
        if (isLocked(categories[to])) return;
        moveItem(from, to);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        draggingRef.current = null;
    };

    return (
        <ul className="todo-category-list" style={{ userSelect: "none" }}>
            {categories.map((c, i) => {
                const locked = isLocked(c);
                return (
                    <li
                        key={c}
                        className={`todo-category-pill${locked ? " is-locked" : ""}`}
                        draggable={!locked}
                        onDragStart={handleDragStart(i)}
                        onDragOver={handleDragOver(i)}
                        onDrop={handleDrop(i)}
                        onDragEnd={handleDragEnd}
                        aria-grabbed={dragIndex === i}
                        title={locked ? "固定のため移動不可" : "ドラッグして並べ替え"}
                    >
                        <span className="todo-category-name">{c}</span>

                        <div className="todo-category-actions">
                            <button
                                type="button"
                                className="todo-category-move"
                                onClick={() => moveItem(i, i - 1)}
                                title="上へ"
                                aria-label={`${c} を上へ`}
                                disabled={locked || i === 0}
                            >
                                ▲
                            </button>
                            <button
                                type="button"
                                className="todo-category-move"
                                onClick={() => moveItem(i, i + 1)}
                                title="下へ"
                                aria-label={`${c} を下へ`}
                                disabled={locked || i === categories.length - 1}
                            >
                                ▼
                            </button>

                            {!locked && c !== "未分類" && (
                                <button
                                    type="button"
                                    className="todo-category-del"
                                    title="カテゴリを削除"
                                    onClick={() => onRemoveCategory(c)}
                                >
                                    削除
                                </button>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
