// components/LinkSection.js
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL

export const LinkSection = ({ nameFromQuery }) => {
  const [links, setLinks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API}/api/links`)
      .then(res => {
        const allLinks = res.data || []
        const filtered = allLinks.filter(link =>
          link.forAll || (nameFromQuery && link.forName === nameFromQuery),
        )
        setLinks(filtered)
      })
      .catch(err => {
        console.warn('リンク取得エラー', err)
        setLinks([])
      })
  }, [nameFromQuery])

  if (!Array.isArray(links) || links.length === 0) return null

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>各種リンク</h2>
        <button
          className="btn"
          onClick={() => navigate('/link-builder')}
          style={{ marginLeft: 30, fontSize: '0.85em', padding: '6px 12px' }}
        >
          ＋ リンク作成ページへ
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        {links.map(link => (
          <button
            key={link._id}
            className="btn"
            onClick={() => window.open(link.url, '_blank')}
            style={{ marginRight: 10, marginTop: 6 }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LinkSection
