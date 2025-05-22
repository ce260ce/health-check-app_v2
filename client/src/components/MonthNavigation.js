export const MonthNavigation = ({ month, setYear, setMonth }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    return (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => {
                if (month === 1) {
                    setYear(y => y - 1);
                    setMonth(12);
                } else {
                    setMonth(m => m - 1);
                }
            }}>＜前月</button>

            <button onClick={() => {
                setYear(currentYear);
                setMonth(currentMonth);
            }}>今月</button>

            <button onClick={() => {
                if (month === 12) {
                    setYear(y => y + 1);
                    setMonth(1);
                } else {
                    setMonth(m => m + 1);
                }
            }}>翌月＞</button>
        </div>
    );
};
