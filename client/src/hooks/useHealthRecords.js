import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const useHealthRecords = (year, month) => {
    const [records, setRecords] = useState([]);
    const [names, setNames] = useState([]);

    const fetchRecords = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/health?year=${year}&month=${month}`);
            setRecords(res.data);
        } catch (err) {
            console.error("健康チェックデータ取得エラー", err);
        }
    }, [year, month]);

    const fetchNames = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/names`);
            setNames(res.data.map(n => n.name));
        } catch (err) {
            console.error("氏名取得エラー", err);
        }
    }, []);

    const postRecord = async (record) => {
        try {
            await axios.post(`${API}/api/health`, record);
            await fetchRecords();
        } catch (err) {
            console.error("送信失敗", err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    useEffect(() => {
        fetchNames();
    }, [fetchNames]);

    return { records, names, postRecord };
};
