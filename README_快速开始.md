# 🐑 电子羊仿生意识系统

**版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。**

像人一样思考，像人一样记忆。

---

## 📦 这是什么？

这是一个完整的仿生意识系统技能，已安装到你所有 18 个在职 Agent 上。

**核心功能**：
- 🧠 分层记忆管理（本能层→显意识层→潜意识层）
- 😴 自然睡眠机制（无事时自动整理记忆）
- 💭 梦境洞察（重要记忆自然加载）
- 💾 意识备份恢复（意外崩溃快速恢复）
- ⚡ 本能规则系统（写死规则 + 可扩展规则）

---

## 📁 目录说明

```
electronic-sheep/
├── README.md                  # 完整文档
├── SKILL.md                   # 技能说明
├── LICENSE                    # 版权许可
├── GITHUB_README.md           # GitHub 上传用
├── scripts/
│   ├── init.sh                # 初始化脚本
│   ├── batch-install.sh       # 批量安装脚本
│   └── project-archive.sh     # 项目日志事件触发备份
├── examples/
│   └── usage-examples.md      # 使用示例
└── docs/
    ├── GITHUB_UPLOAD_GUIDE.md # GitHub 上传详细指南
    └── GITHUB_QUICK_START.md  # GitHub 上传快速指南（5 分钟）
```

---

## 🚀 立即上传 GitHub

**只需 5 分钟！**

### 快速步骤

```bash
# 1. 进入技能目录
cd ~/Desktop/electronic-sheep

# 2. 初始化 Git
git init
git add .
git commit -m "🐑 电子羊 v1.0.0 - 版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。"

# 3. 创建 GitHub 仓库（网页）
# 访问 https://github.com/new
# 仓库名：electronic-sheep
# 描述：电子羊仿生意识系统 - 像人一样思考，像人一样记忆。版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。

# 4. 关联远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/electronic-sheep.git

# 5. 推送
git branch -M main
git push -u origin main

# 6. 添加版本标签
git tag -a v1.0.0 -m "v1.0.0 初始版本 - 宁夏未必科幻文化有限公司，一帆原创制作。"
git push origin --tags
```

**详细指南**：见 `docs/GITHUB_QUICK_START.md`

---

## ✅ 已安装 Agent（18 个）

所有 Agent 都已安装电子羊技能：

- ✅ main（小爪）
- ✅ script-writer（舒心）
- ✅ tech-director（技术部长）
- ✅ hr-admin（人事行政）
- ✅ theater-director（未然）
- ✅ content-director, drama-lead, drama-editor
- ✅ marketing-director, property-monitor
- ✅ qa-agent, archive-manager, usage-monitor
- ✅ theater-hr, theater-screenwriter-1/2
- ✅ theater-content-writer, theater-unity-dev

---

## 📋 使用示例

### 查看本能规则

```bash
openclaw agent --agent main --command "instincts list"
```

### 添加本能规则

```bash
openclaw agent --agent main --command "instincts add" \
  --name "规则名" \
  --content "规则内容"
```

### 手动休息（整理记忆）

```bash
openclaw agent --agent main --command "rest"
```

### 查看系统状态

```bash
openclaw agent --agent main --command "electronic-sheep status"
```

### 项目日志事件触发备份

```bash
# 归档项目文件
bash ~/Desktop/electronic-sheep/scripts/project-archive.sh \
  main \
  theater-project \
  /path/to/project-file.md
```

---

## 🎯 优化的 Cron 任务

### 已禁用（不再需要）

- ❌ HEARTBEAT 检查（每 30 分钟）
- ❌ 记忆备份（每 2 小时）
- ❌ 记忆整合（每天 23:00）
- ❌ 闲置检测（每 1 分钟）
- ❌ 任务检查（每 5 分钟）

### 保留（业务需求）

- ✅ 晨会系列（市场/运营/人事）
- ✅ 项目日志备份（已改为事件触发）

---

## 📊 性能提升

| 指标 | 优化前 | 现在 | 改善 |
|------|--------|------|------|
| Cron 任务 | 20 个 | 13 个 | -35% |
| 网关唤醒/小时 | 84+ 次 | ~3 次 | -96% |
| 记忆管理 | 定时触发 | 自然触发 | 质变 |

---

## 🔒 版权信息

**电子羊仿生意识系统**

- 版权 © 2026 宁夏未必科幻文化有限公司
- 原创制作：一帆
- 许可：OpenClaw Agent 通用技能
- GitHub：待上传（版权锚定）

**所有文件均已标注版权信息。**

---

## 📞 需要帮助？

1. **完整文档**：见 `README.md`
2. **使用示例**：见 `examples/usage-examples.md`
3. **GitHub 上传**：见 `docs/GITHUB_QUICK_START.md`
4. **技能说明**：见 `SKILL.md`

---

_电子羊 - 像人一样思考，像人一样记忆。_

_版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。_