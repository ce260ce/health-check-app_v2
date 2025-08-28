// src/pages/TodoPersonalPage.js
import { useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { TODO_STORAGE_KEY } from "../utils/todoStorage";
import { TodoPersonalView } from "../components/todo/view/TodoPersonalView";

const CATEGORY_KEY = "personal.todo.categories.v1";
const DEFAULT_CATEGORIES = ["未分類"];
const FORMS_COLLAPSED_KEY = "personal.todo.formsCollapsed.v1";
const DEFAULT_GROUP = "未分類";

export function TodoPersonalPage() {
    const [items, setItems] = useLocalStorage(TODO_STORAGE_KEY, []);
    const [categories, setCategories] = useLocalStorage(
        CATEGORY_KEY,
        DEFAULT_CATEGORIES
    );
    const [formsCollapsed, setFormsCollapsed] = useLocalStorage(
        FORMS_COLLAPSED_KEY,
        false
    );

    // 表示用のグルーピング（カテゴリ順に従う）
    const view = useMemo(() => {
        const grouped = {};
        for (const g of categories) grouped[g] = [];
        for (const it of items) {
            const g = it.group || DEFAULT_GROUP;
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push(it);
        }
        for (const g of Object.keys(grouped)) {
            grouped[g].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        return grouped;
    }, [items, categories]);

    const toggleForms = () => setFormsCollapsed((v) => !v);

    const addCategory = (name) => {
        const n = (name || "").trim();
        if (!n) return;
        if (categories.includes(n)) return;
        setCategories([...categories, n]);
    };

    const removeCategory = (name) => {
        if (!name || name === DEFAULT_GROUP) {
            alert("「未分類」は削除できません。");
            return;
        }
        if (!categories.includes(name)) return;

        setCategories((prev) => prev.filter((c) => c !== name));
        // そのカテゴリのアイテムは「未分類」へ退避
        setItems((prev) =>
            prev.map((it) => (it.group === name ? { ...it, group: DEFAULT_GROUP } : it))
        );
    };

    const addItem = (task) => {
        const group = task.group || DEFAULT_GROUP;
        const nextOrder =
            view[group] && view[group].length > 0
                ? Math.max(...view[group].map((x) => x.order ?? 0)) + 1
                : 0;

        setItems((prev) => [
            ...prev,
            {
                ...task,
                group,
                order: nextOrder,
                done: false,
            },
        ]);
    };

    const updateItem = (id, patch) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    // ★ 並べ替えコールバック（ドラッグ＆ドロップ／▲▼ボタンから呼ばれる）
    const onReorderCategories = (nextOrder) => {
        // 1) 重複除去しつつ順序を維持
        const seen = new Set();
        const unique = nextOrder.filter((c) => {
            if (seen.has(c)) return false;
            seen.add(c);
            return true;
        });

        // 2) 既存カテゴリで nextOrder に含まれなかったものを末尾に補完
        for (const c of categories) {
            if (!seen.has(c)) unique.push(c);
        }

        // 3) 空保護（理論上空にならないが保険）
        if (unique.length === 0) unique.push(DEFAULT_GROUP);

        setCategories(unique);
    };

    return (
        <TodoPersonalView
            title="📋 個人用TODOリスト"
            subtitle="他の人には見られない、自分だけのTODOリスト"
            formsCollapsed={formsCollapsed}
            onToggleForms={toggleForms}
            categories={categories}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            items={items}
            view={view}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            setItems={setItems}
            // ★ 追加
            onReorderCategories={onReorderCategories}
        />
    );
}
