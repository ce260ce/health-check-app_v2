import './AdminPage.css';

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPage() {
    const [names, setNames] = useState([]);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        axios.get("http://localhost:5000/api/names")
            .then(res => setNames(res.data.map(n => n.name)));
    }, []);

    const toggleSelection = (name) => {
        setSelected(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    const handleSubmit = async () => {
        for (const name of selected) {
            await axios.post("http://localhost:5000/api/health", {
                name,
                condition: "年休",
                task: "",
                ky: "",
                date: todayStr,
            });
        }
        alert("年休を保存しました！");
        setSelected([]);
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif", position: "relative", fontSize: '20px' }}>
            {/* ← 左上に固定された戻るボタン */}
            <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
                ← 戻る
            </button>

            <h1>👤 年休一括管理</h1>
            <p>今日の日付：{todayStr}</p>

            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {names.map((name) => (
                    <li key={name}>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selected.includes(name)}
                                onChange={() => toggleSelection(name)}
                            />
                            {name}
                        </label>
                    </li>
                ))}
            </ul>

            <button className="btn" onClick={handleSubmit} style={{ marginTop: "20px" }}>
                年休一括送信
            </button>
        </div>
    );
}

export default AdminPage;