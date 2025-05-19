// src/pages/TodayRecordPage.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TodayRecordTable from "../components/TodayRecordTable";

function TodayRecordPage() {
    const navigate = useNavigate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const [records, setRecords] = useState([]);
    const [names, setNames] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/health?year=${year}&month=${month}`)
            .then(res => setRecords(res.data));

        axios.get("http://localhost:5000/api/names")
            .then(res => setNames(res.data.map(n => n.name)));
    }, [year, month]);

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
                ← 戻る
            </button>
            <TodayRecordTable names={names} records={records} todayStr={todayStr} />
        </div>
    );
}

export default TodayRecordPage;