// src/components/todo/SortToolbar.jsx
export function SortToolbar({ query, setQuery, filter, setFilter, onApplySort, onClearCompleted }) {
    return (
        <div
            style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 10,
                flexWrap: "wrap",
            }}
        >
            <input
                placeholder="検索（やること／メモ／URL）"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ minWidth: 260 }}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">すべて</option>
                <option value="active">未完了</option>
                <option value="done">完了</option>
            </select>

            <label style={{ marginLeft: 6 }}>並び替え適用：</label>
            <select defaultValue="order" onChange={(e) => onApplySort(e.target.value)}>
                <option value="order">（現在の順番を維持）</option>
                <option value="createdDesc">新しい順</option>
                <option value="dueAsc">期限が近い順</option>
                <option value="dueDesc">期限が遠い順</option>
                <option value="priorityDesc">優先度（高→低）</option>
                <option value="priorityAsc">優先度（低→高）</option>
            </select>

            <button onClick={onClearCompleted}>完了を一括削除</button>
        </div>
    );
}
