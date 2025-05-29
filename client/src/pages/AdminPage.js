import './AdminPage.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export const AdminPage = () => {
    const [names, setNames] = useState([]);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        axios.get(`${API}/api/names`)
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
            await axios.post(`${API}/api/health`, {
                name,
                condition: "年休",
                task: "年休",
                ky: "年休",
                date: todayStr,
            });
        }
        alert("年休を保存しました！");
        setSelected([]);
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif", position: "relative", fontSize: '20px' }}>
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
};
