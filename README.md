# OpenClaw Config Editor

OpenClaw 配置文件的 Web GUI 编辑器，提供可视化的配置管理界面，避免手动编辑 JSON 出错。

## 功能

- **模型 Provider** — 管理 `config.models` 下的 Provider 定义（API 接入、模型参数），支持下拉选择
- **模型配置** — 管理 `config.agents.defaults.models` 下的 slug → 别名/params 映射，params 可折叠
- **代理配置** — 管理每个代理的模型（下拉选择）、fallback（可排序多选）、thinking、params 等
- **默认设置** — 管理 `config.agents.defaults` 下的主模型、fallback、图片模型、timeout 等
- **插件配置** — 管理 `config.plugins.allow` 插件白名单，支持勾选启用，内置 80+ 插件说明
- **原始 JSON** — 直接编辑完整 JSON，支持格式化
- **备份** — 一键备份配置文件（`openclaw.json.YYYYMMDDHHMMSS`），自动保存时也会创建备份（最多保留 10 个）

## 快速开始

```bash
# 安装依赖
npm install

# 启动
npm run dev
```

浏览器访问 [http://localhost:3777](http://localhost:3777)

## 配置文件路径

默认读取 `~/.openclaw/openclaw.json`。

## 技术栈

- 后端：Express 5
- 前端：原生 HTML/CSS/JS（零框架依赖）

## License

MIT
