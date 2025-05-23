// components/TaskNotification.js
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL

export const TaskNotification = ({ nameFromQuery }) => {
  const [incompleteTaskCount, setIncompleteTaskCount] = useState({
    total: 0,
    dueTodayOrPast: 0,
    dueSoon: 0,
    other: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchIncompleteTasks = async () => {
      try {
        const res = await fetch(`${API}/api/tasks`)
        const tasks = await res.json()
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const incomplete = tasks.filter(task => !task.checkedBy?.[nameFromQuery])

        let dueTodayOrPast = 0
        let dueSoon = 0
        let other = 0

        incomplete.forEach(task => {
          const due = new Date(task.dueDate)
          due.setHours(0, 0, 0, 0)
          const diff = (due - now) / (1000 * 60 * 60 * 24)

          if (diff <= 0) {
            dueTodayOrPast++
          } else if (diff <= 3) {
            dueSoon++
          } else {
            other++
          }
        })

        setIncompleteTaskCount({
          total: incomplete.length,
          dueTodayOrPast,
          dueSoon,
          other,
        })
      } catch (err) {
        console.error('タスク取得エラー:', err)
      }
    }

    if (nameFromQuery) {
      fetchIncompleteTasks()
    }
  }, [nameFromQuery])

  if (incompleteTaskCount.total === 0) return null

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: 8,
        maxWidth: '600px',
        margin: '20px 0',
      }}
    >
      <p style={{ margin: 0, color: '#856404', lineHeight: 1.6 }}>
        ⚠️ {nameFromQuery} さんのタスク状況：
        <br/>
        {incompleteTaskCount.dueTodayOrPast > 0 && (
          <>🔴 納期が当日または過ぎているタスク：{incompleteTaskCount.dueTodayOrPast} 件<br/></>
        )}
        {incompleteTaskCount.dueSoon > 0 && (
          <>🟡 納期が残り3日以内のタスク：{incompleteTaskCount.dueSoon} 件<br/></>
        )}
        {incompleteTaskCount.other > 0 && (
          <>⚪ その他の未完了タスク：{incompleteTaskCount.other} 件</>
        )}
      </p>
      <button
        className="btn"
        style={{
          marginTop: 12,
          padding: '8px 16px',
          fontSize: '1rem',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onClick={() => navigate(`/tasks?name=${encodeURIComponent(nameFromQuery)}`)}
      >
        タスクページへ移動
      </button>
    </div>
  )
}

export default TaskNotification
