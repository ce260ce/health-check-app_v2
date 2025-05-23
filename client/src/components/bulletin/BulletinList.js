import { BulletinCard } from './BulletinCard'

export const BulletinList = ({ bulletins, names, onMarkAsRead }) => {
  const now = new Date()
  const current = bulletins.filter(b => new Date(b.visibleUntil) >= now)
  const expired = bulletins.filter(b => new Date(b.visibleUntil) < now)

  return (
    <div>
      <h3>📌 表示中の掲示</h3>
      {current.length === 0 ? <p>表示中の掲示はありません</p> : current.map(b => (
        <BulletinCard key={b._id} bulletin={b} names={names} onMarkAsRead={onMarkAsRead}/>
      ))}

      <h3 style={{ marginTop: 40 }}>🗃️ 過去の掲示</h3>
      {expired.length === 0 ? <p>過去の掲示はありません</p> : expired.map(b => (
        <BulletinCard key={b._id} bulletin={b} names={names} onMarkAsRead={onMarkAsRead}/>
      ))}
    </div>
  )
}
