import { useState, useEffect } from "react";
import axios from "axios";

function NameList() {
    const [newName, setNewName] = useState("");
    const [names, setNames] = useState([]);

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

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>👤 氏名リスト管理</h2>

            <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="氏名を入力"
            />
            <button onClick={handleAdd}>追加</button>

            <ul style={{ marginTop: "20px" }}>
                {names.map((n) => (
                    <li key={n._id} style={{ marginBottom: "5px" }}>
                        {n.name}
                        <button style={{ marginLeft: "10px" }} onClick={() => handleDelete(n._id)}>削除</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NameList;

