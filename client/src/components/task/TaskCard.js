import React from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const shortenUrl = (url) => {
    try {
        const { hostname } = new URL(url);
        return `${hostname}/...`;
    } catch {
        return url;
    }
};

export const TaskCard = ({
    task,
    names,
    today,
    onToggleCheck,
    onEditClick,
    onDeleteClick,
    isEditing,
    editForm,
    onEditChange,
    onEditSubmit,
    onCancelEdit,
    onDeleteFileClick,
    onCompleteClick,
    filterName,
}) => {
    const due = new Date(task.dueDate);
    const start = new Date(task.startDate);
    const todayOnly = new Date(today);
    due.setHours(0, 0, 0, 0);
    todayOnly.setHours(0, 0, 0, 0);
    const diff = (due - todayOnly) / (1000 * 60 * 60 * 24);
    const displayNames = filterName ? [filterName] : names;

    return (
        <div
            style={{
                width: "96%",
                border: '1px solid #ccc',
                padding: 10,
                borderRadius: 8,
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: task.isCompleted ? '#dcdcdc' : 'white',
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
            }}
        >
            {isEditing ? (
                <form
                    onSubmit={onEditSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                    <input name="title" value={editForm.title} onChange={onEditChange} placeholder="タイトル" />
                    <textarea name="description" value={editForm.description} onChange={onEditChange} rows={3} />
                    <input type="date" name="startDate" value={editForm.startDate} onChange={onEditChange} />
                    <input type="date" name="dueDate" value={editForm.dueDate} onChange={onEditChange} />

                    {task.files && task.files.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                            <strong>📎 添付ファイル:</strong>
                            <ul style={{ marginLeft: 0, paddingLeft: 20 }}>
                                {task.files.map((file, i) => (
                                    <li key={i} style={{ marginBottom: 4 }}>
                                        <a
                                            href={`${API_URL}${file.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: 'blue' }}
                                        >
                                            {file.fileName}
                                        </a>
                                        <button
                                            type="button"
                                            className="btn"
                                            style={{
                                                marginLeft: 8,
                                                backgroundColor: '#eee',
                                                color: '#555',
                                                fontSize: '0.75rem'
                                            }}
                                            onClick={() => onDeleteFileClick(task._id, file.fileName)}
                                        >
                                            🗑 削除
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <input type="file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" multiple />

                    <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
                        <button className="btn" type="submit">💾 保存</button>
                        <button className="btn" type="button" onClick={onCancelEdit}>キャンセル</button>
                    </div>
                </form>
            ) : (
                <>
                    <h2 style={{ color: 'black' }}>{task.title}</h2>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                        {task.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                            part.match(/^https?:\//) ? (
                                <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: "blue" }}>
                                    {shortenUrl(part)}
                                </a>
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.9rem', marginTop: 6 }}>
                        <div style={{ display: 'flex' }}>
                            <span style={{ width: 60, display: 'inline-block' }}>開始日:</span>
                            <span>{start.toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <span style={{ width: 60, display: 'inline-block' }}>納期:</span>
                            <span>{due.toLocaleDateString()}</span>
                        </div>
                    </div>

                    {Array.isArray(task.files) && task.files.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                            <h4>📎 添付ファイル:</h4>
                            <ul style={{ paddingLeft: 20 }}>
                                {task.files.map((f, i) => (
                                    <li key={i}>
                                        <a
                                            href={`${API_URL}${f.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {f.fileName || 'ファイルを開く'}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!task.isCompleted && (
                        <>
                            <h4>チェックリスト：</h4>
                            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                {displayNames.map(name => {
                                    const checked = task.checkedBy?.[name] || false;
                                    let nameColor = 'black';
                                    if (!checked) {
                                        if (diff <= 0) nameColor = 'red';
                                        else if (diff <= 3) nameColor = 'orange';
                                    }
                                    return (
                                        <li key={name}>
                                            <label style={{ color: nameColor, fontWeight: !checked ? 'bold' : 'normal' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => onToggleCheck(task._id, name, e.target.checked)}
                                                />
                                                {name}
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            {task.isCompleted ? (
                                <button className="edit-btn" onClick={() => onCompleteClick(task._id)}>↩️ 戻す</button>
                            ) : (
                                <button className="edit-btn" onClick={() => onCompleteClick(task._id)}>✅ 完了済みタスクへ移動</button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="edit-btn"
                                style={{ backgroundColor: '#bbb', color: '#555' }}
                                onClick={() => onEditClick(task)}
                            >
                                ✏️ 編集
                            </button>
                            <button
                                className="edit-btn"
                                style={{ backgroundColor: '#eee', color: '#555' }}
                                onClick={() => onDeleteClick(task._id)}
                            >
                                🗑 削除
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
