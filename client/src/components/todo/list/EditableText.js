import { useEffect, useState } from "react";

/** Enterで「確定」だけ、追加はしない */
export function EditableText({ value, onChange, placeholder, style }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    useEffect(() => setDraft(value), [value]);

    const commit = () => {
        setEditing(false);
        const v = (draft || "").trim();
        if (v !== value) onChange(v);
    };

    if (!editing) {
        return (
            <span
                onClick={() => setEditing(true)}
                style={{ cursor: "text", ...style }}
                title="クリックで編集"
            >
                {value || <span style={{ color: "#9ca3af" }}>{placeholder || "（未設定）"}</span>}
            </span>
        );
    }

    return (
        <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => (e.key === "Enter" ? commit() : null)}
            style={{ ...style }}
        />
    );
}
