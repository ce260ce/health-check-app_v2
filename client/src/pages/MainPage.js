import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { useFormState } from "../hooks/useFormState";
import { useHealthRecords } from "../hooks/useHealthRecords";
import { HealthForm } from "../components/HealthForm";
import { TodayRecordTable } from "../components/TodayRecordTable";

const API = process.env.REACT_APP_API_URL;

export const MainPage = ({ onOpenNameList }) => {
    const query = useQuery();
    const nameFromQuery = query.get("name") || "";
    const navigate = useNavigate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const form = useFormState(nameFromQuery, todayStr);
    const { records, names, postRecord } = useHealthRecords(year, month);

    const [incompleteTaskCount, setIncompleteTaskCount] = useState(0);

    console.log("API_URL:", process.env.REACT_APP_API_URL);


    useEffect(() => {
        const fetchIncompleteTasks = async () => {
            try {
                const res = await fetch(`${API}/api/tasks`);
                const tasks = await res.json();
                const incomplete = tasks.filter(task => !task.checkedBy?.[nameFromQuery]);
                setIncompleteTaskCount(incomplete.length);
            } catch (err) {
                console.error("タスク取得エラー:", err);
            }
        };

        if (nameFromQuery) {
            fetchIncompleteTasks();
        }
    }, [nameFromQuery]);

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (!nameFromQuery || records.length === 0 || hasInitialized) return;

        const existing = records.find(
            (record) =>
                record.name.trim() === nameFromQuery.trim() &&
                record.date === todayStr
        );

        if (existing) {
            form.setTask(existing.task || "");
            form.setKy(existing.ky || "");
            setHasInitialized(true);
        }
    }, [records, nameFromQuery, todayStr, hasInitialized, form]);

    useEffect(() => {
        if (!nameFromQuery && window.location.pathname === "/") {
            navigate("/select");
        }
    }, [nameFromQuery, navigate]);

    const [links, setLinks] = useState([]);
    useEffect(() => {
        axios.get(`${API}/api/links`)
            .then(res => {
                const allLinks = res.data || [];
                const filtered = allLinks.filter(link =>
                    link.forAll || (nameFromQuery && link.forName === nameFromQuery)
                );
                setLinks(filtered);
            })
            .catch(err => {
                console.warn("リンク取得エラー", err);
                setLinks([]);
            });
    }, [nameFromQuery]);

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
                    <HealthForm
                        {...form}
                        onSubmit={handleSubmit}
                        memberOptions={names}
                        records={records}
                        nameFromQuery={nameFromQuery}
                        todayStr={todayStr}
                    />

                    {incompleteTaskCount > 0 && (
                        <div style={{ marginTop: 20, padding: 10, backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 6 }}>
                            <p style={{ margin: 0, color: "#856404" }}>
                                ⚠️ {nameFromQuery} さんの未完了タスクが {incompleteTaskCount} 件あります。
                            </p>
                            <button
                                className="btn"
                                style={{ marginTop: 10 }}
                                onClick={() => navigate(`/tasks?name=${encodeURIComponent(nameFromQuery)}`)}
                            >
                                タスクページへ移動
                            </button>
                        </div>
                    )}

                    <hr style={{ margin: "20px 0" }} />

                    {Array.isArray(links) && links.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                <h2 style={{ margin: 0 }}>各種リンク</h2>
                                <button
                                    className="btn"
                                    onClick={() => navigate("/link-builder")}
                                    style={{ marginLeft: 30, fontSize: "0.85em", padding: "6px 12px" }}
                                >
                                    ＋ リンク作成ページへ
                                </button>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                {links.map(link => (
                                    <button
                                        key={link._id}
                                        className="btn"
                                        onClick={() => window.open(link.url, "_blank")}
                                        style={{ marginRight: 10, marginTop: 6 }}
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

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
};
