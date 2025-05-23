// hooks/useMemberNames.js
import { useEffect, useState } from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL

export const useMemberNames = () => {
  const [names, setNames] = useState([])

  const fetchNames = async () => {
    const res = await axios.get(`${API}/api/names`)
    setNames(res.data.map(n => n.name))
  }

  useEffect(() => {
    fetchNames()
  }, [])

  return names
}
