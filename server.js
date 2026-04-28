import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3777;

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw', 'openclaw.json');

app.use(express.json({ limit: '10mb' }));

// 备份配置
function backupConfig() {
  const backupDir = path.join(process.env.HOME, '.openclaw');
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `openclaw.json.editor-bak-${ts}`);
  fs.copyFileSync(CONFIG_PATH, backupPath);
  // 最多保留 10 个编辑器备份
  const files = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('openclaw.json.editor-bak-'))
    .sort();
  while (files.length > 10) {
    fs.unlinkSync(path.join(backupDir, files.shift()));
  }
  return backupPath;
}

// 读取配置
function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

// 写入配置
function writeConfig(config) {
  backupConfig();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  return true;
}

// API: 获取完整配置
app.get('/api/config', (req, res) => {
  try {
    const config = readConfig();
    res.json({ ok: true, data: config });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 备份配置（原路径+原文件名+时间戳）
app.post('/api/backup', (req, res) => {
  try {
    const ts = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    const backupPath = CONFIG_PATH + '.' + ts;
    fs.copyFileSync(CONFIG_PATH, backupPath);
    res.json({ ok: true, path: backupPath });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 保存完整配置
app.post('/api/config', (req, res) => {
  try {
    writeConfig(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 获取模型配置
app.get('/api/models', (req, res) => {
  try {
    const config = readConfig();
    res.json({ ok: true, data: config.models || { mode: 'merge', providers: {} } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 保存模型配置
app.post('/api/models', (req, res) => {
  try {
    const config = readConfig();
    config.models = req.body;
    writeConfig(config);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 获取代理配置（模型相关部分）
app.get('/api/agents', (req, res) => {
  try {
    const config = readConfig();
    res.json({ ok: true, data: config.agents || {} });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// API: 保存代理配置
app.post('/api/agents', (req, res) => {
  try {
    const config = readConfig();
    config.agents = req.body;
    writeConfig(config);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`\n  🐾 OpenClaw 配置编辑器已启动`);
  console.log(`  👉 打开浏览器访问: http://localhost:${PORT}\n`);
});
