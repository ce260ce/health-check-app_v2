import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TaskFilterButtons = ({ names, filterName }) => {
    const navigate = useNavigate();

    const handleFilter = (name) => {
        const baseUrl = window.location.pathname;
        if (name) {
            navigate(`${baseUrl}?name=${encodeURIComponent(name)}`);
        } else {
            navigate(baseUrl);
        }
    };

    return (
        <div>
            <h3>✅ メンバー別未完了タスクを見る</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {names.map((name) => (
                    <button
                        key={name}
                        className={`btn ${name === filterName ? 'btn-active' : ''}`}
                        onClick={() => handleFilter(name)}
                    >
                        {name}
                    </button>
                ))}
                {filterName && (
                    <button className="btn" onClick={() => handleFilter(null)}>
                        全て表示に戻す
                    </button>
                )}
            </div>
        </div>
    );
};
