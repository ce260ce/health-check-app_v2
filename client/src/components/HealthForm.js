import './HealthForm.css'
import { useEffect, useState } from 'react'
import { EXCLUDED_CONDITIONS } from '../constants/excludedConditions'

export const HealthForm = ({
  name, condition, conditionReason, breakfast, task, ky, date,
  setName, setCondition, setConditionReason, setBreakfast, setTask, setKy, setDate,
  onSubmit, memberOptions, records, nameFromQuery, todayStr,
}) => {

  useEffect(() => {
    if (
      EXCLUDED_CONDITIONS.includes(condition) &&
      !task && !ky
    ) {
      setTask(condition)
      setKy(condition)
      setBreakfast('')
    }
  }, [condition, setTask, setKy, setBreakfast, task, ky])


  const toYMD = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  };

  const handleApplyPreviousWork = () => {
    const validRecords = records.filter(r => {
      const rDate = toYMD(r.date);
      return (
        r.name.trim() === nameFromQuery.trim() &&
        rDate !== null &&
        rDate < todayStr
      );
    });

    const latest = validRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (latest) {
      const hasMeaningfulData = latest.task || latest.ky || latest.breakfast || latest.condition;
      if (hasMeaningfulData) {
        setTask(latest.task || '');
        setKy(latest.ky || '');
        setBreakfast(latest.breakfast || '');
        setCondition(latest.condition || '');
        setConditionReason(latest.conditionReason || '');
      } else {
        alert('過去の作業記録が見つかりませんでした。');
      }
    } else {
      alert('過去の作業記録が見つかりませんでした。');
    }
  };

  const [showMessage, setShowMessage] = useState(false);
  const handleSubmit = () => {
    onSubmit();           // 元の送信処理
    setShowMessage(true); // メッセージ表示
    setTimeout(() => setShowMessage(false), 5000); // 5秒後に非表示
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
          <label>
            体調 {(() => {
              switch (condition) {
                case '〇':
                  return '😊';
                case '△':
                  return '😐';
                case '×':
                  return '😷';
                case '年休':
                  return '🏖️';
                case 'ウェルポ':
                  return '🌿';
                case '出張':
                  return '🚄';
                case '離業':
                  return '🏈';
                case 'ゼ勤':
                  return '🏝️';
                default:
                  return '';
              }
            })()}
          </label><br />
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="〇">〇</option>
            <option value="△">△</option>
            <option value="×">×</option>
            <option value="年休">年休</option>
            <option value="ウェルポ">ウェルポ</option>
            <option value="出張">出張</option>
            <option value="離業">離業</option>
            <option value="ゼ勤">ゼ勤</option>
          </select>
        </div>


        {(condition === '△' || condition === '×') && (
          <div>
            <label>体調の理由：</label><br />
            <input
              value={conditionReason}
              onChange={(e) => setConditionReason(e.target.value)}
              placeholder="例：風邪、頭痛など"
            />
          </div>
        )}
      </div>
      <br />

      {!EXCLUDED_CONDITIONS.includes(condition) && (
        <>
          <label>
            朝食 {breakfast === "〇" ? "🍙" : breakfast === "×" ? "☕️" : ""}
          </label><br />
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
              {records && nameFromQuery && (
                <div style={{ marginTop: '4px' }}>
                  <button
                    className="btn-active"
                    onClick={handleApplyPreviousWork}
                    style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                  >
                    🔁 先日の内容を反映
                  </button>
                </div>
              )}
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
          </div>
          <br />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn" onClick={handleSubmit}>送信</button>

        {showMessage && (
          <span style={{ fontWeight: 'bold', color: 'green' }}>
            今日も一日ご安全に！⛑️
          </span>
        )}
      </div>
    </div>
  )
}
