// src/components/MonthNavigation.js
function MonthNavigation({ year, month, setYear, setMonth }) {
    return (
        <div>
            <button onClick={() => {
                if (month === 1) { setYear(y => y - 1); setMonth(12); }
                else { setMonth(m => m - 1); }
            }}>＜前月</button>
            <button onClick={() => {
                if (month === 12) { setYear(y => y + 1); setMonth(1); }
                else { setMonth(m => m + 1); }
            }}>翌月＞</button>
        </div>
    );
}

export default MonthNavigation;