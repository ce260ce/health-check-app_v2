// src/components/todo/TodoForm.js
import { useState } from "react";
import "./TodoForm.css";

export function TodoForm({ onAdd, categories }) {
    const [text, setText] = useState("");
    const [notes, setNotes] = useState("");
    const [refUrl, setRefUrl] = useState("");
    const [due, setDue] = useState("");
    const [priority, setPriority] = useState("中");
    const [group, setGroup] = useState(categories?.[0] || "未分類");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        onAdd({
            id: String(Date.now()),
            title: text.trim(),
            notes: notes.trim(),
            refUrl: refUrl.trim(),
            due,
            priority,
            group,
            createdAt: new Date().toISOString(),
        });

        // reset
        setText("");
        setNotes("");
        setRefUrl("");
        setDue("");
        setPriority("中");
        setGroup(categories?.[0] || "未分類");
    };

    // Enterで送信されるのを防ぎたい入力があればここで制御（任意）
    const preventEnterSubmit = (e) => {
        if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
    };

    return (
        <form className="todo-card field-stack" onSubmit={handleSubmit}>
            {/* タイトルが必要なら表示。外側で見出しを置いているなら削ってOK */}
            {/* <h3 className="todo-title">📝 タスク追加</h3> */}

            {/* 上段：やること・メモ */}
            <div className="row-stack">
                <input
                    type="text"
                    className="input"
                    placeholder="やること"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={preventEnterSubmit}
                />
                <textarea
                    className="textarea"
                    placeholder="メモ"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    onKeyDown={preventEnterSubmit}
                />
            </div>

            {/* 中段：1行で URL / 日付 / 優先度 / カテゴリ */}
            <div className="row-4">
                <input
                    type="url"
                    className="input"
                    placeholder="参照URL"
                    value={refUrl}
                    onChange={(e) => setRefUrl(e.target.value)}
                />
                <input
                    type="date"
                    className="input"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                />
                <select
                    className="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="高">🔥 高</option>
                    <option value="中">⏺ 中</option>
                    <option value="低">⚪ 低</option>
                </select>
                <select
                    className="select"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {/* 下段：追加ボタン */}
            <button type="submit" className="btn-primary">＋ 追加</button>
        </form>
    );
}
