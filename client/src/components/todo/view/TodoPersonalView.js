import "./TodoPersonalView.css";
import { TodoForm } from "../form/TodoForm";
import { CategoryForm } from "../category/CategoryForm";
import { DndBoard } from "../board/DndBoard";

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

                        {/* ★ 既存カテゴリの一覧（削除ボタン付き） */}
                        <ul className="todo-category-list">
                            {categories.map((c) => (
                                <li key={c} className="todo-category-pill">
                                    <span className="todo-category-name">{c}</span>
                                    {c !== "未分類" && (
                                        <button
                                            type="button"
                                            className="todo-category-del"
                                            title="カテゴリを削除"
                                            onClick={() => onRemoveCategory(c)}
                                        >
                                            削除
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
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
