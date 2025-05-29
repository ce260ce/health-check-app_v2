export const TodayRecordTable = ({ names, records, todayStr }) => {
    const today = new Date(todayStr);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const getTodayRecordByName = (name) => {
        return records.find(r => r.name === name && r.date.startsWith(todayStr)) || {};
    };

    return (
        <>
            <h2>📆 本日の記録（{year}年{month}月{day}日）</h2>
            <table border="1" style={{ borderCollapse: "collapse", marginBottom: 30, width: "100%" }}>
                <thead>
                    <tr>
                        <th>氏名</th>
                        <th>体調/朝食</th>
                        <th>本日の作業内容</th>
                        <th>危険KYワンポイント</th>
                    </tr>
                </thead>
                <tbody>
                    {names.map(name => {
                        const record = getTodayRecordByName(name);

                        const conditionText = (() => {
                            if (record.condition === "〇") {
                                return `〇${record.breakfast ? ` / ${record.breakfast}` : ""}`;
                            } else if (record.condition === "年休") {
                                return "年休";
                            } else if (record.condition) {
                                const reasonPart = record.conditionReason ? `（${record.conditionReason}）` : "";
                                const breakfastPart = record.breakfast ? ` / ${record.breakfast}` : "";
                                return `${record.condition}${reasonPart}${breakfastPart}`;
                            }
                            return "";
                        })();


                        return (
                            <tr key={name}>
                                <td style={{ textAlign: "center" }}>{name}</td>
                                <td style={{ textAlign: "center" }}>{conditionText}</td>
                                <td style={{ textAlign: "left" }}>{record.task ?? ""}</td>
                                <td style={{ textAlign: "left" }}>{record.ky ?? ""}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
