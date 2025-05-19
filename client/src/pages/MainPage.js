// src/pages/MainPage.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { useFormState } from "../hooks/useFormState";
import { useHealthRecords } from "../hooks/useHealthRecords";
import HealthForm from "../components/HealthForm";
import TodayRecordTable from "../components/TodayRecordTable";

function MainPage({ onOpenNameList }) {
    const query = useQuery();
    const nameFromQuery = query.get("name") || "";
    const navigate = useNavigate();

    // 今日の日付
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Hooks（必ず return より前、条件なし）
    const form = useFormState(nameFromQuery, todayStr);
    const { records, names, postRecord } = useHealthRecords(year, month);

    // ⛳ クエリがない場合、かつ「今が / パス」のときだけ select に遷移
    useEffect(() => {
        if (!nameFromQuery && window.location.pathname === "/") {
            navigate("/select");
        }
    }, [nameFromQuery, navigate]);

    const handleSubmit = async () => {
        await postRecord({
            name: form.name,
            condition: form.condition,
            conditionReason: form.conditionReason,
            breakfast: form.breakfast,
            task: form.task,
            ky: form.ky,
            date: form.date
        });
        form.reset();
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <button className="back-btn" onClick={() => navigate("/")} style={{ marginBottom: 20 }}>
                ← 戻る
            </button>
            {nameFromQuery ? (
                <>
                    <HealthForm {...form} onSubmit={handleSubmit} memberOptions={names} />

                    <hr style={{ margin: "40px 0" }} />

                    <TodayRecordTable names={names} records={records} todayStr={todayStr} />

                    <button className="btn" onClick={() => navigate("/list")}>
                        📊 一覧表示
                    </button>
                </>
            ) : (
                <p>読み込み中...</p>
            )}
        </div>

    );
}

export default MainPage;
