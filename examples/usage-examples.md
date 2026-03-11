# 电子羊技能使用示例

版权：宁夏未必科幻文化有限公司，一帆原创制作。

---

## 示例 1：添加本能规则

**场景**：CEO 要求添加新的安全规则

```bash
# CEO 指示
"添加一条规则：所有外部 API 调用必须记录日志"

# 主意识执行
openclaw agent --agent main --command "instincts add" \
  --name "API 日志记录" \
  --content "所有外部 API 调用必须记录日志，包括请求参数、响应结果、时间戳"

# 验证添加
openclaw agent --agent main --command "instincts list"

# 输出
本能规则列表：
1. 配置审批（2026-03-11 添加）
2. API 日志记录（刚刚添加）
3. COO 分派指令格式（2026-03-09 添加）
```

---

## 示例 2：本能触发辅助决策

**场景**：用户请求修改配置

```bash
# 用户消息
"帮我修改网关端口为 18790"

# 系统自动流程
1. 主意识识别关键词"修改网关端口"
2. 本能层触发"配置审批"规则
3. 反射子代理读取 instincts/learned/config-approval.md
4. 加载到显意识辅助决策
5. 主意识做决策

# 回复用户
"一帆，修改网关端口属于配置修改，需要你先批准。

请评估：
1. 是否会导致网关重启？→ 是
2. 是否会影响正在运行的任务？→ 是
3. 是否有回滚方案？→ 有（改回 18789）

如确认执行，请回复'批准'。"
```

---

## 示例 3：手动休息（整理记忆）

**场景**：主意识感知疲劳，主动休息

```bash
# 主意识感知疲劳
# 本能层积累疲劳信号：
# - 响应时间增加
# - 临时记忆过多
# - 错误率上升

# 主意识决定休息
openclaw agent --agent main --command "rest"

# 系统自动执行：
# 1. 子代理整理显意识
#    - 归档临时思考 → 潜意识/episodes/
#    - 清理过期对话 → 删除
#    - 更新事项指针 → 海马区索引
#
# 2. 备份到意识引导区
#    - conscious.md → conscious-guide/backup-latest.md
#
# 3. 进入浅睡眠（走神）
#    - 子代理继续整理
#    - 重要记忆自然加载（梦境洞察）
#
# 4. 自然过渡到深睡眠
#    - 全部子代理整理潜意识
#    - 回顾潜记忆（30 天未动）
#    - 整理本能区详情
#
# 5. 整理完成，自然醒
#    - 显意识清空（轻装上阵）
#    - 准备接收新任务

# 休息完成输出
"休息完成！
- 整理显意识：15 条临时思考已归档
- 备份到意识引导区：完成
- 梦境洞察：发现 OpenViking 3.0 已发布（记录到紧急备忘）
- 系统状态：清爽高效"
```

---

## 示例 4：意外恢复

**场景**：系统崩溃后恢复

```bash
# 系统崩溃（如断电）
# 重启后...

# 自动检测
openclaw agent --agent main --start

# 系统日志
[INFO] 检测显意识状态...
[WARN] conscious.md 为空或损坏
[INFO] 从意识引导区恢复最新备份...
[INFO] 恢复成功！最后备份时间：2026-03-11T09:25:00+08:00
[INFO] 恢复内容：
  - 当前任务：《云影》第三稿修改
  - 最近对话：3 条
  - 事项指针：5 个
  - 紧急备忘：1 条（OpenViking 3.0 发布）

# 继续工作
"系统已恢复！最后任务：《云影》第三稿修改（舒心负责，进度 70%）

紧急备忘：
- OpenViking 3.0 已发布，需重新评估是否集成

是否继续处理《云影》任务？"
```

---

## 示例 5：梦境洞察

**场景**：深睡眠中整理出重要发现

