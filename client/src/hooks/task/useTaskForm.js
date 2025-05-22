// hooks/useTaskForm.js
import { useState } from 'react';

export function useTaskForm(initial = { title: '', description: '', dueDate: '' }) {
    const [form, setForm] = useState(initial);
    const [files, setFiles] = useState([]);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (newFiles) => {
        setFiles((prev) => {
            const existingNames = prev.map((f) => f.name);
            const filtered = newFiles.filter((f) => !existingNames.includes(f.name));
            return [...prev, ...filtered];
        });
    };

    const handleFileDelete = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setForm({ title: '', description: '', dueDate: '' });
        setFiles([]);
    };

    return {
        form,
        setForm,
        files,
        setFiles,
        handleInputChange,
        handleFileChange,
        handleFileDelete,
        resetForm,
    };
}
