// hooks/useBulletins.js
import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export function useBulletins() {
    const [bulletins, setBulletins] = useState([]);

    // 📥 掲示を取得
    const fetchBulletins = async () => {
        try {
            const res = await axios.get(`${API}/api/bulletins`);
            setBulletins(res.data);
        } catch (err) {
            console.error('掲示取得失敗:', err);
        }
    };

    // 🗑 掲示を削除
    const deleteBulletin = async (id) => {
        if (!window.confirm('本当に削除しますか？')) return;
        try {
            await axios.delete(`${API}/api/bulletins/${id}`);
            fetchBulletins();
        } catch (err) {
            alert('削除に失敗しました: ' + err.message);
        }
    };

    // ✅ チェック状態を更新（ここが重要！）
    const updateCheckStatus = async (id, name, checked) => {
        try {
            await axios.post(`${API}/api/bulletins/${id}/read`, { name, checked });
            fetchBulletins(); // ← これが画面再描画を起こす
        } catch (err) {
            console.error('チェック更新失敗:', err);
        }
    };

    return {
        bulletins,
        fetchBulletins,
        deleteBulletin,
        updateCheckStatus, // ← export 追加
    };
}
