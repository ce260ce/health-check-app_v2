// components/TaskFormContainer.js
import React, { useState } from "react";
import { TaskForm } from "./TaskForm";

const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export const TaskFormContainer = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: getToday(), // ✅ デフォルトを設定
        dueDate: "",
    });

    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (newFiles) => {
        setFiles(newFiles);
    };

    const handleFileDelete = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("送信データ:", formData, files);
    };

    return (
        <TaskForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            files={files}
            onFileChange={handleFileChange}
            onFileDelete={handleFileDelete}
        />
    );
};
