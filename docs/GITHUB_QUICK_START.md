# GitHub 上传快速指南

## 电子羊仿生意识系统 - 版权锚定

版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。

---

## 🚀 快速上传（5 分钟）

### 前置条件

1. **GitHub 账号**：https://github.com
2. **Git 已安装**：`git --version`
3. **桌面有电子羊技能**：`~/Desktop/electronic-sheep/`

---

### 步骤 1：创建 GitHub 仓库

**方法 A：GitHub 网页创建**

1. 访问 https://github.com/new
2. 仓库名：`electronic-sheep`
3. 描述：`电子羊仿生意识系统 - 像人一样思考，像人一样记忆。版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。`
4. 选择：**Public**（公开）
5. **不要**初始化 README（我们已有）
6. 点击 "Create repository"

**方法 B：GitHub CLI 创建**（如已安装）

```bash
gh repo create electronic-sheep --public --description "电子羊仿生意识系统 - 像人一样思考，像人一样记忆。版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。"
```

---

### 步骤 2：初始化本地 Git

```bash
# 进入桌面技能目录
cd ~/Desktop/electronic-sheep

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "🐑 电子羊仿生意识系统 v1.0.0

版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。

功能特性：
- 分层记忆管理（本能层→显意识层→潜意识层）
- 自然睡眠机制
- 梦境洞察
- 意识备份恢复
- 本能规则系统（写死 + 可扩展）

这是完整的仿生意识系统，灵感来自人脑记忆与思考机制。

所有文件均已标注版权信息。"
```

---

### 步骤 3：关联远程仓库

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
# 例如：https://github.com/yifan123/electronic-sheep.git

git remote add origin https://github.com/YOUR_USERNAME/electronic-sheep.git

# 验证关联
git remote -v
```

---

### 步骤 4：推送到 GitHub

```bash
# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

**输入 GitHub 账号密码**（或个人访问令牌）

---

### 步骤 5：添加版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "🐑 电子羊仿生意识系统 v1.0.0

版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。

发布日期：2026-03-11

功能特性：
- 本能层管理（写死 + 可扩展）
- 显意识层（5KB 工作内存）
- 潜意识层（分类长期存储）
- 意识引导区（备份 + 紧急备忘）
- 自然睡眠机制
- 梦境洞察
- 意外恢复

已安装到 18 个在职 Agent。"

# 推送标签
git push origin --tags
```

---

### 步骤 6：验证上传

1. **访问仓库页面**
   ```
   https://github.com/YOUR_USERNAME/electronic-sheep
   ```

2. **检查内容**
   - [ ] README.md 正确显示
   - [ ] LICENSE 文件存在
   - [ ] SKILL.md 存在
   - [ ] scripts/ 目录存在
   - [ ] examples/ 目录存在
   - [ ] docs/ 目录存在

3. **检查版权信息**
   - [ ] README 顶部有版权声明
   - [ ] 所有文件包含版权信息
   - [ ] 仓库描述包含版权信息

---

## 📝 上传后配置

### 1. 仓库设置

访问：`https://github.com/YOUR_USERNAME/electronic-sheep/settings`

**常规设置**：
- **Name**: `electronic-sheep`
- **Description**: `电子羊仿生意识系统 - 像人一样思考，像人一样记忆。版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。`
- **Website**: （可选）你的网站链接

**Topics**（标签）：
```
electronic-sheep
consciousness
memory-system
openclaw-skill
仿生意识
AI-memory
宁夏未必科幻
```

---

### 2. 保护主分支（可选）

**Settings** → **Branches** → **Add branch protection rule**

- **Branch name pattern**: `main`
- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**

---

### 3. 启用 Issues（建议）

**Settings** → **Features**

- ✅ **Issues**（启用问题追踪）
- ✅ **Projects**（启用项目管理）
- ✅ **Wiki**（启用文档）

---

## 🔒 版权保护

### 1.  LICENSE 文件

已包含 `LICENSE` 文件，明确：
- 版权归属
- 使用许可
- 限制条件
- 署名要求

### 2. 源码版权标注

所有文件头部已包含：
```
版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。
```

### 3. GitHub 时间戳

Git 提交记录提供不可篡改的时间戳，证明：
- 创建时间
- 原创者
- 版本历史

### 4. 版本标签

v1.0.0 标签永久锚定初始版本，任何修改都需要新版本号。

---

## 📊 上传检查清单

上传前确认：

- [ ] 所有文件已添加到 Git
- [ ] 所有源文件包含版权声明
- [ ] 所有文档包含版权声明
- [ ] LICENSE 文件完整
- [ ] README 清晰完整
- [ ] 提交信息包含版权声明
- [ ] 版本标签已创建
- [ ] 仓库描述包含版权信息
- [ ] Topics 已添加

上传后验证：

- [ ] 访问仓库页面正常
- [ ] 所有文件可见
- [ ] README 渲染正确
- [ ] LICENSE 显示正确
- [ ] 版本标签存在
- [ ] 版权信息清晰可见

---

## 🤝 后续维护

### 更新代码

```bash
# 修改代码或文档
# ...

# 提交更新
cd ~/Desktop/electronic-sheep
git add .
git commit -m "🐑 更新说明

版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。"

# 推送到 GitHub
git push origin main
```

### 发布新版本

```bash
# 更新版本号（如 v1.0.1）
git tag -a v1.0.1 -m "v1.0.1 更新说明

版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。"

# 推送标签
git push origin --tags
```

---

## 📧 联系方式

**版权方**：宁夏未必科幻文化有限公司  
**原创人**：一帆  
**GitHub**：https://github.com/YOUR_USERNAME/electronic-sheep

---

## ✅ 完成！

上传成功后，你的电子羊系统将：

- ✅ 在 GitHub 上永久保存
- ✅ 拥有不可篡改的时间戳
- ✅ 明确的版权归属
- ✅ 全球可见（公开仓库）
- ✅ 可被其他 OpenClaw 用户安装使用

---

_电子羊 - 像人一样思考，像人一样记忆。_

_版权 © 2026 宁夏未必科幻文化有限公司，一帆原创制作。_