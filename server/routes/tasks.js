const express = require('express');
const multer = require('multer');
const path = require('path');
const fsPromises = require('fs/promises');
const Task = require('../models/Task');
const Name = require('../models/Name');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/', upload.array('files'), async (req, res) => {
    const { title, description, startDate, dueDate } = req.body;
    const fileData = (req.files || []).map(file => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
    }));
    const newTask = new Task({
        title,
        description,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        files: fileData,
    });
    await newTask.save();
    res.status(201).json({ message: 'タスク追加成功', task: newTask });
});

router.put('/:id', upload.array('files'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'タスクが見つかりません' });
        task.title = req.body.title;
        task.description = req.body.description;
        task.startDate = new Date(req.body.startDate);
        task.dueDate = new Date(req.body.dueDate);
        const files = req.files || [];
        if (files.length > 0) {
            const newFiles = files.map(file => ({
                fileName: file.originalname,
                filePath: `/uploads/${file.filename}`,
            }));
            task.files = [...task.files, ...newFiles];
        }
        await task.save();
        res.json({ message: '更新しました', data: task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '更新失敗' });
    }
});

router.post('/:id/check', async (req, res) => {
    const { name, checked } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'タスクが見つかりません' });
    task.checkedBy.set(name, checked);
    const allNames = await Name.find().lean();
    const nameList = allNames.map(n => n.name);
    const allChecked = nameList.every(n => task.checkedBy.get(n));
    task.isCompleted = allChecked;
    await task.save();
    res.json({ message: 'チェック更新成功', isCompleted: task.isCompleted });
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'タスクが見つかりません' });
        res.json({ message: '削除しました' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '削除失敗' });
    }
});

router.delete('/:id/file/:filename', async (req, res) => {
    const { id, filename } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'タスクが見つかりません' });
        const fileToDelete = task.files.find(f => f.fileName === filename);
        if (!fileToDelete) return res.status(404).json({ error: '対象ファイルが見つかりません' });
        await fsPromises.unlink(path.join(__dirname, '..', fileToDelete.filePath)).catch(err => {
            console.warn('物理削除失敗:', err.message);
        });
        task.files = task.files.filter(f => f.fileName !== filename);
        await task.save();
        res.json({ message: 'ファイル削除完了' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '削除失敗' });
    }
});

router.put('/:id/complete', async (req, res) => {
    const { isCompleted } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'タスクが見つかりません' });
        task.isCompleted = isCompleted;
        await task.save();
        res.json({ message: '完了状態を更新しました', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '更新失敗' });
    }
});

router.get('/', async (req, res) => {
    const filter = {};
    if (req.query.completed === 'true') filter.isCompleted = true;
    if (req.query.completed === 'false') filter.isCompleted = false;
    const tasks = await Task.find(filter);
    res.json(tasks);
});

module.exports = router;