```bash
# 深睡眠中...
# 子代理整理潜意识/projects/theater/

# 发现重要信息
[子代理 D] 整理《未必剧场》项目资料时发现：
- Bilibili 直播政策更新（2026-03-10）
- 允许 AI 虚拟主播实时互动
- 需要许可证：虚拟演出许可证

# 自然加载到显意识（梦境）
# 主意识在"梦"中感知到

# 记录到意识引导区（紧急备忘）
cat >> subconscious/conscious-guide/emergency.md << 'EOF'
# 紧急事项

**创建时间**：2026-03-11T03:00:00+08:00（深睡眠中）  
**优先级**：P1  
**内容**：Bilibili 直播政策更新，AI 虚拟主播需要许可证  
**来源**：梦境洞察（子代理整理潜意识时发现）  
**处理状态**：待处理  
**创建者**：dream-insight

---

_处理完成后删除此备忘。_
EOF

# 自然醒后
# 主意识加载意识引导区
# 发现紧急备忘

# 输出
"早安！系统已自然醒。

梦境洞察（深睡眠中发现）：
- Bilibili 直播政策更新，AI 虚拟主播需要许可证

建议行动：
1. 联系技术部长查询许可证申请流程
2. 更新《未必剧场》项目计划

是否立即处理？"
```

---

## 示例 6：批量安装到所有 Agent

**场景**：为所有在职 Agent 安装电子羊技能

```bash
#!/bin/bash
# 批量安装电子羊技能

# Agent 列表
AGENTS=(
  "main"
  "script-writer"
  "tech-director"
  "hr-admin"
  "theater-director"
  "content-director"
  "drama-lead"
  "drama-editor"
  "marketing-director"
  "property-monitor"
  "qa-agent"
  "archive-manager"
  "usage-monitor"
  "theater-hr"
  "theater-screenwriter-1"
  "theater-screenwriter-2"
  "theater-content-writer"
  "theater-unity-dev"
)

# 批量安装
for agent in "${AGENTS[@]}"; do
  echo "🐑 安装电子羊技能到 $agent..."
  
  # 复制技能文件
  cp -r /Users/ai/.openclaw/workspace/skills/electronic-sheep \
        ~/.openclaw/agents/$agent/skills/
  
  # 初始化
  bash ~/.openclaw/agents/$agent/skills/electronic-sheep/scripts/init.sh \
       ~/.openclaw/agents/$agent
  
  echo "✅ $agent 安装完成"
done

echo ""
echo "🎉 所有 Agent 电子羊技能安装完成！"
echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
```

---

## 示例 7：查看系统状态

**场景**：检查电子羊系统运行状态

```bash
# 查看整体状态
openclaw agent --agent main --command "electronic-sheep status"

# 输出
🐑 电子羊仿生意识系统状态

版权：宁夏未必科幻文化有限公司，一帆原创制作。

【本能层】
- 写死规则：3 条（核心规则）
- 可扩展规则：5 条
- 总大小：1.2KB / 1KB（略超，建议清理）

【显意识层】
- 当前大小：3.5KB / 5KB
- 当前任务：《云影》第三稿修改
- 最近对话：3 条
- 事项指针：5 个
- 最后备份：2 分钟前

【潜意识层】
- 本能详情：8 条
- 技能记忆：12 条
- 事实记忆：25 条
- 情景记忆：156 条
- 潜记忆：3 条（30 天未动：1 条）
- 项目资料：7 个
- 总大小：2.3MB

【意识引导区】
- 显意识备份：最新（2 分钟前）
- 紧急备忘：1 条（OpenViking 3.0 发布）

【睡眠状态】
- 最后休息：3 小时前
- 最后深睡眠：8 小时前（23:00-06:00）
- 梦境洞察：2 次（已处理：1 次，待处理：1 次）

【系统健康】
- 响应速度：正常（本能触发 45ms）
- 记忆整理：正常（自动备份启用）
- 意外恢复：就绪（意识引导区完好）

建议：
1. 清理本能层（略超限制）
2. 处理紧急备忘（OpenViking 3.0）
3. 回顾潜记忆（1 条 30 天未动）
```

---

_电子羊 - 像人一样思考，像人一样记忆。_  
_宁夏未必科幻文化有限公司，一帆原创制作。_