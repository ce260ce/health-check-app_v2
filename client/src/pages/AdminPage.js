import './AdminPage.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export const AdminPage = () => {
    const [names, setNames] = useState([]);
    const [selected, setSelected] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("年休");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API}/api/names`)
            .then(res => setNames(res.data.map(n => n.name)))
            .catch(() => setNames([]));
    }, []);

    const toggleSelection = (name) => {
        setSelected(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    const getDateRangeExcludingWeekends = (start, end) => {
        const range = [];
        let current = new Date(start);
        const last = new Date(end);

        while (current <= last) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
                range.push(current.toISOString().split("T")[0]);
            }
            current.setDate(current.getDate() + 1);
        }

        return range;
    };

    const showMessage = (text) => {
        setMessage(text);
        // 3秒後に消す
        setTimeout(() => setMessage(""), 3000);
    };

    const handleSubmit = async () => {
        setMessage(""); // 前回のメッセージをクリア

        if (!startDate || !endDate) {
            showMessage("⚠️ 開始日と終了日を入力してください。");
            return;
        }
        if (selected.length === 0) {
            showMessage("⚠️ 名前を1人以上選択してください。");
            return;
        }

        const dates = getDateRangeExcludingWeekends(startDate, endDate);
        if (dates.length === 0) {
            showMessage("⚠️ 土日以外の登録日がありません。");
            return;
        }

        try {
            for (const name of selected) {
                for (const date of dates) {
                    await axios.post(`${API}/api/health`, {
                        name,
                        condition: reason,
                        task: reason,
                        ky: reason,
                        date,
                    });
                }
            }

            showMessage(`✅ 「${reason}」として登録しました！`);
            setSelected([]);
            setStartDate("");
            setEndDate("");
        } catch (err) {
            showMessage("❌ 登録に失敗しました。");
        }
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif", fontSize: '20px' }}>
            <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
                ← 戻る
            </button>

            <h1>📅 一括登録</h1>

            {/* 期間選択 */}
            <div style={{ marginBottom: 16 }}>
                <label>開始日：</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label style={{ marginLeft: 20 }}>終了日：</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {/* 種類選択 */}
            <div style={{ marginBottom: 20 }}>
                <label>登録種別：</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option value="年休">年休</option>
                    <option value="出張">出張</option>
                    <option value="離業">離業</option>
                    <option value="応援">応援</option>
                </select>
            </div>

            {/* メンバー選択 */}
            <p>対象メンバー：</p>
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

            {/* 登録ボタン */}
            <button className="btn" onClick={handleSubmit} style={{ marginTop: 20 }}>
                {reason} を一括登録（{startDate} ～ {endDate}）
            </button>

            {/* ✅ メッセージ表示（3秒後に自動で消える） */}
            {message && (
                <p style={{ marginTop: 15, fontSize: "16px", color: message.startsWith("✅") ? "green" : "red" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AdminPage;
