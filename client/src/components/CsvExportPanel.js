import React from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const CsvExportPanel = ({ startDate, endDate, setStartDate, setEndDate, names }) => {

    const downloadCsvByPeriod = async () => {
        if (!startDate || !endDate) {
            alert("開始月と終了月を指定してください。");
            return;
        }

        const [startYear, startMonth] = startDate.split("-").map(Number);
        const [endYear, endMonth] = endDate.split("-").map(Number);
        const start = new Date(startYear, startMonth - 1, 1);
        const end = new Date(endYear, endMonth, 0);
        end.setHours(23, 59, 59, 999);

        try {
            const res = await axios.get(`${API_URL}/api/health/all`);
            const filteredRecords = res.data.filter(r => {
                const date = new Date(r.date);
                return date >= start && date <= end;
            });

            const uniqueDates = [...new Set(
                filteredRecords.map(r => new Date(r.date).toISOString().split("T")[0])
            )].sort();

            const header = ["日付/体調|メモ|朝食", ...names];
            const rows = [header];

            uniqueDates.forEach(dateStr => {
                const row = [dateStr];
                names.forEach(name => {
                    const record = filteredRecords.find(r => {
                        const recordDate = new Date(r.date).toISOString().split("T")[0];
                        return r.name === name && recordDate === dateStr;
                    });
                    const condition = record?.condition || "-";
                    const memo = record?.conditionReason || "-";
                    const breakfast = record?.breakfast || "-";
                    row.push(`"${condition}|${memo}|${breakfast}"`);
                });
                rows.push(row);
            });

            const csvString = rows.map(r => r.join(",")).join("\n");
            const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `体調一覧_${startDate}_to_${endDate}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("CSV出力失敗", err);
            alert("データ取得に失敗しました");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", marginTop: "auto" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85em" }}>
                    開始月
                    <input
                        type="month"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label style={{ display: "flex", flexDirection: "column", fontSize: "0.85em" }}>
                    終了月
                    <input
                        type="month"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <button className="btn" onClick={downloadCsvByPeriod} style={{ whiteSpace: "nowrap" }}>
                    📥 CSV出力
                </button>
            </div>
        </div>
    );
};
