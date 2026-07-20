# 诗歌阅读 - 部署指南

## 后端：Railway

### 前置条件
- Railway 账号 + CLI 已安装
- PostgreSQL 数据库（Railway 自动提供或外部）

### 部署步骤
```bash
cd backend

# 1. 登录 Railway
railway login

# 2. 初始化项目
railway init

# 3. 添加 PostgreSQL 插件（如需要）
railway add -d postgresql

# 4. 设置环境变量（Railway 会提供 DATABASE_URL）
railway variables set DATABASE_URL=postgresql://...

# 5. 部署
railway up
```

Railway 会自动识别 `railway.json` 和 `Procfile`。

### 环境变量
| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `PORT` | Railway 自动分配 |

---

## 前端：Vercel

### 前置条件
- Vercel 账号 + CLI 已安装
- GitHub 仓库（推荐）

### 部署步骤
```bash
cd frontend

# 1. 登录 Vercel
vercel login

# 2. 部署（首次需配置）
vercel

# 配置提示：
#   - Framework Preset: Vite
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Root Directory: frontend

# 3. 设置环境变量
vercel env add VITE_API_BASE_URL
# 输入 Railway 后端地址，如 https://xxx.railway.app

# 4. 正式部署
vercel --prod
```

### 环境变量
| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `https://poetry-api.railway.app` |

### SPA 路由
`vercel.json` 已配置 rewrite 规则，所有路由指向 `index.html`。

---

## 数据导入

线上部署后需要导入唐诗数据：

```bash
# Railway 上执行
railway connect postgresql
# 然后导入 import_poetry.py 的数据
```

---

## 验证清单
- [ ] 后端 `/health` 返回 OK
- [ ] 后端 `/api/poems/random` 返回诗歌
- [ ] 前端可访问并显示诗歌
- [ ] PWA 可安装（浏览器地址栏出现安装图标）
- [ ] 搜索功能正常
- [ ] 字号切换功能正常
- [ ] 海报生成功能正常
