const express = require('express');
const router = express.Router();
const Health = require('../models/Health');

router.post('/', async (req, res) => {
    try {
        const inputDate = req.body.date ? new Date(req.body.date) : new Date();
        const jstDate = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()));
        const filter = { name: req.body.name, date: jstDate };
        const update = {
            condition: req.body.condition,
            conditionReason: req.body.conditionReason || '',
            breakfast: req.body.breakfast,
            task: req.body.task,
            ky: req.body.ky,
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const result = await Health.findOneAndUpdate(filter, update, options);
        res.status(200).json({ message: '保存または更新しました', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

router.get('/', async (req, res) => {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const records = await Health.find({ date: { $gte: startDate, $lt: endDate } });
    const formatted = records.map(r => ({ ...r._doc, date: r.date.toISOString().split('T')[0] }));

    res.json(formatted);
});

router.get('/all', async (req, res) => {
    try {
        const records = await Health.find({});
        const formatted = records.map(r => ({ ...r._doc, date: r.date.toISOString().split('T')[0] }));
        res.json(formatted);
    } catch (err) {
        console.error('全件取得エラー:', err);
        res.status(500).json({ error: '全件取得失敗' });
    }
});

module.exports = router;