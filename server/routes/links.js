const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

router.get('/', async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links || []);
    } catch (err) {
        console.error('リンク取得失敗', err);
        res.status(500).json([]);
    }
});

router.post('/', async (req, res) => {
    try {
        const { label, url, forAll, forName } = req.body;
        const newLink = new Link({
            label,
            url,
            forAll,
            forName: forAll ? null : forName,
        });
        await newLink.save();
        res.status(201).json({ message: 'リンクを作成しました', link: newLink });
    } catch (err) {
        console.error('リンク作成エラー:', err);
        res.status(500).json({ error: 'リンク作成に失敗しました' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { label, url, forAll, forName } = req.body;
        const updated = await Link.findByIdAndUpdate(
            req.params.id,
            { label, url, forAll, forName },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: 'リンクが見つかりません' });
        res.json({ message: '更新成功', link: updated });
    } catch (err) {
        console.error('リンク更新エラー:', err);
        res.status(500).json({ error: '更新失敗' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Link.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'リンクが見つかりません' });
        }
        res.json({ message: 'リンクを削除しました' });
    } catch (err) {
        console.error('リンク削除エラー:', err);
        res.status(500).json({ error: '削除に失敗しました' });
    }
});

module.exports = router;
