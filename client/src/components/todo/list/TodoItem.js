// src/components/todo/TodoItem.jsx
import { useState } from "react";

const badgeStyle = (p) => {
    const base = {
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
    };
    if (p === "high") return { ...base, background: "#fee2e2", color: "#991b1b" }; // 赤
    if (p === "low") return { ...base, background: "#e0e7ff", color: "#3730a3" };  // 青
    return { ...base, background: "#dcfce7", color: "#166534" };                    // 緑(mid)
};

export function TodoItem({ item, onToggle, onPatch, onRemove, categories }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({
        ...item,
        priority: item.priority || "mid",
        group: item.group || "未分類",
    });

    const startEdit = () => {
        setDraft({
            ...item,
            priority: item.priority || "mid",
            group: item.group || "未分類",
        });
        setEditing(true);
    };
    const cancelEdit = () => {
        setEditing(false);
        setDraft({
            ...item,
            priority: item.priority || "mid",
            group: item.group || "未分類",
        });
    };
    const saveEdit = () => {
        const t = (draft.title || "").trim();
        if (!t) return;
        onPatch({ ...draft, title: t });
        setEditing(false);
    };

    if (editing) {
        const catOptions = Array.from(
            new Set([...(categories || []), draft.group || "未分類"])
        );
        return (
            <div
                style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    padding: 10,
                    background: "#fdfdfd",
                    display: "grid",
                    gap: 6,
                }}
            >
                <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="タイトル"
                />
                <input
                    value={draft.notes || ""}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    placeholder="メモ"
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        type="date"
                        value={draft.due || ""}
                        onChange={(e) => setDraft({ ...draft, due: e.target.value })}
                        title="期限"
                    />
                    <input
                        value={draft.refUrl || ""}
                        onChange={(e) => setDraft({ ...draft, refUrl: e.target.value })}
                        placeholder="参照URL"
                        title="参照URL"
                        style={{ minWidth: 220 }}
                    />
                    <select
                        value={draft.priority || "mid"}
                        onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
                        title="優先度"
                    >
                        <option value="high">高</option>
                        <option value="mid">中</option>
                        <option value="low">低</option>
                    </select>
                    <select
                        value={draft.group || "未分類"}
                        onChange={(e) => setDraft({ ...draft, group: e.target.value })}
                        title="カテゴリー"
                    >
                        {catOptions.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={saveEdit}>💾 保存</button>
                    <button onClick={cancelEdit}>キャンセル</button>
                </div>
            </div>
        );
    }

    const priority = item.priority || "mid";
    return (
        <div
            style={{
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: 10,
                background: item.done ? "#f4fff5" : "#fff",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 10,
                alignItems: "center",
            }}
        >
            <input
                type="checkbox"
                checked={item.done}
                onChange={onToggle}
                title="完了/未完了"
            />
            <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <div
                        style={{
                            fontWeight: 600,
                            textDecoration: item.done ? "line-through" : "none",
                            color: item.done ? "#6b7280" : "#111",
                        }}
                    >
                        {item.title}
                    </div>
                    <span style={badgeStyle(priority)}>
                        {priority === "high" ? "高" : priority === "low" ? "低" : "中"}
                    </span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>📂 {item.group || "未分類"}</span>
                </div>

                {(item.notes || item.due || item.refUrl) && (
                    <div
                        style={{
                            fontSize: 13,
                            color: "#374151",
                            marginTop: 4,
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        {item.notes && <span>📝 {item.notes}</span>}
                        {item.due && <span>⏰ {item.due}</span>}
                        {item.refUrl && (
                            <a
                                href={item.refUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.refUrl}
                            >
                                🔗 参照
                            </a>
                        )}
                    </div>
                )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={startEdit}>✏️ 編集</button>
                <button onClick={onToggle}>{item.done ? "↩ 未完了" : "✅ 完了"}</button>
                <button onClick={onRemove} style={{ color: "crimson" }}>
                    🗑 削除
                </button>
            </div>
        </div>
    );
}
