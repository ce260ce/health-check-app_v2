import './HealthForm.css';

export const HealthForm = ({
    name, condition, conditionReason, breakfast, task, ky, date,
    setName, setCondition, setConditionReason, setBreakfast, setTask, setKy, setDate,
    onSubmit, memberOptions, records, nameFromQuery, todayStr
}) => {

    const handleApplyPreviousWork = () => {
        const latest = records
            .filter(r =>
                r.name.trim() === nameFromQuery.trim() &&
                new Date(r.date) < new Date(todayStr)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        if (latest) {
            setTask(latest.task || "");
            setKy(latest.ky || "");
        } else {
            alert("過去の作業記録が見つかりませんでした。");
        }
    };

    return (
        <div className="health-form">
            <label>日付</label><br />
            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            /><br /><br />

            <label>氏名</label><br />
            <select value={name} onChange={e => setName(e.target.value)}>
                <option value="">-- 選択してください --</option>
                {memberOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select><br /><br />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                    <label>体調</label><br />
                    <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                        <option value="〇">〇</option>
                        <option value="△">△</option>
                        <option value="×">×</option>
                        <option value="年休">年休</option>
                    </select>
                </div>

                {condition !== "〇" && (
                    <div>
                        <label>体調の理由：</label><br />
                        <input
                            value={conditionReason}
                            onChange={(e) => setConditionReason(e.target.value)}
                            placeholder="例：風邪、頭痛など"
                        />
                    </div>
                )}
            </div><br />

            <label>朝食</label><br />
            <select value={breakfast} onChange={e => setBreakfast(e.target.value)}>
                <option value="〇">〇</option>
                <option value="×">×</option>
            </select><br /><br />

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div>
                    <label>本日の作業</label><br />
                    <textarea
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        rows={3}
                        style={{ width: '280px', resize: 'vertical' }}
                    />
                </div>

                <div>
                    <label>危険KYワンポイント</label><br />
                    <textarea
                        value={ky}
                        onChange={e => setKy(e.target.value)}
                        rows={3}
                        style={{ width: '280px', resize: 'vertical' }}
                    />
                </div>
                {records && nameFromQuery && (
                    <button
                        className="btn"
                        onClick={handleApplyPreviousWork}
                        style={{ alignSelf: "center", height: "fit-content" }}
                    >
                        🔁 先日の作業を反映
                    </button>
                )}
            </div><br />

            <button className="btn" onClick={onSubmit}>送信</button>
        </div>
    );
};
