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
    setTitle('')
    setDescription('')
    setVisibleUntil('')
    setFiles([])
    setPostedBy('')
    onPost()
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>新しい掲示を投稿</h3>
      <div>
        <label>タイトル:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required/>
      </div>
      <div>
        <label>内容:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required/>
      </div>
      <div>
        <label>掲示期限:</label>
        <input type="date" value={visibleUntil} onChange={(e) => setVisibleUntil(e.target.value)} required/>
      </div>
      <div>
        <label>ファイル添付:</label>
        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])}/>
      </div>
      <div>
        <label>投稿者:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {names.map(name => (
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
      <button type="submit" disabled={!postedBy}>投稿する</button>
    </form>
  )
}
