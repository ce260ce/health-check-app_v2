// src/pages/ListPage.js
import { useState, useEffect } from "react";
import axios from "axios";
import MonthNavigation from "../components/MonthNavigation";
import HealthTable from "../components/HealthTable";

import { useNavigate } from "react-router-dom";

function ListPage() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [names, setNames] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [view, setView] = useState("condition");

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const getDatesInMonth = (year, month) => {
        const dates = [];
        const lastDay = new Date(year, month, 0).getDate();
        for (let d = 1; d <= lastDay; d++) {
            const dateObj = new Date(year, month - 1, d);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
            const dd = String(dateObj.getDate()).padStart(2, "0");
            dates.push(`${yyyy}-${mm}-${dd}`);
        }
        return dates;
    };
    const uniqueDates = getDatesInMonth(year, month);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/health?year=${year}&month=${month}`)
            .then(res => setRecords(res.data));
    }, [year, month]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/names")
            .then(res => setNames(res.data.map(n => n.name)));
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
                ← 戻る
            </button>
            <h1>📋 一覧表示</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    className={`btn ${view === "condition" ? "" : "btn-active"}`}
                    onClick={() => setView("condition")}
                >
                    体調一覧
                </button>
                <button
                    className={`btn ${view === "task" ? "" : "btn-active"}`}
                    onClick={() => setView("task")}
                >
                    作業一覧
                </button>
            </div>
            <h2>{view === "condition" ? "🩺 体調一覧" : "🛠 作業一覧"}（{year}年 {month}月）</h2>
            <MonthNavigation year={year} month={month} setYear={setYear} setMonth={setMonth} />
            <HealthTable {...{ uniqueDates, names, records, view, todayStr }} />
        </div>
    );
}

export default ListPage;
