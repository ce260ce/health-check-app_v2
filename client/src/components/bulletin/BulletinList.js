import { BulletinCard } from './BulletinCard'

export const BulletinList = ({
  bulletins,
  names,
  onMarkAsRead,
  onEditClick,
  onDeleteClick,
  editBulletinId,
  editForm,
  onEditChange,
  onEditSubmit,
  onCancelEdit,
}) => {
  const now = new Date()
  const current = bulletins.filter(b => new Date(b.visibleUntil) >= now)
  const expired = bulletins.filter(b => new Date(b.visibleUntil) < now)

  return (
    <div>
      <h3>📌 表示中の掲示</h3>
      {current.length === 0 ? (
        <p>表示中の掲示はありません</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {current.map(b => (
            <BulletinCard
              key={b._id}
              bulletin={b}
              names={names}
              onMarkAsRead={onMarkAsRead}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              isEditing={editBulletinId === b._id}
              editForm={editForm}
              onEditChange={onEditChange}
              onEditSubmit={onEditSubmit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}

      <h3>🗃️ 過去の掲示</h3>
      {expired.length === 0 ? (
        <p>過去の掲示はありません</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {expired.map(b => (
            <BulletinCard
              key={b._id}
              bulletin={b}
              names={names}
              onMarkAsRead={onMarkAsRead}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              isEditing={editBulletinId === b._id}
              editForm={editForm}
              onEditChange={onEditChange}
              onEditSubmit={onEditSubmit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
