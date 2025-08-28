// src/hooks/task/useTasks.js
import { useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

// サーバーAPIのパスがプロジェクトによって微妙に違う場合があります。
// 必要なら下のURLをあなたのAPIに合わせて調整してください。
export function useTasks() {
    const [tasks, setTasks] = useState([]);

    // 一覧取得（安定化）
    const fetchTasks = useCallback(async () => {
        try {
            const res = await axios.get(`${API}/api/tasks`);
            setTasks(res.data || []);
        } catch (err) {
            console.error("タスク取得失敗:", err);
        }
    }, []);

    // チェック（確認者）切り替え
    // onToggleCheck から (taskId, name, checked) で呼ばれる想定
    const toggleCheck = useCallback(
        async (taskId, name, checked) => {
            try {
                await axios.post(`${API}/api/tasks/${taskId}/check`, { name, checked });
                await fetchTasks();
            } catch (err) {
                console.error("チェック更新失敗:", err);
            }
        },
        [fetchTasks]
    );

    // タスク削除
    const deleteTask = useCallback(
        async (taskId) => {
            if (!window.confirm("本当に削除しますか？")) return;
            try {
                await axios.delete(`${API}/api/tasks/${taskId}`);
                await fetchTasks();
            } catch (err) {
                alert("削除に失敗しました: " + err.message);
            }
        },
        [fetchTasks]
    );

    // 添付ファイル削除（/api/tasks/:taskId/files/:fileId を想定）
    const deleteFile = useCallback(
        async (taskId, fileId) => {
            try {
                await axios.delete(`${API}/api/tasks/${taskId}/files/${fileId}`);
                await fetchTasks();
            } catch (err) {
                alert("ファイル削除に失敗しました: " + err.message);
            }
        },
        [fetchTasks]
    );

    // 完了にする
    const completeTask = useCallback(
        async (taskId) => {
            try {
                await axios.post(`${API}/api/tasks/${taskId}/complete`);
                await fetchTasks();
            } catch (err) {
                console.error("完了更新失敗:", err);
            }
        },
        [fetchTasks]
    );

    // 未完了へ戻す
    const uncompleteTask = useCallback(
        async (taskId) => {
            try {
                await axios.post(`${API}/api/tasks/${taskId}/uncomplete`);
                await fetchTasks();
            } catch (err) {
                console.error("未完了戻し失敗:", err);
            }
        },
        [fetchTasks]
    );

    return {
        tasks,
        fetchTasks,
        toggleCheck,
        deleteTask,
        deleteFile,
        completeTask,
        uncompleteTask,
    };
}
