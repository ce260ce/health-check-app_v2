import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBulletins } from '../hooks/bulletin/useBulletins';
import { useEditBulletinForm } from '../hooks/bulletin/useEditBulletinForm';
import { useMemberNames } from '../hooks/useMemberNames';

import { BulletinForm } from '../components/bulletin/BulletinForm';
import { BulletinList } from '../components/bulletin/BulletinList';

export const BulletinPage = () => {
  const navigate = useNavigate();
  const names = useMemberNames();

  const {
    bulletins,
    fetchBulletins,
    deleteBulletin,
    updateCheckStatus,
  } = useBulletins();

  const {
    editBulletinId,
    editForm,
    handleEditClick,
    handleEditChange,
    handleEditSubmit,
    handleCancelEdit,
  } = useEditBulletinForm(fetchBulletins);


  useEffect(() => {
    fetchBulletins();
  }, [fetchBulletins]);

  // 確認状態の更新
  const handleMarkAsRead = async (id, name, checked) => {
    await updateCheckStatus(id, name, checked);
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        className="back-btn"
        onClick={() => navigate('/')}
        style={{ marginBottom: 20 }}
      >
        ← 戻る
      </button>

      <h2>📢 掲示板</h2>

      {/* 掲示を投稿 */}
      <BulletinForm names={names} onPost={fetchBulletins} />

      {/* 掲示リスト */}
      <BulletinList
        bulletins={bulletins}
        names={names}
        onMarkAsRead={handleMarkAsRead}
        onEditClick={handleEditClick}
        onDeleteClick={deleteBulletin}
        editBulletinId={editBulletinId}
        editForm={editForm}
        onEditChange={handleEditChange}
        onEditSubmit={handleEditSubmit}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default BulletinPage;
