export const BulletinCard = ({ bulletin, names, onMarkAsRead }) => {
  const handleToggle = async (name, checked) => {
    try {
      await onMarkAsRead(bulletin._id, name, checked)
    } catch (err) {
      console.error('チェック更新失敗:', err)
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 20 }}>
      <h4>{bulletin.title}</h4>
      <p>{bulletin.description}</p>
      {bulletin.files?.length > 0 && (
        <div>
          <strong>添付ファイル:</strong>
          <ul>
            {bulletin.files.map((f, i) => (
              <li key={i}>
                <a href={f.url} target="_blank" rel="noopener noreferrer">
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
    </div>
  )
}