// src/components/Layout.js
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import './Layout.css'

const API = process.env.REACT_APP_API_URL;

export function Layout() {
    const [collapsed, setCollapsed] = useState(false)
    const [commonLinks, setCommonLinks] = useState([])
    const location = useLocation()

    const fetchCommonLinks = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/links`)
            const data = await res.json()
            setCommonLinks((data || []).filter(l => l.forAll))
        } catch (e) {
            console.error('Failed to load links', e)
        }
    }, [])

    useEffect(() => {
        // 初回読み込み
        fetchCommonLinks()

        // LinkBuilderPage からの更新通知を購読
        const handler = () => fetchCommonLinks()
        window.addEventListener('links:update', handler)

        // 画面が戻ってきた時などにも更新したい場合（任意）
        const visHandler = () => { if (!document.hidden) fetchCommonLinks() }
        document.addEventListener('visibilitychange', visHandler)

        return () => {
            window.removeEventListener('links:update', handler)
            document.removeEventListener('visibilitychange', visHandler)
        }
    }, [fetchCommonLinks])

    // ルート遷移時に軽く再読込したい場合（任意）
    useEffect(() => { fetchCommonLinks() }, [location.pathname, fetchCommonLinks])

    return (
        <div className="layout-container">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <button className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? '▶' : '◀'}
                </button>

                {!collapsed && (
                    <>
                        <h2>
                            <Link to="/" className="app-title">DailyApp</Link>
                        </h2>

                        <ul className="menu-section">
                            <li><Link to="/">📋ホーム</Link></li>
                            <li><Link to="/today">📅 本日の記録</Link></li>
                            <li><Link to="/tasks">📝 タスク一覧</Link></li>
                            <li><Link to="/bulletin">📢 掲示板</Link></li>
                            <li><Link to="/link-builder">🔗 リンク作成</Link></li>
                            <li><Link to="/todo">📋個人用TODOリスト</Link></li>
                        </ul>
                        {/* ▼ ここから共通リンク表示 */}
                        {commonLinks.length > 0 && (
                            <ul className="menu-section">
                                <h3>共通リンク</h3>
                                {commonLinks.map(link => (
                                    <li key={link._id}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.url}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <ul className="menu-section admin-section">
                            <h3>管理者向けメニュー</h3>
                            <li><Link to="/list">📊 一覧表示</Link></li>
                            <li><Link to="/names">👥 メンバー管理</Link></li>
                            <li><Link to="/admin">⚙️ 一括登録</Link></li>
                        </ul>


                    </>
                )}
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}
