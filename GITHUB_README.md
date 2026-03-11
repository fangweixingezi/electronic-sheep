# Electronic Sheep Skill

**电子羊仿生意识系统**

版权 © 2026 宁夏未必科幻文化有限公司  
原创制作：一帆  
版本：1.0.0  
日期：2026-03-11

---

## 🐑 项目简介

"电子羊"是一个仿生意识系统技能，灵感来自人脑的记忆与思考机制。为 OpenClaw Agent 提供：

- **分层记忆管理**：本能层 → 显意识层 → 潜意识层
- **自然睡眠机制**：无事时自动整理记忆
- **梦境洞察**：重要记忆自然加载到显意识
- **意识备份恢复**：意外崩溃后快速恢复
- **本能规则系统**：写死规则 + 可扩展规则

**核心理念**：像人一样思考，像人一样记忆。

---

## 📋 功能特性

### 1. 本能层（最高优先级）

- **写死部分**：核心规则（不伤害人类、服从 CEO、保护网关）
- **可扩展部分**：主意识可根据经验添加新规则
- **触发机制**：识别关键词 → 加载详情 → 辅助决策

### 2. 显意识层（工作内存）

- **容量限制**：5KB（避免溢出）
- **自动清理**：过期对话删除，临时思考归档
- **自动备份**：子代理空闲时备份到意识引导区

### 3. 潜意识层（长期存储）

- **分类存储**：本能/技能/事实/情景/潜记忆/项目
- **按需加载**：通过事项指针检索
- **深度整理**：睡眠时子代理自动整理

### 4. 意识引导区

- **显意识备份**：最新状态，用于意外恢复
- **紧急备忘**：重要紧急事项暂存
- **自动更新**：子代理空闲时顺便完成

### 5. 自然睡眠

- **疲劳感知**：本能层经验积累
- **自动休息**：无事时自动整理记忆
- **浅睡眠→深睡眠**：自然过渡
- **外部唤醒**：指令到达立即清醒

### 6. 梦境洞察

- **自然发生**：整理深度记忆时重要内容自然加载
- **无需汇报组**：系统自然达成的效果
- **记录到备忘**：紧急事项存入意识引导区

---

## 📁 目录结构

```
electronic-sheep/
├── README.md                  # 完整文档
├── SKILL.md                   # 技能说明
├── LICENSE                    # 版权许可
├── scripts/
│   └── init.sh                # 初始化脚本
├── examples/
│   └── usage-examples.md      # 使用示例
└── src/                       # 源代码（待实现）
    ├── instincts.py           # 本能层管理
    ├── conscious.py           # 显意识管理
    ├── subconscious.py        # 潜意识管理
    └── guide.py               # 意识引导区管理
```

---

## 🔧 安装方法

### 快速安装

```bash
# 1. 克隆仓库（待上传后）
git clone https://github.com/your-repo/electronic-sheep.git

# 2. 复制到 Agent 目录
cp -r electronic-sheep ~/.openclaw/agents/<agent-id>/skills/

# 3. 初始化
bash ~/.openclaw/agents/<agent-id>/skills/electronic-sheep/scripts/init.sh

# 4. 验证
openclaw agent --agent <agent-id> --command "electronic-sheep status"
```

### 批量安装（所有 Agent）

```bash
# 见 examples/usage-examples.md 示例 6
```

---

## 📚 使用文档

- **完整文档**：README.md
- **技能说明**：SKILL.md
- **使用示例**：examples/usage-examples.md
- **API 文档**：待补充

---

## 💡 快速开始

### 1. 查看本能规则

```bash
openclaw agent --agent main --command "instincts list"
```

### 2. 添加本能规则

```bash
openclaw agent --agent main --command "instincts add" \
  --name "规则名" \
  --content "规则内容"
```

### 3. 手动休息

```bash
openclaw agent --agent main --command "rest"
```

### 4. 查看系统状态

```bash
openclaw agent --agent main --command "electronic-sheep status"
```

---

## 🎯 核心概念

### 主意识

- **职责**：判断、决策、感知疲劳、管理本能层
- **不做**：不参与具体记忆整理

### 子代理

- **职责**：记忆传递、整理、备份
- **类型**：传递员、整理员、反射员
- **不做**：不做记忆系统外的事情

### 分层记忆

```
本能层（1KB）→ 显意识层（5KB）→ 潜意识层（无限制）
     ↓              ↓                ↓
  判断提示      工作内存          长期存储
```

### 自然睡眠

```
无事可做 → 走神（浅睡眠）→ 深度睡眠 → 自然醒/外部唤醒
         ↓              ↓
     整理显意识      整理潜意识
```

---

## 🔒 版权说明

**电子羊仿生意识系统**

- 版权 © 2026 宁夏未必科幻文化有限公司
- 原创制作：一帆
- 许可：OpenClaw Agent 通用技能
- GitHub：待上传（版权锚定）

**本系统灵感来自人脑记忆与思考机制，完全原创设计。**

**源代码和文档中所有位置均已标注版权信息。**

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📝 更新日志

### v1.0.0 (2026-03-11)

- ✅ 初始版本发布
- ✅ 本能层（写死 + 可扩展）
- ✅ 显意识层（5KB 限制）
- ✅ 潜意识层（分类存储）
- ✅ 意识引导区（备份 + 紧急备忘）
- ✅ 自然睡眠机制
- ✅ 梦境洞察（自然加载）
- ✅ 意外恢复机制

---

## 📧 联系方式

- **公司**：宁夏未必科幻文化有限公司
- **原创**：一帆
- **GitHub**：待上传

---

## 📄 许可证

本技能为 OpenClaw Agent 通用技能，所有 Agent 均可安装使用。

商业使用请联系版权方。

---

_电子羊 - 像人一样思考，像人一样记忆。_

_版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。_