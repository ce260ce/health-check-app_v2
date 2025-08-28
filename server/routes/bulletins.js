const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const Bulletin = require('../models/Bulletin');

// アップロード設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

/**
 * 掲示を新規作成
 */
router.post('/', upload.array('files'), async (req, res) => {
    try {
        const { title, description, visibleUntil, postedBy } = req.body;
        const files = (req.files || []).map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`,
        }));
        const newBulletin = new Bulletin({
            title,
            description,
            visibleUntil,
            postedBy,
            files,
        });
        await newBulletin.save();
        res.status(201).json({ message: '掲示を投稿しました', bulletin: newBulletin });
    } catch (err) {
        console.error('掲示投稿エラー:', err);
        res.status(500).json({ error: '投稿失敗' });
    }
});

/**
 * 掲示一覧を取得
 */
router.get('/', async (req, res) => {
    try {
        const bulletins = await Bulletin.find();
        res.json(bulletins);
    } catch (err) {
        console.error('掲示取得エラー:', err);
        res.status(500).json({ error: '取得失敗' });
    }
});

/**
 * 掲示の既読状態を更新
 */
router.post('/:id/read', async (req, res) => {
    try {
        const { name, checked } = req.body;
        const bulletin = await Bulletin.findById(req.params.id);
        if (!bulletin) return res.status(404).json({ error: '掲示が見つかりません' });

        if (checked) {
            bulletin.checkedBy.set(name, true);
        } else {
            bulletin.checkedBy.delete(name);
        }

        await bulletin.save();
        res.json({ message: 'チェック状態を更新しました' });
    } catch (err) {
        console.error('チェック更新エラー:', err);
        res.status(500).json({ error: 'チェック更新失敗' });
    }
});

/**
 * 掲示を削除
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await Bulletin.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: '掲示が見つかりません' });
        res.json({ message: '掲示を削除しました' });
    } catch (err) {
        console.error('掲示削除エラー:', err);
        res.status(500).json({ error: '削除に失敗しました' });
    }
});

/**
 * 掲示を更新
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, description, visibleUntil, postedBy } = req.body;

        const updated = await Bulletin.findByIdAndUpdate(
            req.params.id,
            { title, description, visibleUntil, postedBy },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: '掲示が見つかりません' });

        res.json({ message: '掲示を更新しました', bulletin: updated });
    } catch (err) {
        console.error('掲示更新エラー:', err);
        res.status(500).json({ error: '更新に失敗しました' });
    }
});

module.exports = router;
