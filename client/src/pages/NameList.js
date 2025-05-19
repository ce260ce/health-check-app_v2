// src/pages/NameList.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NameList() {
    const [newName, setNewName] = useState("");
    const [names, setNames] = useState([]);
    const navigate = useNavigate(); // ← 追加！

    const fetchNames = async () => {
        const res = await axios.get("http://localhost:5000/api/names");
        setNames(res.data);
    };

    useEffect(() => {
        fetchNames();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await axios.post("http://localhost:5000/api/names", { name: newName });
        setNewName("");
        fetchNames();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/names/${id}`);
        fetchNames();
    };

    const handleBack = () => {
        navigate(-1); // 1つ前のページに戻る（React Router v6/v7）
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", fontSize: '20px' }}>
            <button className="back-btn" onClick={handleBack}>← 戻る</button>
            <h2>👤 メンバーリスト管理</h2>

            <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="氏名を入力"
                style={{
                    fontSize: "18px",
                    padding: "8px 12px",
                    width: "250px",
                    marginRight: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                }}
            />
            <button className="btn" onClick={handleAdd}>追加</button>

            <ul style={{ marginTop: "20px" }}>
                {names.map((n) => (
                    <li key={n._id} style={{ marginBottom: "5px" }}>
                        {n.name}
                        <button style={{ marginLeft: "20px" }} onClick={() => handleDelete(n._id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NameList;
