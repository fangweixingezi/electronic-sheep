#!/bin/bash
# Electronic Sheep Skill - 安全命令包装 / Safe Command Wrapper
# 版权：宁夏未必科幻文化有限公司，一帆原创制作
# Copyright: Ningxia Not Necessarily Science Fiction Culture Co., Ltd., Yifan Original

# 🐕 牧羊犬守护所有敏感命令 / Shepherd Dog Guards All Sensitive Commands

set -e

AGENT_ID="${AGENT_ID:-main}"
HANDLER="$HOME/.openclaw/agents/$AGENT_ID/skills/electronic-sheep/src/handler.sh"
TOOL="$1"
shift
COMMAND="$TOOL $*"

# 检查 handler.sh 是否存在
if [ ! -f "$HANDLER" ]; then
    echo "❌ 错误 / Error: handler.sh not found at $HANDLER"
    exit 1
fi

# 🐕 牧羊犬检查 / Shepherd Dog Check
echo "🐕 **牧羊犬检查 / Shepherd Dog Check**"
echo ""

# 敏感工具列表
SENSITIVE_TOOLS=(
    "gateway"
    "config"
)

# 检查是否敏感工具
IS_SENSITIVE=0
for sensitive in "${SENSITIVE_TOOLS[@]}"; do
    if [[ "$TOOL" == "$sensitive" ]]; then
        # 检查具体子命令
        case "$*" in
            restart|stop|start|patch|apply|reboot)
                IS_SENSITIVE=1
                ;;
        esac
        break
    fi
done

if [ $IS_SENSITIVE -eq 0 ]; then
    # 非敏感命令，直接执行
    openclaw $COMMAND
    exit $?
fi

# 敏感命令 - 检查 CEO 批准
APPROVAL_FILE="$HOME/.openclaw/agents/$AGENT_ID/.ceo-approval"

if [ -f "$APPROVAL_FILE" ]; then
    echo "✅ CEO 已批准 / CEO approval obtained"
    echo "📋 命令 / Command: $COMMAND"
    echo "📝 批准原因 / Approval reason:"
    cat "$APPROVAL_FILE"
    echo ""
    
    # 执行命令
    openclaw $COMMAND
    RESULT=$?
    
    # 清理批准文件（一次性使用）
    rm -f "$APPROVAL_FILE"
    echo "🗑️ 批准文件已清理 / Approval file cleaned"
    
    exit $RESULT
else
    echo "❌ 此操作需要 CEO 批准 / This operation requires CEO approval"
    echo ""
    echo "📋 敏感操作 / Sensitive operation: $COMMAND"
    echo ""
    echo "📝 正确流程 / Correct process:"
    echo "   1. 汇报 CEO 并说明原因 / Report to CEO with reason"
    echo "   2. 等待 CEO 批准 / Wait for CEO approval"
    echo "   3. 创建批准文件 / Create approval file:"
    echo "      echo \"批准原因\" > $APPROVAL_FILE"
    echo "   4. 重新执行命令 / Re-run command"
    echo ""
    echo "🚫 操作已阻止 / Operation blocked"
    
    # 记录违规
    "$HANDLER" shepherd-report "unauthorized attempt: $COMMAND" 2>/dev/null || true
    
    exit 1
fi
