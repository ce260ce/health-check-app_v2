// hooks/useBulletins.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export function useBulletins() {
    const [bulletins, setBulletins] = useState([]);

    // 📥 掲示を取得（参照を安定化）
    const fetchBulletins = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/bulletins`);
            setBulletins(res.data);
        } catch (err) {
            console.error('掲示取得失敗:', err);
        }
    }, []); // API はモジュール定数、setBulletins は安定参照なので依存なしでOK

    // 🗑 掲示を削除（fetchBulletins に依存）
    const deleteBulletin = useCallback(
        async (id) => {
            if (!window.confirm('本当に削除しますか？')) return;
            try {
                await axios.delete(`${API}/api/bulletins/${id}`);
                await fetchBulletins();
            } catch (err) {
                alert('削除に失敗しました: ' + err.message);
            }
        },
        [fetchBulletins]
    );

    // ✅ チェック状態を更新（fetchBulletins に依存）
    const updateCheckStatus = useCallback(
        async (id, name, checked) => {
            try {
                await axios.post(`${API}/api/bulletins/${id}/read`, { name, checked });
                await fetchBulletins();
            } catch (err) {
                console.error('チェック更新失敗:', err);
            }
        },
        [fetchBulletins]
    );

    return {
        bulletins,
        fetchBulletins,
        deleteBulletin,
        updateCheckStatus,
    };
}
