import { useState, useEffect } from 'react'
import axios from 'axios'
import { BulletinForm } from '../components/bulletin/BulletinForm'
import { BulletinList } from '../components/bulletin/BulletinList'
import { useMemberNames } from '../hooks/useMemberNames'
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL

export const BulletinPage = () => {
  const [bulletins, setBulletins] = useState([])
  const names = useMemberNames()
  const navigate = useNavigate()

  const fetchBulletins = async () => {
    try {
      const res = await axios.get(`${API}/api/bulletins`)
      setBulletins(res.data)
    } catch (err) {
      console.error('掲示取得エラー:', err)
    }
  }

  const handleMarkAsRead = async (id, name, checked) => {
    try {
      await axios.post(`${API}/api/bulletins/${id}/read`, {
        name,
        checked,
      })
      await fetchBulletins() // 更新直後に再取得して反映
    } catch (err) {
      console.error('チェック更新エラー:', err)
    }
  }

  useEffect(() => {
    fetchBulletins()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <button
        className="back-btn"
        onClick={() => navigate('/')}
        style={{ marginBottom: 20 }}
      >
        ← 戻る
      </button>
      <h2>📢 掲示板</h2>
      <BulletinForm names={names} onPost={fetchBulletins}/>
      <BulletinList
        bulletins={bulletins}
        names={names}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  )
}

export default BulletinPage
