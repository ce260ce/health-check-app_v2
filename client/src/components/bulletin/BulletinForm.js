import { useState } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL

export const BulletinForm = ({ names, onPost }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibleUntil, setVisibleUntil] = useState('')
  const [files, setFiles] = useState([])
  const [postedBy, setPostedBy] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('visibleUntil', visibleUntil)
    formData.append('postedBy', postedBy)
    for (const file of files) {
      formData.append('files', file)
    }
    await axios.post(`${API}/api/bulletins`, formData)
    await onPost()
    setTitle('')
    setDescription('')
    setVisibleUntil('')
    setFiles([])
    setPostedBy('')
  }

  const handleFileDelete = (index) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}
    >
      <h3>📢 新しい掲示を投稿</h3>

      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        required
        style={{ width: '30%' }}
      />

      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="内容"
        rows={3}
        required
        style={{ width: '30%' }}
      />

      {/* 📅 掲載期限ラベル付き日付入力 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="visibleUntil"><strong>📅 掲載期限（日付）</strong></label>
        <input
          type="date"
          id="visibleUntil"
          name="visibleUntil"
          value={visibleUntil}
          onChange={(e) => setVisibleUntil(e.target.value)}
          required
          style={{ width: 'fit-content' }}
        />
      </div>


      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '30%' }}>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f9f9f9',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              <span>📎 {f.name}</span>
              <button
                type="button"
                className="btn"
                onClick={() => handleFileDelete(i)}
                style={{ backgroundColor: '#e5e7eb', color: '#000', padding: '2px 8px' }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 📎 添付ファイル */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="file"><strong>📎 添付ファイル</strong></label>
        <input
          type="file"
          id="file"
          name="files"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          style={{ width: '30%' }}
        />
      </div>

      <div>
        <label><strong>👤 投稿者</strong></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
          {names.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => setPostedBy(name)}
              style={{
                backgroundColor: postedBy === name ? '#007bff' : '#f0f0f0',
                color: postedBy === name ? '#fff' : '#000',
                padding: '4px 10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn"
        type="submit"
        disabled={!postedBy}
        style={{ width: 'fit-content', alignSelf: 'start' }}
      >
        登録する
      </button>
    </form>
  )
}
