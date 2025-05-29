export const BulletinCard = ({
  bulletin,
  names,
  onMarkAsRead,
  onEditClick,
  onDeleteClick,
  isEditing,
  editForm,
  onEditChange,
  onEditSubmit,
  onCancelEdit
}) => {
  const handleToggle = async (name, checked) => {
    try {
      await onMarkAsRead(bulletin._id, name, checked)
    } catch (err) {
      console.error('チェック更新失敗:', err)
    }
  }

  // description に含まれる URL を自動でリンクにする関数
  const descriptionWithLinks = (text) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g)
    return parts.map((part, i) =>
      part.match(/^https?:\/\//)
        ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
            {part}
          </a>
        )
        : part
    )
  }

  if (isEditing) {
    return (
      <form
        onSubmit={onEditSubmit}
        style={{
          border: '1px solid #aaa',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <input
          name="title"
          value={editForm.title}
          onChange={onEditChange}
          placeholder="タイトル"
          required
        />
        <textarea
          name="description"
          value={editForm.description}
          onChange={onEditChange}
          placeholder="内容"
          rows={3}
          required
        />
        <input
          type="date"
          name="visibleUntil"
          value={editForm.visibleUntil}
          onChange={onEditChange}
          required
        />
        <input
          name="postedBy"
          value={editForm.postedBy}
          onChange={onEditChange}
          placeholder="投稿者"
          required
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button className="btn" type="submit">💾 保存</button>
          <button className="btn" type="button" onClick={onCancelEdit}>キャンセル</button>
        </div>
      </form>
    )
  }

  // 通常表示
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: 12,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '320px',
        backgroundColor: '#fff',
      }}
    >
      <h4>{bulletin.title}</h4>
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {descriptionWithLinks(bulletin.description)}
      </p>

      {bulletin.files?.length > 0 && (
        <div>
          <strong>📎 添付ファイル:</strong>
          <ul>
            {bulletin.files.map((f, i) => (
              <li key={i}>
                <a href={`${process.env.REACT_APP_API_URL}${f.url}`} target="_blank" rel="noopener noreferrer">
                  {f.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <strong>投稿者:</strong> {bulletin.postedBy}
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>掲示期限:</strong> {new Date(bulletin.visibleUntil).toLocaleDateString()}
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>確認状況:</strong>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {names.map(name => (
            <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!bulletin.checkedBy?.[name]}
                onChange={(e) => handleToggle(name, e.target.checked)}
              />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 編集・削除ボタン */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          className="btn"
          style={{ backgroundColor: '#bbb', color: '#555' }}
          onClick={() => onEditClick(bulletin)}
        >
          ✏️ 編集
        </button>
        <button
          className="btn"
          style={{ backgroundColor: '#eee', color: '#555' }}
          onClick={() => onDeleteClick(bulletin._id)}
        >
          🗑 削除
        </button>
      </div>
    </div>
  )
}
