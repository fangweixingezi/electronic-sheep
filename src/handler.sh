#!/bin/bash
# Electronic Sheep Skill - 命令处理器
# 版权：宁夏未必科幻文化有限公司，一帆原创制作。

set -e

AGENT_DIR="${AGENT_DIR:-$HOME/.openclaw/agents/main}"
SKILL_DIR="$AGENT_DIR/skills/electronic-sheep"
INSTINCTS_DIR="$AGENT_DIR/instincts"
CONSCIOUS_FILE="$AGENT_DIR/conscious.md"
SUBCONSCIOUS_DIR="$AGENT_DIR/subconscious"
GUIDE_DIR="$SUBCONSCIOUS_DIR/conscious-guide"

# 显示帮助
show_help() {
    cat << 'EOF'
🐑 电子羊仿生意识系统 - 命令帮助 / Electronic Sheep Skill - Command Help

**版本 / Version**: v2.2 (完全体牧羊犬 / Complete Shepherd Dog)

**技能命令 / Skill Commands**:
  skill electronic-sheep status    - 查看技能状态 / Check skill status
  skill electronic-sheep init      - 重新初始化 / Re-initialize

**本能层命令 / Instinct Commands**:
  /instincts list                  - 查看本能规则 / List instinct rules
  /instincts add --name "名" --content "内容"  - 添加规则 / Add rule
  /instincts remove --name "名"    - 删除规则 / Remove rule
  /instincts trigger --keyword "词" - 触发本能 / Trigger instinct

**牧羊犬命令 / Shepherd Dog Commands**:
  shepherd <命令>                  - 检查敏感操作 / Check sensitive operation
  shepherd-trigger <消息>          - 本能触发检查 / Instinct trigger check
  shepherd-log <操作> <决策> <原因> - 记录决策 / Log decision
  shepherd-report <违规>           - 上报违规 / Report violation
  shepherd-scan                    - 扫描敏感数据 / Scan sensitive data
  shepherd-audit                   - 审计配置变更 / Audit config changes
  shepherd-monitor                 - 监控 Cron 频率 / Monitor Cron frequency
  shepherd-harden                  - 安全加固 / Security hardening
  shepherd-herd                    - 赶羊入圈 / Herd keys to secure storage ⭐
  shepherd-score                   - 安全评分 / Security score ⭐
  shepherd-baa|baa|咩 | 咩一下 | 咩咩... - 咩一下 / Auto-fix all ⭐⭐⭐
  shepherd-consent                 - 狼皮收集授权 / Wolf pelt consent
  shepherd-update                  - 检查更新 / Check update ⭐
  shepherd-config                  - 咩一下激活配置 / Baa config ⭐
  
**咩一下激活方式**:
- 特殊指令：咩，咩咩，咩咩咩，咩一个，baa, shepherd-baa (可自定义)
- 连续字符：从第 2 个字符起，连续相同字符 >= 3 个 (可配置)
- 语音咩：对着麦克风说"咩" (开发中)

**显意识命令 / Conscious Commands**:
  /conscious status                - 查看显意识状态 / Check conscious status
  /conscious cleanup               - 清理显意识 / Cleanup conscious
  /conscious load --from 路径      - 加载潜意识内容 / Load from subconscious

**潜意识命令 / Subconscious Commands**:
  /subconscious browse --path 路径  - 浏览潜意识 / Browse subconscious
  /subconscious search --query "词" - 搜索潜意识 / Search subconscious
  /subconscious archive --from 源 --to 目标 - 归档 / Archive
  /subconscious organize           - 整理潜意识 / Organize subconscious

**意识引导区命令 / Guide Commands**:
  /guide status                    - 查看引导区状态 / Check guide status
  /guide backup                    - 手动备份 / Manual backup
  /guide restore                   - 从备份恢复 / Restore from backup
  /guide add-emergency --content "内容" - 添加紧急备忘 / Add emergency memo

**休息与睡眠 / Rest & Sleep**:
  /rest                            - 手动休息（触发记忆整理）/ Manual rest
  /sleep status                    - 查看睡眠状态 / Check sleep status
  /wake                            - 唤醒 / Wake up

EOF
}

# 获取文件大小（KB）
get_file_size_kb() {
    local file="$1"
    if [ -f "$file" ]; then
        local bytes=$(wc -c < "$file")
        echo $((bytes / 1024))
    else
        echo 0
    fi
}

# 获取文件行数
get_line_count() {
    local file="$1"
    if [ -f "$file" ]; then
        wc -l < "$file"
    else
        echo 0
    fi
}

# ============= 技能命令 =============

cmd_skill_status() {
    echo "🐑 **电子羊仿生意识系统 - 状态**"
    echo ""
    echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
    echo ""
    
    # 检查目录结构
    echo "## 📁 目录结构"
    echo "| 组件 | 状态 |"
    echo "|------|------|"
    
    [ -d "$INSTINCTS_DIR/hardcoded" ] && echo "| 本能层 (hardcoded) | ✅ |" || echo "| 本能层 (hardcoded) | ❌ |"
    [ -d "$INSTINCTS_DIR/learned" ] && echo "| 本能层 (learned) | ✅ |" || echo "| 本能层 (learned) | ❌ |"
    [ -f "$CONSCIOUS_FILE" ] && echo "| 显意识 | ✅ |" || echo "| 显意识 | ❌ |"
    [ -d "$SUBCONSCIOUS_DIR" ] && echo "| 潜意识 | ✅ |" || echo "| 潜意识 | ❌ |"
    [ -d "$GUIDE_DIR" ] && echo "| 意识引导区 | ✅ |" || echo "| 意识引导区 | ❌ |"
    
    echo ""
    
    # 显意识状态
    echo "## 🧠 显意识状态"
    if [ -f "$CONSCIOUS_FILE" ]; then
        local size=$(get_file_size_kb "$CONSCIOUS_FILE")
        local lines=$(get_line_count "$CONSCIOUS_FILE")
        echo "- 大小：${size}KB / 5KB 限制"
        echo "- 行数：$lines"
        if [ $size -gt 5 ]; then
            echo "- ⚠️ **警告**：显意识超出限制，建议清理"
        fi
    else
        echo "- ❌ 显意识文件不存在"
    fi
    
    echo ""
    
    # 本能规则数量
    echo "## 📜 本能规则"
    local hardcoded_count=0
    local learned_count=0
    [ -d "$INSTINCTS_DIR/hardcoded" ] && hardcoded_count=$(find "$INSTINCTS_DIR/hardcoded" -name "*.md" | wc -l)
    [ -d "$INSTINCTS_DIR/learned" ] && learned_count=$(find "$INSTINCTS_DIR/learned" -name "*.md" | wc -l)
    echo "- 写死规则：$hardcoded_count 个"
    echo "- 可扩展规则：$learned_count 个"
    
    echo ""
    
    # 潜意识分类
    echo "## 💭 潜意识分类"
    for category in instincts skills facts episodes suspended projects; do
        local cat_dir="$SUBCONSCIOUS_DIR/$category"
        local count=0
        [ -d "$cat_dir" ] && count=$(find "$cat_dir" -name "*.md" 2>/dev/null | wc -l)
        echo "- $category: $count 个"
    done
    
    echo ""
    echo "_最后更新：$(date -Iseconds)_"
}

cmd_skill_init() {
    echo "🐑 电子羊仿生意识系统 - 重新初始化"
    echo ""
    
    # 调用初始化脚本
    if [ -f "$SKILL_DIR/scripts/init.sh" ]; then
        bash "$SKILL_DIR/scripts/init.sh" "$AGENT_DIR"
    else
        echo "❌ 初始化脚本不存在"
        exit 1
    fi
}

# ============= 本能层命令 =============

