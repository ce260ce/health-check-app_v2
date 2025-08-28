const express = require('express');
const router = express.Router();
const Name = require('../models/Name');

router.get('/', async (req, res) => {
    try {
        const names = await Name.find();
        res.json(names);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '取得エラー' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newName = new Name({ name: req.body.name });
        await newName.save();
        res.status(201).json({ message: '追加完了' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '追加失敗' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Name.findByIdAndDelete(req.params.id);
        res.json({ message: '削除完了' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '削除失敗' });
    }
});

module.exports = router;
