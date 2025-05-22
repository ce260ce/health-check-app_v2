import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export function useTasks() {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const res = await axios.get(`${API}/api/tasks`);
        setTasks(res.data);
    };

    const toggleCheck = async (taskId, name, current) => {
        await axios.post(`${API}/api/tasks/${taskId}/check`, {
            name,
            checked: !current,
        });
        fetchTasks();
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('本当に削除しますか？')) {
            await axios.delete(`${API}/api/tasks/${taskId}`);
            fetchTasks();
        }
    };

    const deleteFile = async (taskId, fileName) => {
        if (!window.confirm(`${fileName} を削除しますか？`)) return;
        try {
            await axios.delete(`${API}/api/tasks/${taskId}/file/${encodeURIComponent(fileName)}`);
            fetchTasks();
        } catch (err) {
            alert("ファイル削除に失敗しました：" + err.message);
        }
    };

    const completeTask = async (taskId) => {
        try {
            await axios.put(`${API}/api/tasks/${taskId}/complete`, {
                isCompleted: true,
            });
            fetchTasks();
        } catch (err) {
            alert("タスク完了に失敗しました：" + err.message);
        }
    };

    const uncompleteTask = async (taskId) => {
        try {
            await axios.put(`${API}/api/tasks/${taskId}/complete`, {
                isCompleted: false,
            });
            fetchTasks();
        } catch (err) {
            alert("完了取消に失敗しました：" + err.message);
        }
    };

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
