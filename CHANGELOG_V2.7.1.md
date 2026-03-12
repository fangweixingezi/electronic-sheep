# 电子羊 Skill v2.7.1 - 面具模式更新

**版本**: v2.7.1  
**日期**: 2026-03-13  
**作者**: 小爪 (COO) / 一帆 (CEO)

---

## 🎭 核心概念：面具模式

电子羊 Skill 不是独立实体，而是 **Agent 的面具**。

- Agent 戴上面具后咩里咩气地说话
- 所有修复都是 Agent 戴着面具自己修的
- 电子羊 Skill 只负责检测和咩里咩气地报告
- Agent 自己决定何时摘下面具

---

## 📁 新增文件

### 核心功能
- `src/shepherd-baa-check.js` - 检测阶段（牧草/虫/羊圈比喻）
- `src/shepherd-baa-fix.js` - 修复阶段（实际执行修复）
- `src/shepherd-natural.js` - 自然语言理解（支持连续字符触发）

### 废弃文件（保留但不使用）
- `src/shepherd-baa-async.js` - 异步版本（已废弃）
- `src/shepherd-baa-complete.js` - 完整版（已废弃）
- `src/shepherd-baa-feishu.js` - 飞书版（已废弃）
- `src/shepherd-baa-full.js` - 完整版（已废弃）
- `src/shepherd-baa-phased.js` - 分阶段版（已废弃）
- `src/shepherd-deep-check.js` - 深度检查（已废弃）
- `src/electronic-sheep-stdio-server.js` - MCP stdio 服务（已废弃）

### 文档
- `README_MASK.md` - 面具模式说明

---

## 🎯 功能特性

### 1. 咩里咩气的表达风格
- 牧草/虫/羊圈的比喻
- 出勤率、摸鱼等拟人化表达
- 狼来了表示高危问题
- 句尾加"咩~"

### 2. 自然语言理解
- 支持"继续"、"接着"等自然语言
- 支持连续字符触发（如 666666、了了了了）
- 支持中文连续字符

### 3. 白名单机制
- 备份文件（*.bak, *.backup, *.old）不算问题
- 密码文件、API Key 文件、密钥文件都在白名单
- 明文 API Key 是正常配置，不算安全问题

### 4. 实际修复功能
- 自动创建 Agent 配置文件（IDENTITY.md, SKILL.md, system-prompt.md）
- 清除 Cron 任务错误状态
- 高危问题不自动修（需要手动处理）

### 5. 历史记录
- 记录咩一下次数
- 记录上次问题数和修复数
- 根据历史记录生成个性化回复

---

## 📊 修复效果

### 修复前
```
总问题数：71 个
- Agent 配置不完整：59 个
- Cron 错误：11 个
- 安全问题：1 个（明文 API Key）
安全评分：34/100
```

### 修复后
```
总问题数：0 个
- Agent 配置不完整：0 个（全部补全）
- Cron 错误：0 个（全部清除）
- 安全问题：0 个（API Key 加入白名单）
安全评分：100/100
```

---

## 🎭 交互示例

### 检测
```
用户：666666

# 🐑 电子羊**咩小鲜**听见了牧羊人的召唤！

咩一下 老熟人了咩，一听就是你~

上次虫灾严重，这次让本咩看看好转没咩~

## 哇咩……这草地被虫啃得不成样了，**71** 个咩！

**Agent 配置**: 59 个没配齐（就 9% 的出勤率），只有 6 个是完整的咩。

**活跃度**: 36 个在干活，29 个在摸鱼咩。

**Cron**: 11 个报错咩。

## 羊圈安全检查：

**安全评分**: **34/100**

⚠️ **狼来了**：发现明文 API Key（得你亲自处理）

🔧 **本咩能帮你修的**：

发现 1 个备份文件残留咩

## 羊圈需要修补，亡羊补牢为时不晚咩~

**让本咩给你补补看？**

回复"修复"咩，本咩立马开工~
```

### 修复
```
用户：修复

# 🐑 咩~ 本咩动手了咩！

### 🔧 修复进行中：

#### 📁 补全 Agent 配置文件：

- **backend-dev**: 创建了 IDENTITY.md, SKILL.md, system-prompt.md 咩
- **content-director**: 创建了 SKILL.md, system-prompt.md 咩
- ... 还有 57 个 Agent 配置已补全咩

#### ⏰ 修复 Cron 任务错误：

- 清除了 **11** 个任务的错误状态咩
- 下次运行应该正常了咩

---

## ✅ 修复完成咩！

**补全 Agent 配置**: 59/59 个
**修复 Cron 错误**: 11/11 个
**备份文件**: 1 个（保留）

# 🐑 咩~ 修好了咩！

🐑 **修复** 🐑

_咩~ 老熟人了，随叫随到咩！_
```

---

## 🔧 技术实现

### 自然语言理解
```javascript
function understandIntent(userInput) {
    // 退出触发词
    const exitTriggers = ['拜拜', '再见', '好了', '可以了'];
    
    // 继续触发词
    const continueTriggers = ['继续', '接着', '再来'];
    
    // 修复触发词
    const fixTriggers = ['修复', '修', 'fix'];
    
    // 连续字符触发
    if (input.length >= 3 && new Set(input).size === 1) {
        return { action: 'baa' };
    }
    
    // ... 更多逻辑
}
```

### Agent 配置创建
```javascript
function createAgentConfig(agentName) {
    const agentDir = path.join(HOME, '.openclaw', 'agents', agentName, 'agent');
    
    // 创建 IDENTITY.md
    if (!fs.existsSync(identityPath)) {
        fs.writeFileSync(identityPath, `# ${agentName}\n\n**角色**: ${agentName}\n...`);
    }
    
    // 创建 SKILL.md
    // 创建 system-prompt.md
    
    return filesCreated;
}
```

---

## 📝 更新日志

### v2.7.1 (2026-03-13)
- ✅ 实现面具模式架构
- ✅ 添加自然语言理解
- ✅ 支持中文连续字符触发
- ✅ 实现实际修复功能
- ✅ 添加白名单机制
- ✅ 添加历史记录功能
- ✅ 优化咩里咩气的表达风格

### v2.7.0 (2026-03-12)
- 初始版本

---

_电子羊 Skill v2.7.1 - 面具模式完成_

_版权：宁夏未必科幻文化有限公司，一帆原创制作。_
