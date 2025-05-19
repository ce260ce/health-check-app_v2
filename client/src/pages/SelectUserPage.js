import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SelectUserPage() {
    const [names, setNames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/names")
            .then(res => setNames(res.data.map(n => n.name)));
    }, []);

    const handleSelect = (name) => {
        navigate(`/?name=${encodeURIComponent(name)}`);
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h1>📋 メニュー</h1>

            {/* 🔝 機能ボタン（上部） */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "40px"
            }}>
                <button className="btn" onClick={() => navigate("/today")}>
                    📅 本日の記録
                </button>
                <button className="btn" onClick={() => navigate("/list")}>
                    📊 一覧表示
                </button>
                <button className="btn" onClick={() => navigate("/names")}>
                    👥 メンバー管理
                </button>
                <button className="btn" onClick={() => navigate("/admin")}>
                    ⚙️ 一括年休登録
                </button>
            </div>

            <hr style={{ margin: "30px 0" }} />

            {/* 🔻 ユーザー選択（下部） */}
            <h1>📋 体調/作業 入力ページ</h1>
            <h2>👤 ユーザーを選択してください</h2>
            <ul style={{
                listStyle: "none",
                paddingLeft: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "flex-start"
            }}>
                {names.map((name) => (
                    <li key={name}>
                        <button className="btn-user" onClick={() => handleSelect(name)}>
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SelectUserPage;
