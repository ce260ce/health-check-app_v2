import './HealthForm.css'
import { useEffect, useState, useRef } from 'react'
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
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    onSubmit();                // 元の送信処理
    setShowMessage(true);      // ⛑️ メッセージ表示
    setShowToast(true);        // ✅ トースト表示

    // 5秒後に消える
    setTimeout(() => setShowMessage(false), 5000);
    setTimeout(() => setShowToast(false), 3000);
  };

  const SIDE_IMG_NS = 'healthForm.sideImageDataUrl';
  const keyOf = (n) => `${SIDE_IMG_NS}:${n ?? ''}`;

  const fileInputRef = useRef(null);
  const [sideImageDataUrl, setSideImageDataUrl] = useState('');

  // 氏名が変わったら、その人用の画像を読み込む
  useEffect(() => {
    if (!name) { setSideImageDataUrl(''); return; }
    const saved = localStorage.getItem(keyOf(name));
    setSideImageDataUrl(saved || '');
  }, [name]);

  const handleChooseFile = () => {
    if (!name) { alert('先に氏名を選択してください。'); return; }
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!name) { e.target.value = ''; return; }

    // 画像のみ & 2MB 上限（必要に応じて調整）
    if (!file.type.startsWith('image/')) { alert('画像ファイルを選択してください。'); e.target.value = ''; return; }
    if (file.size > 2 * 1024 * 1024) { alert('ファイルサイズは2MB以下にしてください。'); e.target.value = ''; return; }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setSideImageDataUrl(dataUrl);
      localStorage.setItem(keyOf(name), dataUrl);   // ← メンバー別に保存
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const clearSideImage = () => {
    if (!name) return;
    setSideImageDataUrl('');
    localStorage.removeItem(keyOf(name));           // ← 選択中メンバーの画像だけ削除
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
                case '〇': return '😊';
                case '△': return '😐';
                case '×': return '😷';
                case '年休': return '🏖️';
                case 'ウェルポ': return '🌿';
                case '出張': return '🚄';
                case '離業': return '🏈';
                case 'ゼ勤': return '🏝️';
                default: return '';
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

      <div className="side-image-box">
        {sideImageDataUrl ? (
          <>
            <img src={sideImageDataUrl} alt="サイド画像" />
            <button type="button" className="side-image-clear" onClick={clearSideImage} title="画像を消す">×</button>
          </>
        ) : (
          <>
            <button type="button" className="side-image-set" onClick={handleChooseFile}>
              お好きな画像を設定ください
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>

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

      {/* ✅ トースト通知 */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#fff",        // 背景を白に
            color: "green",                 // ✅ 文字を緑に
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid green",      // 縁も緑にすると見やすい
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 1000,
            animation: "fadeInOut 3s forwards"
          }}
        >
          送信完了しました。
        </div>
      )}
    </div>
  )
}
