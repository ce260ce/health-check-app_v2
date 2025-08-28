// src/components/todo/TodoForm.js
import { useState, useEffect } from "react";
import "./TodoForm.css";

export function TodoForm({ onAdd, categories }) {
    const [text, setText] = useState("");
    const [notes, setNotes] = useState("");
    const [refUrl, setRefUrl] = useState("");
    const [due, setDue] = useState("");
    // ★ 内部値は英語enumに統一
    const [priority, setPriority] = useState("medium");
    const [group, setGroup] = useState(categories?.[0] || "未分類");

    // カテゴリ追加/削除で先頭が変わった時の保護
    useEffect(() => {
        if (!categories?.length) return;
        if (!categories.includes(group)) setGroup(categories[0]);
    }, [categories, group]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        onAdd({
            id: String(Date.now()),
            title: text.trim(),
            notes: notes.trim(),
            refUrl: refUrl.trim(),
            due,
            priority, // ★ "high" | "medium" | "low"
            group,
            createdAt: new Date().toISOString(),
        });

        // reset
        setText("");
        setNotes("");
        setRefUrl("");
        setDue("");
        setPriority("medium");
        setGroup(categories?.[0] || "未分類");
    };

    const preventEnterSubmit = (e) => {
        if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
    };

    return (
        <form className="todo-card field-stack" onSubmit={handleSubmit}>
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
                {/* ★ valueは英語enum */}
                <select
                    className="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">🔥 高</option>
                    <option value="medium">⏺ 中</option>
                    <option value="low">⚪ 低</option>
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

            <button type="submit" className="btn-primary">＋ 追加</button>
        </form>
    );
}
