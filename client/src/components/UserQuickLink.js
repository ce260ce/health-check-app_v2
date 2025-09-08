import { useEffect, useState, useCallback } from 'react'

export function UserQuickLink({
    apiBase = process.env.REACT_APP_API_URL || '',
    storageKey = 'selectedUserName',
    openInNewTab = false,
    targetBase = '',
    targetPath = '/',
}) {
    const [names, setNames] = useState([])
    const [selected, setSelected] = useState('')

    const fetchNames = useCallback(async () => {
        try {
            const res = await fetch(`${apiBase}/api/names`)
            const data = await res.json()
            setNames((data || []).map(n => n.name).filter(Boolean))
        } catch (e) {
            console.error('Failed to load names', e)
        }
    }, [apiBase])

    useEffect(() => {
        fetchNames()
        const saved = localStorage.getItem(storageKey)
        if (saved) setSelected(saved)
    }, [fetchNames, storageKey])

    const handleChange = (e) => {
        const v = e.target.value
        setSelected(v)
        if (v) localStorage.setItem(storageKey, v)
        else localStorage.removeItem(storageKey)
    }


    const buildUrl = (base, path, name) => {
        const b = (base || '').replace(/\/+$/, '')        // 末尾スラッシュ削除
        const p = ('/' + (path || '').replace(/^\/+/, ''))// 先頭スラッシュ1つに正規化
        const u = `${b}${p}` || '/'                       // 両方空なら '/'
        const sep = u.includes('?') ? '&' : '?'           // 既にクエリがある場合も考慮
        return `${u}${sep}name=${encodeURIComponent(name)}`
    }

    const goUserPage = () => {
        if (!selected) return
        const url = buildUrl(targetBase, targetPath, selected)
        if (openInNewTab) window.open(url, '_blank', 'noopener,noreferrer')
        else window.location.href = url
    }

    return (
        <div className="user-quicklink" style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="userSelect" className="user-quicklink-label">👤 ユーザーを選択</label>

            <select
                id="userSelect"
                value={selected}
                onChange={handleChange}
                style={{ padding: '6px 8px', borderRadius: 6 }}
            >
                <option value="">-- 未選択 --</option>
                {names.map((n) => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>

            <button
                className="btn btn-compact"
                onClick={goUserPage}
                disabled={!selected}
                title={selected ? `ユーザーページへ（${selected}）` : 'ユーザーを選択してください'}
                style={{ opacity: selected ? 1 : 0.6 }}
            >
                ➡ ユーザーページへ
            </button>
        </div>
    )
}
