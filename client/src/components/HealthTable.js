function HealthTable({ uniqueDates, names, records, view, todayStr }) {
    const getRecord = (date, name) =>
        records.find(r => r.name === name && r.date.startsWith(date)) || {};

    return (
        <table border="1" style={{ marginTop: 10, borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    <th style={{ width: "150px", whiteSpace: "nowrap" }}>日付＼氏名/朝食</th>
                    {names.map(name => <th key={name}>{name}</th>)}
                </tr>
            </thead>
            <tbody>
                {uniqueDates.map(date => (
                    <tr key={date} style={date === todayStr ? { backgroundColor: "#fffacd" } : {}}>
                        <td style={{
                            textAlign: "center",
                            color: (() => {
                                const weekday = new Date(date).getDay();
                                if (weekday === 0) return "red";
                                if (weekday === 6) return "blue";
                                return "black";
                            })()
                        }}>
                            {(() => {
                                const d = new Date(date);
                                const day = d.getDate();
                                const weekday = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
                                return `${day}日（${weekday}）`;
                            })()}
                        </td>
                        {names.map(name => {
                            const record = getRecord(date, name);
                            const conditionText = (() => {
                                if (record.condition === "〇") return `〇 / ${record.breakfast ?? ""}`;
                                if (record.condition === "年休") return `年休`;
                                if (record.condition) {
                                    return `${record.condition}${record.conditionReason ? `（${record.conditionReason}）` : ""} / ${record.breakfast ?? ""}`;
                                }
                                return "";
                            })();

                            return (
                                <td key={name + date} style={{ textAlign: "center" }}>
                                    {view === "condition" ? conditionText : record.task ?? ""}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default HealthTable;
