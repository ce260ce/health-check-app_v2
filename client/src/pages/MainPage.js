import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useQuery from '../hooks/useQuery'
import { useFormState } from '../hooks/useFormState'
import { useHealthRecords } from '../hooks/useHealthRecords'
import { useHealthSubmit } from '../hooks/useHealthSubmit'
import { useInitializeHealthForm } from '../hooks/useInitializeHealthForm'
import { HealthForm } from '../components/HealthForm'
import { TodayRecordTable } from '../components/TodayRecordTable'
import { TaskNotification } from '../components/task/TaskNotification'
import { LinkSection } from '../components/LinkSection'
import { MainBulletinCard } from '../components/bulletin/MainBulletinCard'

const API = process.env.REACT_APP_API_URL

export const MainPage = ({ onOpenNameList }) => {
  const query = useQuery()
  const nameFromQuery = query.get('name') || ''
  const navigate = useNavigate()

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  const form = useFormState(nameFromQuery, todayStr)
  const { records, names, postRecord } = useHealthRecords(year, month)
  const { handleSubmit } = useHealthSubmit(form, postRecord)

  const [bulletins, setBulletins] = useState([])

  useInitializeHealthForm({ form, records, nameFromQuery, todayStr })

  useEffect(() => {
    if (!nameFromQuery && window.location.pathname === '/') {
      navigate('/select')
    }
  }, [nameFromQuery, navigate])

  useEffect(() => {
    const fetchBulletins = async () => {
      const res = await axios.get(`${API}/api/bulletins`)
      const now = new Date()
      const filtered = res.data.filter(
        b => new Date(b.visibleUntil) >= now && !b.checkedBy?.[nameFromQuery],
      )
      setBulletins(filtered)
    }
    if (nameFromQuery) fetchBulletins()
  }, [nameFromQuery])

  const handleMarkAsRead = async (id, name) => {
    await axios.post(`${API}/api/bulletins/${id}/read`, { name, checked: true })
    setBulletins(prev => prev.filter(b => b._id !== id))
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <button className="back-btn" onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← 戻る
      </button>

      {nameFromQuery ? (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', marginBottom: '24px' }}>
            {/* 左：HealthForm（体調〜朝食まで） */}
            <div style={{ flex: 1 }}>
              <HealthForm
                {...form}
                onSubmit={handleSubmit}
                memberOptions={names}
                records={records}
                nameFromQuery={nameFromQuery}
                todayStr={todayStr}
              />
            </div>

            {/* 右：掲示板（未読） */}
            <div style={{ flex: 1 }}>
              {bulletins.length > 0 && (
                <div>
                  <h3>📢 未読の掲示</h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    {bulletins.slice(0, 4).map((b) => (
                      <MainBulletinCard
                        key={b._id}
                        bulletin={b}
                        userName={nameFromQuery}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>

                  {bulletins.length > 4 && (
                    <p style={{ fontStyle: 'italic', color: '#555', marginTop: '8px' }}>
                      その他 {bulletins.length - 4} 件の未読の掲示があります
                    </p>
                  )}
                </div>
              )}
            </div>


          </div>


          <TaskNotification nameFromQuery={nameFromQuery} />

          <hr style={{ margin: '20px 0' }} />

          <LinkSection nameFromQuery={nameFromQuery} />

          <hr style={{ margin: '40px 0' }} />

          <TodayRecordTable names={names} records={records} todayStr={todayStr} />

          <button className="btn" onClick={() => navigate('/list')}>📊 一覧表示</button>
        </>
      ) : (
        <p>読み込み中...</p>
      )
      }
    </div >
  )
}

export default MainPage
