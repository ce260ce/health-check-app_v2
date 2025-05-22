// hooks/useAddTaskSubmit.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export function useAddTaskSubmit({ resetForm, fetchTasks }) {


    const handleAddSubmit = async (e, addForm, addFiles) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', addForm.title);
        formData.append('description', addForm.description);
        formData.append('dueDate', addForm.dueDate);

        if (addFiles.length > 0) {
            addFiles.forEach(file => {
                formData.append('files', file);
            });
        }

        try {
            await axios.post(`${API_URL}/api/tasks`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            resetForm();
            e.target.reset();
            fetchTasks();
        } catch (err) {
            alert('タスク追加失敗：' + err.message);
        }
    };

    return { handleAddSubmit };
}
