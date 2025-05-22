import React from 'react';
import { TaskCard } from './TaskCard';

export const TaskList = ({
    tasks,
    names,
    today,
    editTaskId,
    editForm,
    onEditChange,
    onEditSubmit,
    onCancelEdit,
    onToggleCheck,
    onEditClick,
    onDeleteClick,
    onDeleteFileClick,
    onCompleteClick = () => { },
}) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {tasks.map(task => (
                <TaskCard
                    key={task._id}
                    task={task}
                    names={names}
                    today={today}
                    isEditing={editTaskId === task._id}
                    editForm={editForm}
                    onEditChange={onEditChange}
                    onEditSubmit={onEditSubmit}
                    onCancelEdit={onCancelEdit}
                    onToggleCheck={onToggleCheck}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onDeleteFileClick={onDeleteFileClick}
                    onCompleteClick={onCompleteClick}
                />
            ))}
        </div>
    );
};
