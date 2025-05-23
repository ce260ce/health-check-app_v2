// components/bulletin/MainBulletinCard.js

export const MainBulletinCard = ({ bulletin, userName, onMarkAsRead }) => {
  const handleClick = () => {
    // 明示的に checked: true を渡す
    onMarkAsRead(bulletin._id, userName, true)
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 16 }}>
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

      <button onClick={handleClick}>
        👁 見た
      </button>
    </div>
  )
}