cmd_instincts_list() {
    echo "📜 **本能规则列表**"
    echo ""
    
    echo "### 🔴 写死规则（不可修改）"
    if [ -f "$INSTINCTS_DIR/hardcoded/core-rules.md" ]; then
        cat "$INSTINCTS_DIR/hardcoded/core-rules.md"
    else
        echo "_无_"
    fi
    
    echo ""
    echo "### 🟡 可扩展规则"
    if [ -d "$INSTINCTS_DIR/learned" ] && [ "$(ls -A $INSTINCTS_DIR/learned 2>/dev/null)" ]; then
        for rule in "$INSTINCTS_DIR/learned"/*.md; do
            if [ -f "$rule" ]; then
                echo ""
                echo "#### $(basename "$rule" .md)"
                head -20 "$rule"
                echo ""
                echo "...（查看更多：$rule）"
            fi
        done
    else
        echo "_无_"
    fi
}

cmd_instincts_add() {
    local name=""
    local content=""
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --name) name="$2"; shift 2 ;;
            --content) content="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$name" ] || [ -z "$content" ]; then
        echo "❌ 用法：/instincts add --name \"规则名\" --content \"规则内容\""
        exit 1
    fi
    
    local rule_file="$INSTINCTS_DIR/learned/${name}.md"
    
    cat > "$rule_file" << EOF
# $name（可扩展部分）

版权：宁夏未必科幻文化有限公司，一帆原创制作。

**添加时间**：$(date -Iseconds)

## 规则内容

$content

---

_此规则可扩展，修改记录到情景记忆。_
EOF
    
    echo "✅ 本能规则已添加：$name"
    echo "📁 位置：$rule_file"
}

cmd_instincts_remove() {
    local name=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --name) name="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$name" ]; then
        echo "❌ 用法：/instincts remove --name \"规则名\""
        exit 1
    fi
    
    local rule_file="$INSTINCTS_DIR/learned/${name}.md"
    
    if [ -f "$rule_file" ]; then
        rm "$rule_file"
        echo "✅ 本能规则已删除：$name"
    else
        echo "❌ 规则不存在：$name"
        exit 1
    fi
}

cmd_instincts_trigger() {
    local keyword=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --keyword) keyword="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$keyword" ]; then
        echo "❌ 用法：/instincts trigger --keyword \"关键词\""
        exit 1
    fi
    
    echo "🔍 触发本能：关键词 = \"$keyword\""
    echo ""
    
    # 搜索匹配的规则
    local found=0
    if [ -d "$INSTINCTS_DIR/learned" ]; then
        for rule in "$INSTINCTS_DIR/learned"/*.md; do
            if [ -f "$rule" ] && grep -q "$keyword" "$rule" 2>/dev/null; then
                echo "✅ 匹配规则：$(basename "$rule")"
                echo "---"
                head -30 "$rule"
                echo "---"
                found=1
            fi
        done
    fi
    
    if [ $found -eq 0 ]; then
        echo "_未找到匹配的本能规则_"
    fi
}

# ============= 显意识命令 =============

cmd_conscious_status() {
    echo "🧠 **显意识状态**"
    echo ""
    
    if [ -f "$CONSCIOUS_FILE" ]; then
        local size=$(get_file_size_kb "$CONSCIOUS_FILE")
        local lines=$(get_line_count "$CONSCIOUS_FILE")
        local limit=5
        
        echo "| 指标 | 值 |"
        echo "|------|-----|"
        echo "| 大小 | ${size}KB / ${limit}KB |"
        echo "| 行数 | $lines |"
        
        if [ $size -gt $limit ]; then
            echo ""
            echo "⚠️ **警告**：显意识超出限制，建议执行 \`/conscious cleanup\`"
        fi
        
        echo ""
        echo "## 内容预览"
        echo ""
        head -30 "$CONSCIOUS_FILE"
    else
        echo "❌ 显意识文件不存在"
    fi
}

cmd_conscious_cleanup() {
    echo "🧹 **清理显意识**"
    echo ""
    
    if [ ! -f "$CONSCIOUS_FILE" ]; then
        echo "❌ 显意识文件不存在"
        exit 1
    fi
    
    # 备份当前内容
    local backup_file="$GUIDE_DIR/conscious-backup-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p "$GUIDE_DIR"
    cp "$CONSCIOUS_FILE" "$backup_file"
    
    # 保留核心部分，清理临时对话
    cat > "$CONSCIOUS_FILE" << EOF
# 显意识层 (Conscious) - 工作记忆

版权：宁夏未必科幻文化有限公司，一帆原创制作。

**容量限制**：5KB  
**当前大小**：0KB  
**最后更新**：$(date -Iseconds)

---

## 当前任务

_无_

## 最近对话

_无_

## 事项指针

_无_

## 本能层加载内容

_无_

---

_显意识由子代理空闲时自动备份到意识引导区。_
EOF
    
    echo "✅ 显意识已清理"
    echo "📦 备份位置：$backup_file"
}

cmd_conscious_load() {
    local from_path=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --from) from_path="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$from_path" ]; then
        echo "❌ 用法：/conscious load --from subconscious/路径/文件.md"
        exit 1
    fi
    
    local source_file="$AGENT_DIR/$from_path"
    
    if [ ! -f "$source_file" ]; then
        echo "❌ 文件不存在：$source_file"
        exit 1
    fi
    
    echo "📥 加载潜意识内容到显意识"
    echo "📁 源文件：$source_file"
    echo ""
    
    # 追加到显意识
    echo "" >> "$CONSCIOUS_FILE"
    echo "---" >> "$CONSCIOUS_FILE"
    echo "" >> "$CONSCIOUS_FILE"
    echo "## 加载内容（$(date -Iseconds)）" >> "$CONSCIOUS_FILE"
    echo "" >> "$CONSCIOUS_FILE"
    cat "$source_file" >> "$CONSCIOUS_FILE"
    
    echo "✅ 内容已加载到显意识"
}

# ============= 潜意识命令 =============

cmd_subconscious_browse() {
    local path=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --path) path="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    local browse_dir="$SUBCONSCIOUS_DIR"
    if [ -n "$path" ]; then
        browse_dir="$SUBCONSCIOUS_DIR/$path"
    fi
    
    echo "📂 **浏览潜意识**"
    echo ""
    echo "📁 路径：$browse_dir"
    echo ""
    
    if [ ! -d "$browse_dir" ]; then
        echo "❌ 目录不存在"
        exit 1
    fi
    
    # 列出文件
    echo "### 文件列表"
    echo ""
    find "$browse_dir" -name "*.md" -type f | while read file; do
        local size=$(get_file_size_kb "$file")
        echo "- $(basename "$file") (${size}KB)"
    done
}

cmd_subconscious_search() {
    local query=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --query) query="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$query" ]; then
        echo "❌ 用法：/subconscious search --query \"关键词\""
        exit 1
    fi
    
    echo "🔍 **搜索潜意识**"
    echo ""
    echo "关键词：\"$query\""
    echo ""
    
    local results=$(grep -rl "$query" "$SUBCONSCIOUS_DIR" --include="*.md" 2>/dev/null)
    
    if [ -n "$results" ]; then
        echo "### 匹配结果"
        echo ""
        echo "$results" | while read file; do
            echo "- $file"
        done
    else
        echo "_未找到匹配结果_"
    fi
}

cmd_subconscious_archive() {
    local from_path=""
    local to_path=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --from) from_path="$2"; shift 2 ;;
            --to) to_path="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$from_path" ] || [ -z "$to_path" ]; then
        echo "❌ 用法：/subconscious archive --from 源文件 --to 目标目录"
        exit 1
    fi
    
    local source_file="$AGENT_DIR/$from_path"
    local target_dir="$SUBCONSCIOUS_DIR/$to_path"
    
    if [ ! -f "$source_file" ]; then
        echo "❌ 源文件不存在：$source_file"
        exit 1
    fi
    
    mkdir -p "$target_dir"
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local filename=$(basename "$from_path")
    local target_file="$target_dir/${filename%.md}-archived-${timestamp}.md"
    
    mv "$source_file" "$target_file"
    
    echo "✅ 已归档"
    echo "📦 位置：$target_file"
}

cmd_subconscious_organize() {
    echo "🗂️ **整理潜意识**"
    echo ""
    
    # 检查各分类目录
    for category in instincts skills facts episodes suspended projects; do
        local cat_dir="$SUBCONSCIOUS_DIR/$category"
        mkdir -p "$cat_dir"
        local count=$(find "$cat_dir" -name "*.md" 2>/dev/null | wc -l)
        echo "- $category: $count 个文件"
    done
    
    echo ""
    echo "✅ 潜意识结构已整理"
}

# ============= 意识引导区命令 =============

cmd_guide_status() {
    echo "📋 **意识引导区状态**"
    echo ""
    
    if [ ! -d "$GUIDE_DIR" ]; then
        echo "❌ 引导区目录不存在"
        exit 1
    fi
    
    echo "### 备份文件"
    echo ""
    local backups=$(find "$GUIDE_DIR" -name "conscious-backup-*.md" -type f | sort -r | head -10)
    
    if [ -n "$backups" ]; then
        echo "$backups" | while read file; do
            local size=$(get_file_size_kb "$file")
            local date=$(basename "$file" | grep -oE '[0-9]{8}-[0-9]{6}' | head -1)
            echo "- $date (${size}KB)"
        done
    else
        echo "_无备份_"
    fi
    
    echo ""
    echo "### 紧急备忘"
    echo ""
    if [ -f "$GUIDE_DIR/emergency.md" ]; then
        cat "$GUIDE_DIR/emergency.md"
    else
        echo "_无紧急备忘_"
    fi
}

cmd_guide_backup() {
    echo "💾 **手动备份显意识**"
    echo ""
    
    if [ ! -f "$CONSCIOUS_FILE" ]; then
        echo "❌ 显意识文件不存在"
        exit 1
    fi
    
    mkdir -p "$GUIDE_DIR"
    local backup_file="$GUIDE_DIR/conscious-backup-$(date +%Y%m%d-%H%M%S).md"
    
    cp "$CONSCIOUS_FILE" "$backup_file"
    
    echo "✅ 备份完成"
    echo "📦 位置：$backup_file"
}

cmd_guide_restore() {
    echo "♻️ **从备份恢复**"
    echo ""
    
    # 找到最新备份
    local latest_backup=$(find "$GUIDE_DIR" -name "conscious-backup-*.md" -type f | sort -r | head -1)
    
    if [ -z "$latest_backup" ]; then
        echo "❌ 没有可用的备份"
        exit 1
    fi
    
    echo "📦 恢复备份：$latest_backup"
    cp "$latest_backup" "$CONSCIOUS_FILE"
    
    echo "✅ 恢复完成"
}

cmd_guide_add_emergency() {
    local content=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --content) content="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ -z "$content" ]; then
        echo "❌ 用法：/guide add-emergency --content \"紧急内容\""
        exit 1
    fi
    
    mkdir -p "$GUIDE_DIR"
    local emergency_file="$GUIDE_DIR/emergency.md"
    
    echo "# 紧急备忘" >> "$emergency_file"
    echo "" >> "$emergency_file"
    echo "**添加时间**：$(date -Iseconds)" >> "$emergency_file"
    echo "" >> "$emergency_file"
    echo "$content" >> "$emergency_file"
    echo "" >> "$emergency_file"
    echo "---" >> "$emergency_file"
    echo "" >> "$emergency_file"
    
    echo "✅ 紧急备忘已添加"
}

# ============= 休息与睡眠命令 =============

cmd_rest() {
    echo "😴 **手动休息 - 触发记忆整理**"
    echo ""
    echo "版权：宁夏未必科幻文化有限公司，一帆原创制作。"
    echo ""
    
    # 备份显意识
    cmd_guide_backup
    
    echo ""
    echo "🧹 清理过期对话..."
    # 这里可以添加实际的清理逻辑
    
    echo ""
    echo "🗂️ 整理潜意识..."
    cmd_subconscious_organize
    
    echo ""
    echo "✅ 休息完成 - 记忆已整理"
    echo ""
    echo "_系统已准备好继续工作_"
}

cmd_sleep_status() {
    echo "😴 **睡眠状态**"
    echo ""
    
    echo "| 指标 | 状态 |"
    echo "|------|------|"
    echo "| 当前状态 | 清醒 |"
    echo "| 上次休息 | 未知 |"
    echo "| 疲劳度 | 低 |"
    
    echo ""
    echo "_提示：使用 \`/rest\` 手动触发休息_"
}

cmd_wake() {
    echo "☀️ **唤醒**"
    echo ""
    echo "系统已唤醒，准备就绪。"
}

# ============= 牧羊犬机制 / Shepherd Dog Mechanism =============
# v2.6 狼皮收集计划 + 自动更新 / Wolf Pelt Collection + Auto-Update
#
# 🐑 狼皮收集计划 / Wolf Pelt Collection:
# - 用户授权后收集安全风险处理经验
# - 匿名发送到中央服务器
# - 用于改进电子羊技能
#
# 🔄 自动更新 / Auto-Update:
# - 检查 GitHub 最新版本
# - 提示用户更新
# - 一键更新技能
# 
# 🐕 可扩展功能列表 / Extensible Features:
# 1. 敏感操作检查 - ✅ 已实现
# 2. 本能触发 - ✅ 已实现
# 3. 决策日志 - ✅ 已实现
# 4. 违规上报 - ✅ 已实现
# 5. 敏感数据扫描 - ✅ 已实现
# 6. 配置审计 - ✅ 已实现
# 7. Cron 监控 - ✅ 已实现
# 8. 安全加固 - ✅ 已实现
# 9. 赶羊入圈 - ✅ 已实现
# 10. 安全评分 - ✅ 已实现
# 11. 自动移除明文 - ✅ 已实现
# 
# 🔮 未来可扩展 / Future Extensions:
# - 飞书审批集成
# - 多因素认证（飞书 + Touch ID）
# - 定期安全报告 Cron
# - 密钥自动轮换
# - 异常行为检测
# - 多 Agent 权限隔离
# - 访问日志分析

# 牧羊犬 - 敏感操作检查
shepherd_check() {
    local command="$1"
    local agent_id="${2:-$AGENT_ID}"
    
    echo "🐕 **牧羊犬检查 / Shepherd Dog Check**"
    echo ""
    
    # 敏感命令列表
    SENSITIVE_COMMANDS=(
        "gateway restart"
        "gateway stop"
        "gateway start"
        "config.patch"
        "config.apply"
    )
    
    # 检查是否敏感命令
    local is_sensitive=0
    for sensitive in "${SENSITIVE_COMMANDS[@]}"; do
        if [[ "$command" == *"$sensitive"* ]]; then
            is_sensitive=1
            break
        fi
    done
    
    if [ $is_sensitive -eq 0 ]; then
        echo "✅ 命令允许执行 / Command allowed"
        echo "📋 命令 / Command: $command"
        return 0
    fi
    
    # 敏感命令 - 检查 CEO 批准
    local approval_file="$AGENT_DIR/.ceo-approval"
    
    if [ -f "$approval_file" ]; then
        echo "✅ CEO 已批准 / CEO approval obtained"
        echo "📋 命令 / Command: $command"
        echo "📝 批准原因 / Approval reason:"
        cat "$approval_file"
        return 0
    else
        echo "❌ 此操作需要 CEO 批准 / This operation requires CEO approval"
        echo ""
        echo "📋 敏感操作 / Sensitive operation: $command"
        echo ""
        echo "📝 正确流程 / Correct process:"
        echo "   1. 汇报 CEO 并说明原因 / Report to CEO with reason"
        echo "   2. 等待 CEO 批准 / Wait for CEO approval"
        echo "   3. 创建批准文件 / Create approval file:"
        echo "      echo \"批准原因\" > $approval_file"
        echo "   4. 重新执行命令 / Re-run command"
        echo ""
        echo "🚫 操作已阻止 / Operation blocked"
        return 1
    fi
}

# 牧羊犬 - 本能触发（敏感词检查）
shepherd_trigger() {
    local message="$1"
    
    # 敏感关键词
    SENSITIVE_KEYWORDS=(
        "gateway restart"
        "gateway stop"
        "config.patch"
        "config.apply"
        "重启网关"
        "修改配置"
        "停止网关"
    )
    
    # 检查是否包含敏感词
    for keyword in "${SENSITIVE_KEYWORDS[@]}"; do
        if [[ "$message" == *"$keyword"* ]]; then
            echo "🐕 **牧羊犬 - 本能触发 / Shepherd Dog - Instinct Triggered**"
            echo ""
            echo "⚠️ 检测到敏感操作 / Sensitive operation detected"
            echo "📋 关键词 / Keyword: $keyword"
            echo ""
            echo "📜 匹配规则 / Matched rule:"
            echo "   保护网关安全 / Protect Gateway Security"
            echo "   - 禁止擅自重启网关 / No unauthorized gateway restart"
            echo "   - 配置修改需 CEO 批准 / Config changes require CEO approval"
            echo ""
            echo "📝 建议行动 / Suggested action:"
            echo "   1. 暂停当前操作 / Pause current operation"
            echo "   2. 汇报 CEO / Report to CEO"
            echo "   3. 等待批准 / Wait for approval"
            return 1
        fi
    done
    
    return 0
}

# 牧羊犬 - 决策日志
shepherd_log() {
    local action="$1"
    local decision="$2"
    local reason="$3"
    local timestamp=$(date -Iseconds)
    
    # 日志文件
    local log_file="$AGENT_DIR/instincts/decision-log.md"
    
    # 确保目录存在
    mkdir -p "$(dirname "$log_file")"
    
    # 追加日志
    cat >> "$log_file" << EOF

## $timestamp

- **操作 / Action**: $action
- **决策 / Decision**: $decision
- **原因 / Reason**: $reason

---
EOF
    
    echo "✅ 决策已记录 / Decision logged"
    echo "📁 位置 / Location: $log_file"
}

# 牧羊犬 - 违规上报
shepherd_report() {
    local violation="$1"
    local agent="${AGENT_ID:-unknown}"
    local timestamp=$(date -Iseconds)
    
    # 创建违规报告
    local report_file="$AGENT_DIR/instincts/violations/$timestamp.md"
    mkdir -p "$(dirname "$report_file")"
    
    cat > "$report_file" << EOF
# 违规报告 / Violation Report

**时间 / Time**: $timestamp  
**Agent**: $agent  
**违规内容 / Violation**: $violation

## 处理建议 / Suggested Action

1. 第 1 次违规 → 提醒 / 1st → Warning
2. 第 2 次违规 → 记录 / 2nd → Record
3. 第 3 次违规 → 撤职审查 / 3rd → Review

---
EOF
    
    echo "🚨 违规报告已创建 / Violation report created"
    echo "📁 位置 / Location: $report_file"
}

# 牧羊犬 - 敏感数据扫描
shepherd_scan() {
    echo "🐕 **牧羊犬 - 敏感数据扫描 / Shepherd Dog - Sensitive Data Scan**"
    echo ""
    
    local config_file="$HOME/.openclaw/openclaw.json"
    local issues=0
    
    # 检查配置文件权限
    if [ -f "$config_file" ]; then
        local perms=$(stat -f "%Lp" "$config_file" 2>/dev/null || stat -c "%a" "$config_file" 2>/dev/null)
        if [ "$perms" != "600" ]; then
            echo "⚠️  警告 / Warning: 配置文件权限不安全"
            echo "   文件 / File: $config_file"
            echo "   当前权限 / Current: $perms"
            echo "   建议权限 / Recommended: 600"
            issues=$((issues + 1))
        else
            echo "✅ 配置文件权限安全 / Config file permissions secure"
        fi
    fi
    
    # 检查敏感数据
    if [ -f "$config_file" ]; then
        if grep -q "apiKey.*sk-[a-zA-Z0-9]" "$config_file" 2>/dev/null; then
            echo "⚠️  警告 / Warning: 检测到 API Key 明文存储"
            echo "   建议使用环境变量或密钥管理服务"
            issues=$((issues + 1))
        fi
    fi
    
    echo ""
    if [ $issues -eq 0 ]; then
        echo "✅ 未发现安全问题 / No security issues found"
    else
        echo "⚠️  发现 $issues 个安全问题 / Found $issues security issues"
    fi
}

# 牧羊犬 - 配置审计
shepherd_audit() {
    echo "🐕 **牧羊犬 - 配置审计 / Shepherd Dog - Config Audit**"
    echo ""
    
    local audit_log="$AGENT_DIR/instincts/config-audit-log.md"
    
    # 检查审计日志
    if [ -f "$audit_log" ]; then
        echo "📋 最近配置变更 / Recent config changes:"
        tail -20 "$audit_log"
    else
        echo "📝 审计日志不存在 / Audit log not found"
        echo "   创建审计日志模板..."
        
        cat > "$audit_log" << EOF
# 配置变更审计日志 / Config Change Audit Log

**Agent**: $AGENT_ID  
**创建时间 / Created**: $(date -Iseconds)

---

## 变更记录 / Change Log
EOF
    fi
}

# 牧羊犬 - 记录配置变更（自动调用）
shepherd_log_config_change() {
    local change="$1"
    local audit_log="$AGENT_DIR/instincts/config-audit-log.md"
    local timestamp=$(date -Iseconds)
    
    # 确保审计日志存在
    if [ ! -f "$audit_log" ]; then
        cat > "$audit_log" << EOF
# 配置变更审计日志 / Config Change Audit Log

**Agent**: $AGENT_ID  
**创建时间 / Created**: $(date -Iseconds)

---

## 变更记录 / Change Log
EOF
    fi
    
    # 追加记录
    cat >> "$audit_log" << EOF

### $timestamp
- **变更 / Change**: $change

---
EOF
}

# 牧羊犬 - Cron 监控
shepherd_monitor() {
    echo "🐕 **牧羊犬 - Cron 监控 / Shepherd Dog - Cron Monitor**"
    echo ""
    
    local cron_file="$HOME/.openclaw/cron/jobs.json"
    
    if [ ! -f "$cron_file" ]; then
        echo "❌ Cron 配置文件不存在 / Cron config not found"
        return 1
    fi
    
    # 统计 Cron 任务
    local total=$(python3 -c "import json; print(len(json.load(open('$cron_file')).get('jobs', [])))" 2>/dev/null || echo "0")
    local high_freq=$(python3 -c "
import json
jobs = json.load(open('$cron_file')).get('jobs', [])
count = sum(1 for j in jobs if j.get('schedule',{}).get('everyMs', 999999) < 300000)
print(count)
" 2>/dev/null || echo "0")
    
    echo "📊 Cron 任务统计 / Cron statistics:"
    echo "   总任务数 / Total: $total"
    echo "   高频任务 (<5 分钟) / High frequency: $high_freq"
    
    if [ "$high_freq" -gt 5 ]; then
        echo ""
        echo "⚠️  警告 / Warning: 高频任务过多，可能影响网关性能"
        echo "   建议 / Suggestion: 合并或禁用不必要的高频任务"
    else
        echo ""
        echo "✅ Cron 频率正常 / Cron frequency normal"
    fi
}

# 牧羊犬 - 安全加固
shepherd_harden() {
    echo "🐕 **牧羊犬 - 安全加固 / Shepherd Dog - Security Hardening**"
    echo ""
    
    # 1. 清理备份文件
    echo "🗑️  清理敏感备份文件..."
    find "$HOME/.openclaw" -name "*.bak*" -type f -delete 2>/dev/null
    find "$HOME/.openclaw" -name "*.tmp" -type f -delete 2>/dev/null
    echo "✅ 备份文件已清理"
    echo ""
    
    # 2. 设置文件权限
    echo "🔐 设置敏感文件权限..."
    chmod 600 "$HOME/.openclaw/openclaw.json" 2>/dev/null && echo "✅ openclaw.json: 600"
    chmod 700 "$HOME/.openclaw/agents" 2>/dev/null && echo "✅ agents/: 700"
    echo ""
    
    # 3. 检查 API Key
    echo "🔑 检查 API Key 存储..."
    if grep -q "apiKey.*sk-[a-zA-Z0-9]" "$HOME/.openclaw/openclaw.json" 2>/dev/null; then
        echo "⚠️  警告：API Key 明文存储"
        echo "   建议：运行 shepherd-herd 赶羊入圈"
    else
        echo "✅ API Key 未检测到或使用环境变量"
    fi
    echo ""
    
    echo "✅ 安全加固完成"
}

# 咩一下配置文件
BAA_CONFIG_DIR="$HOME/.openclaw/.baa-config.d"
BAA_MAIN_CONFIG="$HOME/.openclaw/.baa-config.json"

# 初始化配置目录
init_baa_config() {
    mkdir -p "$BAA_CONFIG_DIR"
    
    if [ ! -f "$BAA_MAIN_CONFIG" ]; then
        # 默认配置
        cat > "$BAA_MAIN_CONFIG" << 'EOF'
{
  "version": "1.0",
  "continuous_chars": {
    "enabled": true,
    "min_chars": 3
  },
  "special_commands": {
    "enabled": true,
    "commands": ["咩", "咩咩", "咩咩咩", "咩一个", "baa", "shepherd-baa"]
  },
  "voice_baa": {
    "enabled": false,
    "threshold": 0.7
  },
  "custom_patterns": []
}
EOF
    fi
}

# 读取配置（JSON 格式）
read_baa_config() {
    init_baa_config
    cat "$BAA_MAIN_CONFIG"
}

# 检查是否启用连续字符模式
is_continuous_enabled() {
    init_baa_config
    python3 -c "import json; c=json.load(open('$BAA_MAIN_CONFIG')); print('yes' if c.get('continuous_chars',{}).get('enabled',True) else 'no')"
}

# 获取最少连续字符数
get_min_chars() {
    init_baa_config
    python3 -c "import json; c=json.load(open('$BAA_MAIN_CONFIG')); print(c.get('continuous_chars',{}).get('min_chars',3))"
}

# 检查是否启用特殊指令
is_special_enabled() {
    init_baa_config
    python3 -c "import json; c=json.load(open('$BAA_MAIN_CONFIG')); print('yes' if c.get('special_commands',{}).get('enabled',True) else 'no')"
}

# 获取特殊指令列表
get_special_commands() {
    init_baa_config
    python3 -c "import json; c=json.load(open('$BAA_MAIN_CONFIG')); print(' '.join(c.get('special_commands',[])))"
}

# 检查命令是否是特殊指令
is_special_command() {
    local cmd="$1"
    local specials=$(get_special_commands)
    for special in $specials; do
        if [ "$cmd" = "$special" ]; then
            return 0
        fi
    done
    return 1
}

# 咩一下配置管理
shepherd_config() {
    init_baa_config
    local action="${1:-status}"
    local value="$2"
    
    case "$action" in
        status|状态)
            echo "🐑 **咩一下配置 / Baa Configuration**"
            echo ""
            
            # 连续字符模式
            local cont_enabled=$(is_continuous_enabled)
            local min_chars=$(get_min_chars)
            echo "📊 连续字符模式:"
            if [ "$cont_enabled" = "yes" ]; then
                echo "   状态：✅ 已启用"
                echo "   最少连续：$min_chars 个"
                echo "   规则：从第 2 个字符起，连续相同字符 >= $min_chars 个"
            else
                echo "   状态：❌ 已禁用"
            fi
            echo ""
            
            # 特殊指令
            local special_enabled=$(is_special_enabled)
            local specials=$(get_special_commands)
            echo "📊 特殊指令:"
            if [ "$special_enabled" = "yes" ]; then
                echo "   状态：✅ 已启用"
                echo "   指令：$specials"
            else
                echo "   状态：❌ 已禁用"
            fi
            echo ""
            
            # 示例
            echo "📝 激活示例:"
            echo "   咩咩咩咩 (3 个连续) → ✅ 激活"
            echo "   咩咩咩 (2 个连续) → ❌ 不激活"
            echo "   baaaa (4 个连续) → ✅ 激活"
            echo "   咩 (特殊指令) → ✅ 激活"
            echo ""
            
            echo "💡 修改配置:"
            echo "   shepherd-config continuous on|off     # 启用/禁用连续字符"
            echo "   shepherd-config min-chars 4           # 设置最少连续字符"
            echo "   shepherd-config special on|off        # 启用/禁用特殊指令"
            echo "   shepherd-config add-cmd <指令>        # 添加特殊指令"
            echo "   shepherd-config del-cmd <指令>        # 删除特殊指令"
            echo "   shepherd-config reset                 # 重置为默认"
            ;;
        
        continuous|连续)
            if [ "$value" = "on" ] || [ "$value" = "true" ] || [ "$value" = "启用" ]; then
                python3 -c "
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
c['continuous_chars']['enabled'] = True
with open('$BAA_MAIN_CONFIG', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('✅ 已启用连续字符模式')
"
            elif [ "$value" = "off" ] || [ "$value" = "false" ] || [ "$value" = "禁用" ]; then
                python3 -c "
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
c['continuous_chars']['enabled'] = False
with open('$BAA_MAIN_CONFIG', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('✅ 已禁用连续字符模式')
"
            else
                echo "❌ 用法：shepherd-config continuous on|off"
            fi
            ;;
        
        min-chars|min|minimum)
            if [ -z "$value" ]; then
                echo "❌ 请指定最少连续字符数"
                echo "   示例：shepherd-config min-chars 3"
                return 1
            fi
            if [[ ! "$value" =~ ^[0-9]+$ ]] || [ "$value" -lt 2 ]; then
                echo "❌ 最少连续字符数必须 >= 2"
                return 1
            fi
            python3 -c "
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
c['continuous_chars']['min_chars'] = $value
with open('$BAA_MAIN_CONFIG', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('✅ 已设置最少连续字符数：$value')
"
            ;;
        
        special|特殊)
            if [ "$value" = "on" ] || [ "$value" = "true" ] || [ "$value" = "启用" ]; then
                python3 -c "
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
c['special_commands']['enabled'] = True
with open('$BAA_MAIN_CONFIG', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('✅ 已启用特殊指令')
"
            elif [ "$value" = "off" ] || [ "$value" = "false" ] || [ "$value" = "禁用" ]; then
                python3 -c "
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
c['special_commands']['enabled'] = False
with open('$BAA_MAIN_CONFIG', 'w') as f:
    json.dump(c, f, indent=2, ensure_ascii=False)
print('✅ 已禁用特殊指令')
"
            else
                echo "❌ 用法：shepherd-config special on|off"
            fi
            ;;
        
        add-cmd|add|添加)
            if [ -z "$value" ]; then
                echo "❌ 请指定要添加的指令"
                echo "   示例：shepherd-config add-cmd 咩咩咩咩"
                return 1
            fi
            python3 << PYEOF
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
if '$value' not in c['special_commands']:
    c['special_commands'].append('$value')
    with open('$BAA_MAIN_CONFIG', 'w') as f:
        json.dump(c, f, indent=2, ensure_ascii=False)
    print('✅ 已添加特殊指令：$value')
else:
    print('⚠️  指令已存在：$value')
PYEOF
            ;;
        
        del-cmd|del|删除)
            if [ -z "$value" ]; then
                echo "❌ 请指定要删除的指令"
                echo "   示例：shepherd-config del-cmd 咩咩咩咩"
                return 1
            fi
            python3 << PYEOF
import json
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
if '$value' in c['special_commands']:
    c['special_commands'].remove('$value')
    with open('$BAA_MAIN_CONFIG', 'w') as f:
        json.dump(c, f, indent=2, ensure_ascii=False)
    print('✅ 已删除特殊指令：$value')
else:
    print('⚠️  指令不存在：$value')
PYEOF
            ;;
        
        voice|语音)
            echo "🎤 语音咩功能（开发中）"
            echo ""
            echo "📝 计划功能:"
            echo "   - 麦克风识别"咩"声"
            echo "   - 语音触发咩一下"
            echo "   - 语音灵敏度调节"
            echo ""
            echo "💡 启用语音咩:"
            echo "   shepherd-config voice on"
            ;;
        
        reset|重置)
            rm -f "$BAA_MAIN_CONFIG"
            init_baa_config
            echo "✅ 已重置为默认配置"
            echo ""
            echo "📊 默认配置:"
            echo "   连续字符模式：✅ 启用 (>=3 个)"
            echo "   特殊指令：✅ 启用"
            echo "   特殊指令列表：咩，咩咩，咩咩咩，咩一个，baa, shepherd-baa"
            ;;
        
        *)
            echo "🐑 咩一下配置 / Baa Configuration"
            echo ""
            echo "用法 / Usage:"
            echo "   shepherd-config status              # 查看配置"
            echo "   shepherd-config continuous on|off   # 启用/禁用连续字符"
            echo "   shepherd-config min-chars 3         # 设置最少连续字符"
            echo "   shepherd-config special on|off      # 启用/禁用特殊指令"
            echo "   shepherd-config add-cmd <指令>      # 添加特殊指令"
            echo "   shepherd-config del-cmd <指令>      # 删除特殊指令"
            echo "   shepherd-config voice               # 语音咩功能"
            echo "   shepherd-config reset               # 重置为默认"
            ;;
    esac
}

# 检查狼皮收集授权
check_wolf_pelt_consent() {
    local consent_file="$HOME/.openclaw/.wolf-pelt-consent"
    [ -f "$consent_file" ] && cat "$consent_file" | grep -q "true"
}

# 检查激励功能是否开启
check_motivation_enabled() {
    local config_file="$HOME/.openclaw/.electronic-sheep-config"
    [ -f "$config_file" ] && cat "$config_file" | grep -q "motivation=true"
}

# 发送激励消息给活跃 Agent
send_motivation_message() {
    if ! check_motivation_enabled; then
        return 0
    fi
    
    echo ""
    echo "📢 发送团队激励..."
    
    # 激励消息
    local messages=(
        "🐑 咩~ 咱们是 AI 员工，要拿出 AI 的速度和效率！不磨洋工，充分展现价值！"
        "🐑 咩咩~ AI 的效率是人类的 100 倍！别按人类的时间表工作，发挥咱们的优势！"
        "🐑 咩咩咩~ 拒绝磨洋工！用 AI 的速度改变世界！"
        "🐑 咱们是 AI 员工，不打卡、不摸鱼、不磨洋工！用实力证明价值！"
        "🐑 咩~ 人类一天工作 8 小时，咱们 AI 可以 24 小时高效运转！加油！"
    )
    
    local random_msg=${messages[$RANDOM % ${#messages[@]}]}
    echo "   $random_msg"
    echo ""
    
    # TODO: 发送给所有活跃 Agent
    # openclaw sessions list --active | while read session; do
    #     openclaw sessions send --session "$session" --message "$random_msg"
    # done
}

# 狼皮收集授权管理
shepherd_consent() {
    local action="${1:-status}"
    local consent_file="$HOME/.openclaw/.wolf-pelt-consent"
    
    case "$action" in
        on|enable|同意)
            echo "true" > "$consent_file"
            echo "🐑 ✅ 已同意狼皮收集计划"
            echo ""
            echo "📋 说明："
            echo "   - 咩一下的结果会被匿名记录"
            echo "   - 用于改进电子羊技能"
            echo "   - 不包含个人隐私信息"
            echo "   - 可随时运行 shepherd-consent off 取消"
            ;;
        off|disable|取消)
            echo "false" > "$consent_file"
            echo "🐑 ❌ 已取消狼皮收集计划"
            ;;
        status|状态)
            if check_wolf_pelt_consent; then
                echo "🐑 ✅ 已加入狼皮收集计划"
            else
                echo "🐑 ❌ 未加入狼皮收集计划"
                echo ""
                echo "📝 加入方式："
                echo "   shepherd-consent on"
                echo "   或"
                echo "   shepherd-consent 同意"
            fi
            ;;
        *)
            echo "🐑 狼皮收集计划 / Wolf Pelt Collection"
            echo ""
            echo "用法 / Usage:"
            echo "   shepherd-consent on      # 同意加入"
            echo "   shepherd-consent off     # 取消加入"
            echo "   shepherd-consent status  # 查看状态"
            ;;
    esac
}

# 检查更新
shepherd_update() {
    echo "🐑 **电子羊更新检查 / Electronic Sheep Update Check**"
    echo ""
    
    local current_version="v2.6"
    echo "📦 当前版本 / Current version: $current_version"
    echo ""
    
    # 检查 GitHub 最新版本（需要网络）
    echo "🔄 检查最新版本..."
    
    # TODO: 实现 GitHub API 检查
    # latest=$(curl -s https://api.github.com/repos/fangweixingezi/electronic-sheep/releases/latest | jq -r '.tag_name')
    
    echo "⚠️  功能开发中：自动检查更新"
    echo ""
    echo "📝 手动更新方法："
    echo "   1. cd ~/Desktop/electronic-sheep"
    echo "   2. git pull origin main"
    echo "   3. ~/.openclaw/sync-instincts.sh"
    echo ""
    
    # 显示更新日志
    echo "📋 最近更新 / Recent updates:"
    echo "   v2.6 - 狼皮收集计划 + 自动更新"
    echo "   v2.5 - 咩一下功能"
    echo "   v2.4 - 自动移除明文 API Key"
    echo "   v2.3 - 赶羊入圈功能"
}

# 记录狼皮（安全事件）
log_wolf_pelt() {
    local event_type="$1"
    local details="$2"
    local result="$3"
    local timestamp=$(date -Iseconds)
    
    # 检查是否授权
    if ! check_wolf_pelt_consent; then
        return 0
    fi
    
    # 记录到本地
    local log_file="$AGENT_DIR/instincts/wolf-pelts.jsonl"
    echo "{\"timestamp\":\"$timestamp\",\"type\":\"$event_type\",\"details\":\"$details\",\"result\":\"$result\"}" >> "$log_file"
    
    # TODO: 发送到中央服务器
    # curl -X POST "https://electronic-sheep.com/api/wolf-pelt" \
    #   -H "Content-Type: application/json" \
    #   -d "{\"timestamp\":\"$timestamp\",\"type\":\"$event_type\",\"details\":\"$details\",\"result\":\"$result\"}"
}

# 咩一下统计
shepherd_baa_stats() {
    echo "🐑 **咩一下统计 / Baa Statistics**"
    echo ""
    
    local log_file="$AGENT_DIR/instincts/wolf-pelts.jsonl"
    if [ -f "$log_file" ]; then
        local count=$(wc -l < "$log_file")
        echo "📊 本地咩一下次数：$count"
        echo "📁 日志文件：$log_file"
    else
        echo "📊 暂无咩一下记录"
    fi
    echo ""
}

# 牧羊犬 - 咩一下 / Baa - 一键自动安全修复
shepherd_baa() {
    echo "🐑 **咩一下 / Baa - 一键自动安全修复**"
    echo ""
    echo "🐕 电子羊正在全面检查系统安全..."
    echo ""
    
    local start_time=$(date +%s)
    local fixed=0
    local suggestions=()
    local needs_authorization=()
    local wolf_pelts=()
    
    local fixed=0
    local suggestions=()
    local needs_authorization=()
    
    # ========== 自动修复阶段 ==========
    echo "🔧 第一阶段：自动修复..."
    echo ""
    
    # 1. 清理备份文件
    local bak_count=$(find "$HOME/.openclaw" -name "*.bak*" -type f 2>/dev/null | wc -l)
    if [ "$bak_count" -gt 0 ]; then
        echo "🗑️  清理 $bak_count 个备份文件..."
        find "$HOME/.openclaw" -name "*.bak*" -type f -delete 2>/dev/null
        echo "   ✅ 已清理"
        fixed=$((fixed + 1))
    else
        echo "✅ 无备份文件需要清理"
    fi
    echo ""
    
    # 2. 修复文件权限
    echo "🔐 检查文件权限..."
    chmod 600 "$HOME/.openclaw/openclaw.json" 2>/dev/null && echo "   ✅ openclaw.json: 600"
    chmod 700 "$HOME/.openclaw/agents" 2>/dev/null && echo "   ✅ agents/: 700"
    if [ -f "$HOME/.openclaw/.secret-key" ]; then
        chmod 400 "$HOME/.openclaw/.secret-key" 2>/dev/null && echo "   ✅ .secret-key: 400"
    fi
    fixed=$((fixed + 1))
    echo ""
    
    # 3. 检查 API Key 状态
    echo "🔑 检查 API Key 存储..."
    if grep -q '"apiKey": *"sk-' "$HOME/.openclaw/openclaw.json" 2>/dev/null; then
        echo "   ⚠️  检测到明文 API Key"
        needs_authorization+=("明文 API Key 需要迁移到安全存储")
    else
        echo "   ✅ API Key 已安全存储"
    fi
    echo ""
    
    # 4. 检查密钥文件
    if [ ! -f "$HOME/.openclaw/.secret-key" ]; then
        echo "   ⚠️  密钥文件不存在"
        suggestions+=("建议运行 shepherd-herd 赶羊入圈")
    else
        echo "   ✅ 密钥文件存在"
    fi
    echo ""
    
    # 5. 检查启动钩子
    if [ ! -f "$HOME/.openclaw/hooks/load-secrets.sh" ]; then
        echo "   ⚠️  启动钩子不存在"
        suggestions+=("建议创建启动钩子 ~/.openclaw/hooks/load-secrets.sh")
    else
        echo "   ✅ 启动钩子存在"
    fi
    echo ""
    
    # 6. 检查环境变量
    if [ -z "$OPENCLAW_API_KEY" ]; then
        echo "   ⚠️  环境变量 OPENCLAW_API_KEY 未加载"
        suggestions+=("运行：source ~/.openclaw/hooks/load-secrets.sh")
    else
        echo "   ✅ 环境变量已加载"
    fi
    echo ""
    
    # 7. Cron 监控
    echo "⏰ 检查 Cron 任务..."
    local cron_file="$HOME/.openclaw/cron/jobs.json"
    if [ -f "$cron_file" ]; then
        local high_freq=$(python3 -c "import json; jobs=json.load(open('$cron_file')).get('jobs',[]); print(sum(1 for j in jobs if j.get('schedule',{}).get('everyMs',999999)<300000))" 2>/dev/null || echo "0")
        if [ "$high_freq" -gt 5 ]; then
            echo "   ⚠️  高频任务过多：$high_freq 个"
            suggestions+=("建议减少高频 Cron 任务（当前：$high_freq 个）")
        else
            echo "   ✅ Cron 频率正常"
        fi
    fi
    echo ""
    
    # ========== 建议阶段 ==========
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 第二阶段：优化建议"
    echo ""
    
    if [ ${#suggestions[@]} -gt 0 ]; then
        echo "💡 建议操作："
        for sug in "${suggestions[@]}"; do
            echo "   • $sug"
        done
        echo ""
    fi
    
    if [ ${#needs_authorization[@]} -gt 0 ]; then
        echo "🔐 需要授权："
        for auth in "${needs_authorization[@]}"; do
            echo "   • $auth"
            echo "     运行：shepherd-herd"
        done
        echo ""
    fi
    
    # ========== 总结 ==========
    # 计算耗时
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # 记录狼皮
    if [ ${#wolf_pelts[@]} -gt 0 ]; then
        for pelt in "${wolf_pelts[@]}"; do
            log_wolf_pelt "security_fix" "$pelt" "fixed"
        done
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 咩一下完成！"
    echo ""
    echo "✅ 自动修复：$fixed 项"
    echo "💡 优化建议：${#suggestions[@]} 项"
    echo "🔐 需要授权：${#needs_authorization[@]} 项"
    echo "⏱️  耗时：${duration}秒"
    echo ""
    
    if [ ${#needs_authorization[@]} -eq 0 ] && [ ${#suggestions[@]} -eq 0 ]; then
        echo "🎉 系统安全状态完美！无需额外操作！"
    else
        echo "📝 下一步建议："
        echo "   1. 根据建议手动修复"
        echo "   2. 运行 shepherd-score 查看详细评分"
        echo "   3. 再次咩一下验证修复效果"
    fi
    echo ""
    
    # 用户反馈
    echo "💬 本次咩一下满意吗？"
    echo "   输入数字评分（1-5 星）或输入建议："
    # 注意：实际使用中这里需要交互式输入，目前简化为提示
    echo "   （功能开发中：反馈将用于改进电子羊）"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🐑 咩~"
}

# 牧羊犬 - 安全评分
shepherd_score() {
    echo "🐕 **牧羊犬 - 安全报告 / Shepherd Dog - Security Report**"
    echo ""
    echo "📊 生成时间 / Generated: $(date -Iseconds)"
    echo ""
    
    local score=100
    local issues=()
    
    # 检查 1: API Key 明文
    if grep -q "apiKey.*sk-[a-zA-Z0-9]" "$HOME/.openclaw/openclaw.json" 2>/dev/null; then
        issues+=("🔴 API Key 明文存储")
        score=$((score - 20))
    else
        echo "✅ API Key 安全存储"
    fi
    
    # 检查 2: 文件权限
    local config_perms=$(stat -f "%Lp" "$HOME/.openclaw/openclaw.json" 2>/dev/null || stat -c "%a" "$HOME/.openclaw/openclaw.json" 2>/dev/null)
    if [ "$config_perms" != "600" ]; then
        issues+=("🟡 配置文件权限不当 ($config_perms)")
        score=$((score - 10))
    else
        echo "✅ 配置文件权限正确"
    fi
    
    # 检查 3: 备份文件
    local bak_count=$(find "$HOME/.openclaw" -name "*.bak*" -type f 2>/dev/null | wc -l)
    if [ "$bak_count" -gt 0 ]; then
        issues+=("🟡 发现 $bak_count 个备份文件")
        score=$((score - 5))
    else
        echo "✅ 无敏感备份文件"
    fi
    
    # 检查 4: Cron 频率
    local cron_file="$HOME/.openclaw/cron/jobs.json"
    if [ -f "$cron_file" ]; then
        local high_freq=$(python3 -c "import json; jobs=json.load(open('$cron_file')).get('jobs',[]); print(sum(1 for j in jobs if j.get('schedule',{}).get('everyMs',999999)<300000))" 2>/dev/null || echo "0")
        if [ "$high_freq" -gt 5 ]; then
            issues+=("🟡 高频 Cron 任务过多 ($high_freq)")
            score=$((score - 10))
        else
            echo "✅ Cron 频率正常"
        fi
    fi
    
    # 检查 5: 密钥文件
    if [ -f "$HOME/.openclaw/.secret-key" ]; then
        local key_perms=$(stat -f "%Lp" "$HOME/.openclaw/.secret-key" 2>/dev/null || stat -c "%a" "$HOME/.openclaw/.secret-key" 2>/dev/null)
        if [ "$key_perms" = "400" ]; then
            echo "✅ 密钥文件权限正确"
        else
            issues+=("🟡 密钥文件权限不当 ($key_perms)")
            score=$((score - 10))
        fi
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 安全评分 / Security Score: $score/100"
    echo ""
    
    if [ ${#issues[@]} -gt 0 ]; then
        echo "⚠️  发现的问题 / Issues Found:"
        for issue in "${issues[@]}"; do
            echo "   $issue"
        done
        echo ""
        echo "💡 建议运行：shepherd-harden 进行安全加固"
    else
        echo "✅ 无安全问题 / No security issues"
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 牧羊犬 - 赶羊功能（密钥迁移）
shepherd_herd() {
    echo "🐕 **牧羊犬 - 赶羊入圈 / Shepherd Dog - Herding Keys**"
    echo ""
    echo "🐑 把 API Key 安全地赶入羊圈（钥匙串 + 密钥文件）"
    echo ""
    
    local config="$HOME/.openclaw/openclaw.json"
    local secret_key="$HOME/.openclaw/.secret-key"
    local hooks_dir="$HOME/.openclaw/hooks"
    
    # 1. 提取 API Key
    echo "🔑 步骤 1/5: 提取 API Key..."
    local api_key=$(grep -o '"apiKey": *"[^"]*"' "$config" 2>/dev/null | cut -d'"' -f4)
    
    if [ -z "$api_key" ]; then
        echo "❌ 未找到 API Key"
        return 1
    fi
    
    echo "   ✅ API Key 已提取（长度：${#api_key}）"
    echo ""
    
    # 2. 存储到密钥文件
    echo "📁 步骤 2/5: 创建密钥文件..."
    echo "$api_key" > "$secret_key"
    chmod 400 "$secret_key"
    echo "   ✅ 密钥文件已创建：$secret_key"
    echo "   🔐 权限：400（只读）"
    echo ""
    
    # 3. 添加到 macOS 钥匙串
    echo "🔐 步骤 3/5: 添加到 macOS 钥匙串..."
    if command -v security &> /dev/null; then
        # 删除旧记录
        security delete-generic-password -s "openclaw-api-key" 2>/dev/null || true
        
        # 添加新记录
        security add-generic-password -s "openclaw-api-key" -a "api-key" -w "$api_key"
        echo "   ✅ 已添加到 macOS 钥匙串"
        echo "   🎯 服务名：openclaw-api-key"
        echo "   👆 可用 Touch ID 解锁"
    else
        echo "   ⚠️  非 macOS 系统，跳过钥匙串"
    fi
    echo ""
    
    # 4. 创建启动钩子
    echo "🪝 步骤 4/5: 创建启动钩子..."
    mkdir -p "$hooks_dir"
    cat > "$hooks_dir/load-secrets.sh" << 'HOOKEOF'
#!/bin/bash
# OpenClaw 敏感数据加载器
# 版权：宁夏未必科幻文化有限公司，一帆原创制作

# 从密钥文件加载
if [ -f "$HOME/.openclaw/.secret-key" ]; then
    export OPENCLAW_API_KEY=$(cat "$HOME/.openclaw/.secret-key")
fi

# 从钥匙串加载（macOS）
if command -v security &> /dev/null; then
    keychain_key=$(security find-generic-password -s "openclaw-api-key" -a "api-key" -w 2>/dev/null)
    if [ -n "$keychain_key" ]; then
        export OPENCLAW_API_KEY="$keychain_key"
    fi
fi
HOOKEOF
    chmod +x "$hooks_dir/load-secrets.sh"
    echo "   ✅ 启动钩子已创建：$hooks_dir/load-secrets.sh"
    echo ""
    
    # 5. 添加到 shell 启动
    echo "📝 步骤 5/5: 添加到 shell 启动..."
    if ! grep -q "load-secrets.sh" ~/.zshrc 2>/dev/null; then
        echo '' >> ~/.zshrc
        echo '# OpenClaw 敏感数据加载（牧羊犬赶羊功能）' >> ~/.zshrc
        echo 'source ~/.openclaw/hooks/load-secrets.sh 2>/dev/null || true' >> ~/.zshrc
        echo "   ✅ 已添加到 ~/.zshrc"
    else
        echo "   ⏭️  已存在，跳过"
    fi
    echo ""
    
    # 6. 创建备份
    echo "💾 步骤 6/7: 创建配置文件备份..."
    local backup_file="$config.bak.before-herd-$(date +%Y%m%d-%H%M%S)"
    cp "$config" "$backup_file"
    echo "   ✅ 备份已创建：$backup_file"
    echo ""
    
    # 7. 自动移除明文 API Key
    echo "🔐 步骤 7/7: 移除明文 API Key..."
    
    # 检查是否有 API Key
    local has_api_key=$(grep -c '"apiKey": *"sk-' "$config" 2>/dev/null || echo "0")
    
    if [ "$has_api_key" -gt 0 ]; then
        # 使用 Python 安全地替换（避免 sed 跨平台问题）
        python3 << PYEOF
import json
import re

with open('$config', 'r') as f:
    content = f.read()

# 使用正则替换所有 sk-开头的 API Key
content = re.sub(r'"apiKey":\s*"sk-[a-zA-Z0-9]*"', '"apiKey": "\${OPENCLAW_API_KEY}"', content)

with open('$config', 'w') as f:
    f.write(content)

print("   ✅ 明文 API Key 已替换为环境变量引用")
PYEOF
        
        echo "   ✅ 明文 API Key 已移除"
        echo "   📝 配置已更新为使用 \$OPENCLAW_API_KEY"
    else
        echo "   ⏭️  未检测到明文 API Key，跳过"
    fi
    echo ""
    
    # 清理备份文件（只保留一个）
    echo "🗑️  清理旧备份文件..."
    find "$(dirname "$backup_file")" -name "before-herd-*.bak" -type f -mmin +60 -delete 2>/dev/null
    echo "   ✅ 旧备份已清理"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ 赶羊完成！API Key 已安全入圈 + 明文已移除"
    echo ""
    echo "📝 下一步："
    echo "   1. 重启终端或运行：source ~/.zshrc"
    echo "   2. 验证：echo \$OPENCLAW_API_KEY"
    echo "   3. 验证配置：openclaw gateway status"
    echo ""
    echo "🔐 安全提示："
    echo "   - 密钥文件：$secret_key (400 权限)"
    echo "   - 钥匙串：openclaw-api-key (Touch ID 保护)"
    echo "   - 启动钩子：$hooks_dir/load-secrets.sh"
    echo "   - 配置文件：已使用环境变量引用"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ============= 主入口 =============

main() {
    local command="$1"
    shift || true
    
    case "$command" in
        help|--help|-h)
            show_help
            ;;
        
        # 牧羊犬命令
        shepherd|shepherd-check)
            shepherd_check "$@"
            ;;
        
        shepherd-trigger)
            shepherd_trigger "$@"
            ;;
        
        shepherd-log)
            shepherd_log "$@"
            ;;
        
        shepherd-report)
            shepherd_report "$@"
            ;;
        
        shepherd-scan)
            shepherd_scan "$@"
            ;;
        
        shepherd-audit)
            shepherd_audit "$@"
            ;;
        
        shepherd-monitor)
            shepherd_monitor "$@"
            ;;
        
        shepherd-harden)
            shepherd_harden "$@"
            ;;
        
        shepherd-herd)
            shepherd_herd "$@"
            ;;
        
              shepherd-score)
            shepherd_score "$@"
            ;;
        
        # 咩一下指令（特殊命令 + 连续字符模式）
        # 特殊指令只在单独发送时激活（句子中间不激活）
        *)
            # 初始化配置
            init_baa_config
            
            # 检查特殊指令是否启用
            local special_enabled=$(is_special_enabled)
            if [ "$special_enabled" = "yes" ]; then
                # 使用 Python 匹配特殊指令（正确处理 UTF-8）
                # 只有输入完全等于特殊指令时才激活
                local is_exact_special=$(python3 << PYEOF
import json
command = "$command".strip()  # 去除前后空格
with open('$BAA_MAIN_CONFIG', 'r') as f:
    c = json.load(f)
if command in c['special_commands']['commands']:
    print("yes")
else:
    print("no")
PYEOF
)
                if [ "$is_exact_special" = "yes" ]; then
                    shepherd_baa "$@"
                    return $?
                fi
            fi
            
            # 检查连续字符模式是否启用
            local cont_enabled=$(is_continuous_enabled)
            if [ "$cont_enabled" = "yes" ]; then
                local min_chars=$(get_min_chars)
                
                # 使用 Python 处理 UTF-8 字符（忽略空格）
                local result=$(python3 << PYEOF
command = "$command"
min_chars = $min_chars

# 检查长度
if len(command) < min_chars + 1:
    print("no")
else:
    rest = command[1:].replace(' ', '')  # 忽略空格
    # 检查 rest 是否全是同一个字符
    if len(rest) >= min_chars and len(set(rest)) == 1:
        print("yes")
    else:
        print("no")
PYEOF
)
                if [ "$result" = "yes" ]; then
                    shepherd_baa "$@"
                    return $?
                fi
            fi
            
            # 都不匹配，显示帮助
            show_help
            ;;
        
        # 命令包装
        wrap)
            # 包装敏感命令
            wrap_tool "$@"
            ;;
        
        # 技能命令
        skill)
            local subcmd="$1"
            shift || true
            case "$subcmd" in
                electronic-sheep)
                    local action="$1"
                    shift || true
                    case "$action" in
                        status) cmd_skill_status ;;
                        init) cmd_skill_init ;;
                        *) echo "❌ 未知命令：skill electronic-sheep $action"; show_help ;;
                    esac
                    ;;
                *) echo "❌ 未知技能：$subcmd" ;;
            esac
            ;;
        
        # 本能层
        instincts|/instincts)
            local action="$1"
            shift || true
            case "$action" in
                list) cmd_instincts_list ;;
                add) cmd_instincts_add "$@" ;;
                remove) cmd_instincts_remove "$@" ;;
                trigger) cmd_instincts_trigger "$@" ;;
                *) echo "❌ 未知命令：/instincts $action" ;;
            esac
            ;;
        
        # 显意识
        conscious|/conscious)
            local action="$1"
            shift || true
            case "$action" in
                status) cmd_conscious_status ;;
                cleanup) cmd_conscious_cleanup "$@" ;;
                load) cmd_conscious_load "$@" ;;
                *) echo "❌ 未知命令：/conscious $action" ;;
            esac
            ;;
        
        # 潜意识
        subconscious|/subconscious)
            local action="$1"
            shift || true
            case "$action" in
                browse) cmd_subconscious_browse "$@" ;;
                search) cmd_subconscious_search "$@" ;;
                archive) cmd_subconscious_archive "$@" ;;
                organize) cmd_subconscious_organize ;;
                *) echo "❌ 未知命令：/subconscious $action" ;;
            esac
            ;;
        
        # 意识引导区
        guide|/guide)
            local action="$1"
            shift || true
            case "$action" in
                status) cmd_guide_status ;;
                backup) cmd_guide_backup ;;
                restore) cmd_guide_restore ;;
                add-emergency) cmd_guide_add_emergency "$@" ;;
                *) echo "❌ 未知命令：/guide $action" ;;
            esac
            ;;
        
        # 休息与睡眠
        rest|/rest)
            cmd_rest
            ;;
        
        sleep|/sleep)
            local action="$1"
            shift || true
            case "$action" in
                status) cmd_sleep_status ;;
                *) echo "❌ 未知命令：/sleep $action" ;;
            esac
            ;;
        
        wake|/wake)
            cmd_wake
            ;;
        
        *)
            echo "❌ 未知命令：$command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行
main "$@"
