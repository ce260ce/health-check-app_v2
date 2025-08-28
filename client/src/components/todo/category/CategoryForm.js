import { useState } from "react";
import "./CategoryForm.css";

export function CategoryForm({ onAdd }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setName("");
    };

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                placeholder="カテゴリ名"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="btn-primary">追加</button>
        </form>
    );
}
