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
🐑 电子羊仿生意识系统 - 命令帮助

**技能命令**:
  skill electronic-sheep status    - 查看技能状态
  skill electronic-sheep init      - 重新初始化

**本能层命令**:
  /instincts list                  - 查看本能规则
  /instincts add --name "名" --content "内容"  - 添加规则
  /instincts remove --name "名"    - 删除规则
  /instincts trigger --keyword "词" - 触发本能

**显意识命令**:
  /conscious status                - 查看显意识状态
  /conscious cleanup               - 清理显意识
  /conscious load --from 路径      - 加载潜意识内容

**潜意识命令**:
  /subconscious browse --path 路径  - 浏览潜意识
  /subconscious search --query "词" - 搜索潜意识
  /subconscious archive --from 源 --to 目标 - 归档
  /subconscious organize           - 整理潜意识

**意识引导区命令**:
  /guide status                    - 查看引导区状态
  /guide backup                    - 手动备份
  /guide restore                   - 从备份恢复
  /guide add-emergency --content "内容" - 添加紧急备忘

**休息与睡眠**:
  /rest                            - 手动休息（触发记忆整理）
  /sleep status                    - 查看睡眠状态
  /wake                            - 唤醒

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

# ============= 主入口 =============

main() {
    local command="$1"
    shift || true
    
    case "$command" in
        help|--help|-h)
            show_help
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
