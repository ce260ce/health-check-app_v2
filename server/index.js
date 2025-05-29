// 完全修正版の `index.js`（サーバー側）
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const connectWithRetry = () => {
  mongoose.connect('mongodb://mongo:27017/healthcheck', {
    // オプションは不要（v7以降はデフォルト有効）
  })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
      console.error('❌ MongoDB connection failed. Retrying in 5 seconds...', err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// ----------------- Health -----------------
const HealthSchema = new mongoose.Schema({
  name: String,
  condition: String,
  conditionReason: String,
  breakfast: String,
  task: String,
  ky: String,
  date: { type: Date, default: Date.now },
})
const Health = mongoose.model('Health', HealthSchema)

app.post('/api/health', async (req, res) => {
  try {
    const inputDate = req.body.date ? new Date(req.body.date) : new Date()
    const jstDate = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()))
    const filter = { name: req.body.name, date: jstDate }
    const update = {
      condition: req.body.condition,
      conditionReason: req.body.conditionReason || '',
      breakfast: req.body.breakfast,
      task: req.body.task,
      ky: req.body.ky,
    }
    const options = { upsert: true, new: true, setDefaultsOnInsert: true }
    const result = await Health.findOneAndUpdate(filter, update, options)
    res.status(200).json({ message: '保存または更新しました', data: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'サーバーエラー' })
  }
})

app.get('/api/health', async (req, res) => {
  const year = parseInt(req.query.year)
  const month = parseInt(req.query.month)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const records = await Health.find({ date: { $gte: startDate, $lt: endDate } })

  // 👇 フロントと比較しやすいように date を整形
  const formatted = records.map(r => ({
    ...r._doc,
    date: r.date.toISOString().split('T')[0], // "2025-05-21"
  }))

  res.json(formatted)
})

app.get('/api/health/all', async (req, res) => {
  try {
    const records = await Health.find({})

    // date を yyyy-mm-dd に整形して返す
    const formatted = records.map(r => ({
      ...r._doc,
      date: r.date.toISOString().split('T')[0],
    }))

    res.json(formatted)
  } catch (err) {
    console.error('全件取得エラー:', err)
    res.status(500).json({ error: '全件取得失敗' })
  }
})

// ----------------- 名前管理 -----------------
const NameSchema = new mongoose.Schema({ name: String })
const Name = mongoose.model('Name', NameSchema)

app.get('/api/names', async (req, res) => {
  try {
    const names = await Name.find()
    res.json(names)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '取得エラー' })
  }
})

app.post('/api/names', async (req, res) => {
  try {
    const newName = new Name({ name: req.body.name })
    await newName.save()
    res.status(201).json({ message: '追加完了' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '追加失敗' })
  }
})

app.delete('/api/names/:id', async (req, res) => {
  try {
    await Name.findByIdAndDelete(req.params.id)
    res.json({ message: '削除完了' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '削除失敗' })
  }
})

// ----------------- タスク管理 -----------------
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  files: [
    {
      fileName: String,
      filePath: String,
    },
  ],
  checkedBy: { type: Map, of: Boolean, default: {} },
  isCompleted: { type: Boolean, default: false },
})
const Task = mongoose.model('Task', TaskSchema)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage })

app.post('/api/tasks', upload.array('files'), async (req, res) => {
  const { title, description, dueDate } = req.body
  const fileData = (req.files || []).map(file => ({
    fileName: file.originalname,
    filePath: `/uploads/${file.filename}`,
  }))
  const newTask = new Task({ title, description, dueDate, files: fileData })
  await newTask.save()
  res.status(201).json({ message: 'タスク追加成功', task: newTask })
})

app.put('/api/tasks/:id', upload.array('files'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'タスクが見つかりません' })
    }

    task.title = req.body.title
    task.description = req.body.description
    task.dueDate = req.body.dueDate

    const files = req.files || []
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
      }))
      task.files = [...task.files, ...newFiles]
    }

    await task.save()
    res.json({ message: '更新しました', data: task })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新失敗' })
  }
})

app.post('/api/tasks/:id/check', async (req, res) => {
  const { name, checked } = req.body
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'タスクが見つかりません' })
  task.checkedBy.set(name, checked)
  const allNames = await Name.find().lean()
  const nameList = allNames.map(n => n.name)
  const allChecked = nameList.every(n => task.checkedBy.get(n))
  task.isCompleted = allChecked

  await task.save()
  res.json({ message: 'チェック更新成功', isCompleted: task.isCompleted })
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ error: 'タスクが見つかりません' })
    res.json({ message: '削除しました' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '削除失敗' })
  }
})

app.delete('/api/tasks/:id/file/:filename', async (req, res) => {
  const { id, filename } = req.params
  try {
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'タスクが見つかりません' })

    const fileToDelete = task.files.find(f => f.fileName === filename)
    if (!fileToDelete) return res.status(404).json({ error: '対象ファイルが見つかりません' })

    // ファイルを物理削除
    await fsPromises.unlink(path.join(__dirname, fileToDelete.filePath)).catch((err) => {
      console.warn('物理削除失敗:', err.message)
    })

    // DB 更新
    task.files = task.files.filter(f => f.fileName !== filename)
    await task.save()

    res.json({ message: 'ファイル削除完了' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '削除失敗' })
  }
})

