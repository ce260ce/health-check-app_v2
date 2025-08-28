import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export const LinkBuilderPage = () => {
    const navigate = useNavigate();
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    const [links, setLinks] = useState([]);
    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [personalLabel, setPersonalLabel] = useState("");
    const [personalUrl, setPersonalUrl] = useState("");
    const [commonEditingId, setCommonEditingId] = useState(null);
    const [personalEditingId, setPersonalEditingId] = useState(null);
    const [expandedLinkIds, setExpandedLinkIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedLinkIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const fetchLinks = async () => {
        const res = await axios.get(`${API}/api/links`);
        setLinks(res.data || []);
        window.dispatchEvent(new Event('links:update'));
    };

    useEffect(() => {
        axios.get(`${API}/api/names`).then((res) => {
            setNames(res.data.map((n) => n.name));
        });
        fetchLinks();
    }, []);

    const handleCommonSubmit = async () => {
        if (!label || !url) return alert("入力してください");

        if (commonEditingId) {
            await axios.put(`${API}/api/links/${commonEditingId}`, {
                label,
                url,
                forAll: true,
                forName: null,
            });
        } else {
            await axios.post(`${API}/api/links`, {
                label,
                url,
                forAll: true,
                forName: null,
            });
        }

        fetchLinks();
        setLabel("");
        setUrl("");
        setCommonEditingId(null);
    };

    const handlePersonalSubmit = async () => {
        if (!selectedName || !personalLabel || !personalUrl)
            return alert("入力してください");

        if (personalEditingId) {
            await axios.put(`${API}/api/links/${personalEditingId}`, {
                label: personalLabel,
                url: personalUrl,
                forAll: false,
                forName: selectedName,
            });
        } else {
            await axios.post(`${API}/api/links`, {
                label: personalLabel,
                url: personalUrl,
                forAll: false,
                forName: selectedName,
            });
        }

        setPersonalLabel("");
        setPersonalUrl("");
        setPersonalEditingId(null);
        fetchLinks();
    };

    const handleEdit = (link) => {
        if (link.forAll) {
            setLabel(link.label);
            setUrl(link.url);
            setCommonEditingId(link._id);
            setPersonalEditingId(null);
        } else {
            setSelectedName(link.forName);
            setPersonalLabel(link.label);
            setPersonalUrl(link.url);
            setPersonalEditingId(link._id);
            setCommonEditingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("削除しますか？")) return;
        await axios.delete(`${API}/api/links/${id}`);
        fetchLinks();
        window.dispatchEvent(new Event('links:update'));
    };

    const renderLinkCards = (targetLinks) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {targetLinks.map((link) => {
                const isExpanded = expandedLinkIds.includes(link._id);
                return (
                    <div
                        key={link._id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "12px",
                            width: "300px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <strong>{link.label}</strong>

                        <span
                            onClick={() => toggleExpand(link._id)}
                            style={{
                                fontSize: "0.75em",
                                color: "#666",
                                cursor: "pointer",
                                padding: "2px 4px",
                                alignSelf: "flex-start",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                marginTop: "6px",
                                marginBottom: "4px",
                            }}
                        >
                            {isExpanded ? "URLを隠す" : "URLを表示"}
                        </span>

                        {isExpanded && (
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    wordBreak: "break-all",
                                    fontSize: "0.9em",
                                    marginBottom: "8px",
                                }}
                            >
                                {link.url}
                            </a>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                            <button onClick={() => handleEdit(link)} style={{ fontSize: "0.8em" }}>✏️</button>
                            <button onClick={() => handleDelete(link._id)} style={{ fontSize: "0.8em", color: "red" }}>🗑</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div style={{ padding: 20 }}>
            <button className="back-btn" onClick={() => navigate("/")}>← 戻る</button>

            <h2>🔗 共通リンク作成</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 300 }}>
                <input placeholder="ボタン名" value={label} onChange={(e) => setLabel(e.target.value)} />
                <input placeholder="リンクURL" value={url} onChange={(e) => setUrl(e.target.value)} />
                <button onClick={handleCommonSubmit}>
                    {commonEditingId ? "更新" : "＋ 共通リンクを作成"}
                </button>
            </div>

            <h3 style={{ marginTop: 20 }}>📌 登録済みリンク（共通）</h3>
            {renderLinkCards(links.filter((l) => l.forAll))}

            <hr style={{ margin: "40px 0" }} />

            <h2>👤 個別リンク作成</h2>
            <h3>ユーザーを選択してください。</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {names.map((name) => (
                    <button
                        key={name}
                        className={selectedName === name ? "btn btn-active" : "btn"}
                        onClick={() => {
                            setSelectedName(name);
                            setPersonalLabel("");
                            setPersonalUrl("");
                            setCommonEditingId(null);
                            setPersonalEditingId(null);
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {selectedName && (
                <>
                    <h2 style={{ marginTop: 20 }}>🔗 {selectedName} さん用リンク作成</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 300 }}>
                        <input
                            placeholder="ボタン名"
                            value={personalLabel}
                            onChange={(e) => setPersonalLabel(e.target.value)}
                        />
                        <input
                            placeholder="リンクURL"
                            value={personalUrl}
                            onChange={(e) => setPersonalUrl(e.target.value)}
                        />
                        <button onClick={handlePersonalSubmit}>
                            {personalEditingId ? "更新" : "＋ 個別リンクを作成"}
                        </button>
                    </div>

                    <h3 style={{ marginTop: 20 }}>📌 登録済みリンク（{selectedName}）</h3>
                    {renderLinkCards(links.filter((l) => l.forName === selectedName))}
                </>
            )}
        </div>
    );
};
