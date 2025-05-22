import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export function useEditTaskForm(fetchTasks) {

    const [editTaskId, setEditTaskId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    const handleEditClick = (task) => {
        setEditTaskId(task._id);
        setEditForm({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate?.slice(0, 10),
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('description', editForm.description);
        formData.append('dueDate', editForm.dueDate);

        const fileInput = e.target.elements.file;
        if (fileInput && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => {
                formData.append('files', file);
            });
        }

        await axios.put(`${API_URL}/api/tasks/${editTaskId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        setEditTaskId(null);
        fetchTasks();
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
    };

    return {
        editTaskId,
        editForm,
        handleEditClick,
        handleEditChange,
        handleEditSubmit,
        handleCancelEdit,
    };
}