app.put('/api/tasks/:id/complete', async (req, res) => {
  const { isCompleted } = req.body
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'タスクが見つかりません' })

    task.isCompleted = isCompleted
    await task.save()

    res.json({ message: '完了状態を更新しました', task })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新失敗' })
  }
})

app.get('/api/tasks', async (req, res) => {
  const filter = {}
  if (req.query.completed === 'true') filter.isCompleted = true
  if (req.query.completed === 'false') filter.isCompleted = false

  const tasks = await Task.find(filter)
  res.json(tasks)
})

// ----------------- リンク作成 -----------------
const Link = require('./models/Link')

app.get('/api/links', async (req, res) => {
  try {
    const links = await Link.find()
    res.json(links || [])
  } catch (err) {
    console.error('リンク取得失敗', err)
    res.status(500).json([])
  }
})

// POST: 新しいリンクを作成
app.post('/api/links', async (req, res) => {
  try {
    const { label, url, forAll, forName } = req.body

    const newLink = new Link({
      label,
      url,
      forAll,
      forName: forAll ? null : forName,
    })

    await newLink.save()
    res.status(201).json({ message: 'リンクを作成しました', link: newLink })
  } catch (err) {
    console.error('リンク作成エラー:', err)
    res.status(500).json({ error: 'リンク作成に失敗しました' })
  }
})

// リンク更新
app.put('/api/links/:id', async (req, res) => {
  try {
    const { label, url, forAll, forName } = req.body
    const updated = await Link.findByIdAndUpdate(
      req.params.id,
      { label, url, forAll, forName },
      { new: true },
    )
    if (!updated) return res.status(404).json({ error: 'リンクが見つかりません' })
    res.json({ message: '更新成功', link: updated })
  } catch (err) {
    console.error('リンク更新エラー:', err)
    res.status(500).json({ error: '更新失敗' })
  }
})

// リンク削除
app.delete('/api/links/:id', async (req, res) => {
  try {
    const result = await Link.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(404).json({ error: 'リンクが見つかりません' })
    }
    res.json({ message: 'リンクを削除しました' })
  } catch (err) {
    console.error('リンク削除エラー:', err)
    res.status(500).json({ error: '削除に失敗しました' })
  }
})

// ----------------- 掲示板管理 -----------------
const BulletinSchema = new mongoose.Schema({
  title: String,
  description: String,
  visibleUntil: Date,
  postedBy: String,
  files: [
    {
      name: String,
      url: String,
    },
  ],
  checkedBy: { type: Map, of: Boolean, default: {} },
  createdAt: { type: Date, default: Date.now },
})
const Bulletin = mongoose.model('Bulletin', BulletinSchema)

app.post('/api/bulletins', upload.array('files'), async (req, res) => {
  try {
    const { title, description, visibleUntil, postedBy } = req.body
    const files = (req.files || []).map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
    }))
    const newBulletin = new Bulletin({
      title,
      description,
      visibleUntil,
      postedBy,
      files,
    })
    await newBulletin.save()
    res.status(201).json({ message: '掲示を投稿しました', bulletin: newBulletin })
  } catch (err) {
    console.error('掲示投稿エラー:', err)
    res.status(500).json({ error: '投稿失敗' })
  }
})

app.get('/api/bulletins', async (req, res) => {
  try {
    const bulletins = await Bulletin.find()
    res.json(bulletins)
  } catch (err) {
    console.error('掲示取得エラー:', err)
    res.status(500).json({ error: '取得失敗' })
  }
})

app.post('/api/bulletins/:id/read', async (req, res) => {
  try {
    const { name, checked } = req.body
    const bulletin = await Bulletin.findById(req.params.id)
    if (!bulletin) return res.status(404).json({ error: '掲示が見つかりません' })

    // checked が true → set, false → delete
    if (checked) {
      bulletin.checkedBy.set(name, true)
    } else {
      bulletin.checkedBy.delete(name)
    }

    await bulletin.save()
    res.json({ message: 'チェック状態を更新しました' })
  } catch (err) {
    console.error('チェック更新エラー:', err)
    res.status(500).json({ error: 'チェック更新失敗' })
  }
})

app.delete('/api/bulletins/:id', async (req, res) => {
  try {
    const result = await Bulletin.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ error: '掲示が見つかりません' })
    res.json({ message: '掲示を削除しました' })
  } catch (err) {
    console.error('掲示削除エラー:', err)
    res.status(500).json({ error: '削除に失敗しました' })
  }
})

app.put('/api/bulletins/:id', async (req, res) => {
  try {
    const { title, description, visibleUntil, postedBy } = req.body

    const updated = await Bulletin.findByIdAndUpdate(
      req.params.id,
      { title, description, visibleUntil, postedBy },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: '掲示が見つかりません' })

    res.json({ message: '掲示を更新しました', bulletin: updated })
  } catch (err) {
    console.error('掲示更新エラー:', err)
    res.status(500).json({ error: '更新に失敗しました' })
  }
})

const cleanupOldUploads = require('./utils/cleanupOldUploads');

// 起動時に一度実行
cleanupOldUploads();

// 定期実行（例: 12時間ごと）
setInterval(cleanupOldUploads, 24 * 60 * 60 * 1000); // 毎12時間

app.listen(5500, () => console.log('🚀 APIサーバー起動: http://localhost:5500'))