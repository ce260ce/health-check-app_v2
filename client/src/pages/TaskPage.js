import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { TaskForm } from '../components/task/TaskForm';
import { TaskList } from '../components/task/TaskList';
import { TaskFilterButtons } from '../components/task/TaskFilterButtons';
import { useTasks } from '../hooks/task/useTasks';
import { useTaskForm } from '../hooks/task/useTaskForm';
import { useEditTaskForm } from '../hooks/task/useEditTaskForm';
import { useAddTaskSubmit } from '../hooks/task/useAddTaskSubmit';

const API = process.env.REACT_APP_API_URL;

export const TaskPage = () => {
    const {
        tasks,
        fetchTasks,
        toggleCheck,
        deleteTask,
        deleteFile,
        completeTask,
        uncompleteTask,
    } = useTasks();

    const {
        form: addForm,
        files: addFiles,
        handleInputChange: handleAddInputChange,
        handleFileChange,
        handleFileDelete,
        resetForm: resetAddForm,
    } = useTaskForm();

    const {
        editTaskId,
        editForm,
        handleEditClick,
        handleEditChange,
        handleEditSubmit,
        handleCancelEdit,
    } = useEditTaskForm(fetchTasks);

    const [names, setNames] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const filterName = query.get('name');

    const filteredTasks = filterName
        ? tasks.filter(task => !task.checkedBy?.[filterName])
        : tasks;

    const incompleteTasks = filteredTasks.filter(task => !task.isCompleted);
    const completedTasks = filteredTasks.filter(task => task.isCompleted);

    const today = new Date();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchTasks();
        axios.get(`${API}/api/names`)
            .then(res => setNames(res.data.map(n => n.name)));
    }, []);

    const { handleAddSubmit } = useAddTaskSubmit({
        resetForm: resetAddForm,
        fetchTasks
    });

    console.log("API_URL:", process.env.REACT_APP_API_URL);


    return (
        <div style={{ padding: 20 }}>
            <button
                className="back-btn"
                onClick={() => navigate(filterName ? `/?name=${encodeURIComponent(filterName)}` : '/')}
                style={{ marginBottom: 20 }}
            >
                ← 戻る
            </button>
            <h1>🗘 タスク一覧</h1>

            <TaskForm
                formData={addForm}
                onChange={handleAddInputChange}
                onSubmit={(e) => handleAddSubmit(e, addForm, addFiles)}
                files={addFiles}
                onFileChange={handleFileChange}
                onFileDelete={handleFileDelete}
            />

            <TaskFilterButtons names={names} filterName={filterName} />

            {filterName && (
                <h2 style={{ marginBottom: '20px' }}>
                    📌 {filterName} さんがまだ完了していないタスク
                </h2>
            )}

            <h2>📋 未完了タスク</h2>
            <TaskList
                tasks={incompleteTasks}
                names={names}
                today={today}
                editTaskId={editTaskId}
                editForm={editForm}
                onEditChange={handleEditChange}
                onEditSubmit={handleEditSubmit}
                onCancelEdit={handleCancelEdit}
                onToggleCheck={toggleCheck}
                onEditClick={handleEditClick}
                onDeleteClick={deleteTask}
                onDeleteFileClick={deleteFile}
                onCompleteClick={completeTask}
            />

            <h2 style={{ marginTop: '30px' }}>✅ 完了済みタスク</h2>
            <TaskList
                tasks={completedTasks}
                names={names}
                today={today}
                editTaskId={editTaskId}
                editForm={editForm}
                onEditChange={handleEditChange}
                onEditSubmit={handleEditSubmit}
                onCancelEdit={handleCancelEdit}
                onToggleCheck={toggleCheck}
                onEditClick={handleEditClick}
                onDeleteClick={deleteTask}
                onDeleteFileClick={deleteFile}
                onCompleteClick={uncompleteTask}
            />
        </div>
    );
};
