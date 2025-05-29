// hooks/useEditBulletinForm.js
import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export function useEditBulletinForm(fetchBulletins) {
    const [editBulletinId, setEditBulletinId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        visibleUntil: '',
        postedBy: '',
    });

    const handleEditClick = (bulletin) => {
        setEditBulletinId(bulletin._id);
        setEditForm({
            title: bulletin.title,
            description: bulletin.description,
            visibleUntil: bulletin.visibleUntil?.slice(0, 10),
            postedBy: bulletin.postedBy,
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API}/api/bulletins/${editBulletinId}`, editForm);
            setEditBulletinId(null);
            fetchBulletins();
        } catch (err) {
            alert('掲示の更新に失敗しました: ' + err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditBulletinId(null);
    };

    return {
        editBulletinId,
        editForm,
        handleEditClick,
        handleEditChange,
        handleEditSubmit,
        handleCancelEdit,
    };
}
