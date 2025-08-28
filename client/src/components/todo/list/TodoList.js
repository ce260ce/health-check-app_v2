// src/components/todo/TodoList.jsx
import { TodoItem } from "./TodoItem";

export function TodoList({ items, onToggle, onPatch, onRemove, categories }) {
    return (
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {items.map((it) => (
                <li key={it.id} style={{ marginBottom: 8 }}>
                    <TodoItem
                        item={it}
                        onToggle={() => onToggle(it.id)}
                        onPatch={(patch) => onPatch(it.id, patch)}
                        onRemove={() => onRemove(it.id)}
                        categories={categories}
                    />
                </li>
            ))}
        </ul>
    );
}
