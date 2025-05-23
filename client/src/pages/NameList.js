import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL

export const NameList = () => {
  const [newName, setNewName] = useState('')
  const [names, setNames] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const navigate = useNavigate()

  const fetchNames = async () => {
    const res = await axios.get(`${API}/api/names`)
    setNames(res.data)
    setSelectedIds([]) // 初期化
  }

  useEffect(() => {
    fetchNames()
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    await axios.post(`${API}/api/names`, { name: newName })
    setNewName('')
    fetchNames()
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    await Promise.all(selectedIds.map((id) => axios.delete(`${API}/api/names/${id}`)))
    fetchNames()
  }

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    )
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', fontSize: '20px' }}>
      <button className="back-btn" onClick={handleBack}>← 戻る</button>
      <h2>👤 メンバーリスト管理</h2>

      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="氏名を入力"
        style={{
          fontSize: '18px',
          padding: '8px 12px',
          width: '250px',
          marginRight: '10px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
      <button className="btn" onClick={handleAdd}>追加</button>

      <ul style={{ marginTop: '20px', paddingLeft: '20px' }}>
        {names.map((n) => (
          <li
            key={n._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              gap: '10px',
            }}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(n._id)}
              onChange={() => toggleSelection(n._id)}
              style={{ width: '24px', height: '24px' }} // ✅ チェックボックスを大きく
            />
            <span>{n.name}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <button
          className="btn"
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
          style={{
            opacity: selectedIds.length === 0 ? 0.5 : 1,
            cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          削除
        </button>
      </div>
    </div>
  )
}
