#!/usr/bin/env node
/**
 * 咩一下 - 飞书交互版
 * 
 * 通过 OpenClaw message 工具发送到飞书
 * 分 4 阶段发送独立消息
 * 
 * 用法：node shepherd-baa-feishu.js [用户指令] [target_user_id]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');
const RESULT_FILE = path.join(BAA_LOG_DIR, 'baa-result.json');

// 确保日志目录存在
if (!fs.existsSync(BAA_LOG_DIR)) {
    fs.mkdirSync(BAA_LOG_DIR, { recursive: true });
}

/**
 * 幽默回复模板库
 */
const FUNNY_RESPONSES = [
    {
        open: [
            "🎉 哇！系统似乎好像大概或许看起来很棒！",
            "🐑 咩~ 让我用电子羊的 X 光眼扫一眼...",
            "✨ 叮！电子羊正在施展魔法检查...",
            "🔮 让咩咩来占卜一下系统状态...",
            "👀 电子羊睁大了眼睛开始检查...",
            "🐕 牧羊犬出动！系统你准备好了吗？",
            "🎯 咩一下！系统请接招！",
            "🌈 电子羊彩虹检查启动！",
        ],
        middle: [
            "让我瞧瞧……嗯……有点意思……",
            "看起来……好像……大概……也许……",
            "根据咩咩的第六感……",
            "电子羊说……它感觉……",
            "经过精密计算（其实没有）……",
            "咩咩认为……可能……大概……",
            "从咩咩的角度来看……",
            "电子羊的直觉告诉我……",
        ],
        wait: [
            "📬 深度检查进行中，稍后汇报详细结果！",
            "🐑 咩咩正在努力工作，一会儿告诉你！",
            "⏳ 详细检查中，你可以先喝杯茶～",
            "🔍 咩咩钻到系统里去了，马上回来！",
            "💫 电子羊正在系统深处探索！",
            "🚀 深度扫描发射！等待信号返回……",
        ]
    }
];

/**
 * 随机选择回复
 */
function getRandomResponse() {
    const r = FUNNY_RESPONSES[0];
    return {
        open: r.open[Math.floor(Math.random() * r.open.length)],
        middle: r.middle[Math.floor(Math.random() * r.middle.length)],
        wait: r.wait[Math.floor(Math.random() * r.wait.length)]
    };
}

/**
 * 快速检查
 */
function quickCheck() {
    const issues = [];
    
    try {
        execSync('pgrep -f "openclaw.*gateway" > /dev/null 2>&1', { encoding: 'utf8' });
    } catch (e) {
        issues.push({ type: 'warning', message: '网关进程似乎不在运行' });
    }
    
    const configFile = path.join(HOME, '.openclaw', 'openclaw.json');
    if (!fs.existsSync(configFile)) {
        issues.push({ type: 'error', message: '配置文件不见了！' });
    }
    
    try {
        const diskCheck = execSync('df -h / | tail -1 | awk \'{print $5}\' | tr -d "%"', { encoding: 'utf8' });
        const usage = parseInt(diskCheck.trim());
        if (usage > 90) {
            issues.push({ type: 'warning', message: `磁盘空间有点紧张 (${usage}%)` });
        }
    } catch (e) {}
    
    return issues;
}

/**
 * 执行深度检查
 */
function runDeepCheck() {
    const deepCheckScript = path.join(__dirname, 'shepherd-deep-check.js');
    
    try {
        const result = execSync(`node "${deepCheckScript}" 2>&1`, { 
            encoding: 'utf8',
            timeout: 30000 
        });
        
        const summary = parseDeepCheckResult(result);
        summary.rawOutput = result;
        
        return { success: true, summary };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * 解析深度检查结果
 */
function parseDeepCheckResult(output) {
    const summary = {
        timestamp: new Date().toISOString(),
        agents: { total: 0, complete: 0, incomplete: 0, missing: 0 },
        active: { count: 0, inactive: 0 },
        cron: { total: 0, errors: 0, details: [] },
        fixable: []
    };
    
    const agentMatch = output.match(/✅ 完整 \| (\d+)/);
    if (agentMatch) summary.agents.complete = parseInt(agentMatch[1]);
    
    const incompleteMatch = output.match(/⚠️ 不完整 \| (\d+)/);
    if (incompleteMatch) summary.agents.incomplete = parseInt(incompleteMatch[1]);
    
    const missingMatch = output.match(/❌ 缺失 \| (\d+)/);
    if (missingMatch) summary.agents.missing = parseInt(missingMatch[1]);
    
    summary.agents.total = summary.agents.complete + summary.agents.incomplete + summary.agents.missing;
    
    const activeMatch = output.match(/🟢 活跃 \(48h 内\): (\d+)/);
    if (activeMatch) summary.active.count = parseInt(activeMatch[1]);
    
    const inactiveMatch = output.match(/😴 休眠 \(48h\+\): (\d+)/);
    if (inactiveMatch) summary.active.inactive = parseInt(inactiveMatch[1]);
    
    const cronTotalMatch = output.match(/总任务数：(\d+)/);
    if (cronTotalMatch) summary.cron.total = parseInt(cronTotalMatch[1]);
    
    const cronErrorMatch = output.match(/有错误：(\d+)/);
    if (cronErrorMatch) summary.cron.errors = parseInt(cronErrorMatch[1]);
    
    if (summary.agents.incomplete > 0) {
        summary.fixable.push({ type: 'agent_config', count: summary.agents.incomplete, action: '补全 Agent 配置文件' });
    }
    
    if (summary.cron.errors > 0) {
        summary.fixable.push({ type: 'cron_errors', count: summary.cron.errors, action: '清理/修复 Cron 任务' });
    }
    
    return summary;
}

/**
 * 发送消息到飞书
 */
function sendToFeishu(message, targetUserId) {
    try {
        const cmd = `openclaw message send --channel feishu --target "${targetUserId}" --message ${JSON.stringify(message).replace(/"/g, '\\"')}`;
        execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ 消息已发送`);
    } catch (error) {
        console.error(`❌ 发送失败：${error.message}`);
    }
}

/**
 * 阶段 1：立即回复
 */
function phase1(userCommand, targetUserId) {
    const response = getRandomResponse();
    const quickIssues = quickCheck();
    
    let msg = `🐑 **咩一下 / Baa**\n\n`;
    msg += `${response.open}\n\n`;
    msg += `${response.middle}\n\n`;
    
    if (quickIssues.length > 0) {
        msg += `⚠️  **快速检查发现**:\n\n`;
        quickIssues.forEach(issue => {
            const icon = issue.type === 'error' ? '❌' : '⚠️';
            msg += `${icon} ${issue.message}\n`;
        });
        msg += '\n';
    } else {
        msg += `✨ 快速检查：一切看起来都很正常！\n\n`;
    }
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `${response.wait}\n\n`;
    msg += `🐑 咩~`;
    
    sendToFeishu(msg, targetUserId);
}

/**
 * 阶段 2：深度检查结果
 */
function phase2(summary, targetUserId) {
    let msg = `\n📊 **深度检查结果**\n\n`;
    
    msg += `### 1️⃣ Agent 配置完整性\n`;
    msg += `| ✅ 完整 | ${summary.agents.complete}/${summary.agents.total} (${Math.round(summary.agents.complete/summary.agents.total*100)}%) |\n`;
    msg += `| ⚠️ 不完整 | ${summary.agents.incomplete} |\n`;
    msg += `| ❌ 缺失 | ${summary.agents.missing} |\n\n`;
    
    msg += `### 2️⃣ Agent 活跃度\n`;
    msg += `🟢 活跃 (48h 内): ${summary.active.count} 个\n`;
    msg += `😴 休眠 (48h+): ${summary.active.inactive} 个\n\n`;
    
    msg += `### 3️⃣ Cron 任务状态\n`;
    msg += `总任务：${summary.cron.total} 个\n`;
    if (summary.cron.errors > 0) {
        msg += `❌ 错误：${summary.cron.errors} 个\n`;
    } else {
        msg += `✅ 无错误\n`;
    }
    msg += '\n';
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📋 **总结与建议**\n\n`;
    
    const issues = summary.agents.incomplete + summary.cron.errors;
    if (issues === 0) {
        msg += `🎉 系统状态完美！无需操作！\n\n`;
    } else {
        msg += `🔍 发现 **${issues}** 个问题\n\n`;
        msg += `💡 **建议操作**：\n`;
        if (summary.agents.incomplete > 0) {
            msg += `   1. 修复 ${summary.agents.incomplete} 个配置不完整的 Agent\n`;
        }
        if (summary.cron.errors > 0) {
            msg += `   2. 检查 ${summary.cron.errors} 个 Cron 任务错误\n`;
        }
        msg += `   3. 再次咩一下验证修复效果\n\n`;
    }
    
    if (summary.fixable.length > 0) {
        msg += `🔧 **可自动修复项**：\n`;
        summary.fixable.forEach((f, i) => {
            msg += `   ${i+1}. ${f.action} (${f.count}个) - 回复"修复"自动执行\n`;
        });
        msg += '\n';
    }
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    sendToFeishu(msg, targetUserId);
}

/**
 * 阶段 3：修复结果
 */
function phase3(fixResults, targetUserId) {
    let msg = `\n🔧 **修复结果**\n\n`;
    
    if (fixResults.length === 0) {
        msg += `✅ 无需修复项\n\n`;
    } else {
        fixResults.forEach((result, i) => {
            if (result.success) {
                msg += `✅ ${i+1}. ${result.action}: 成功修复 ${result.fixed} 个\n`;
            } else {
                msg += `⚠️ ${i+1}. ${result.action}: 部分失败 - ${result.error}\n`;
            }
        });
        msg += '\n';
    }
    
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    sendToFeishu(msg, targetUserId);
}

/**
 * 阶段 4：结束 - 羊重复用户指令
 */
function phase4(userCommand, targetUserId) {
    const sheepEmojis = ['🐑', '🐏', '🐐', '🦙'];
    const randomSheep = sheepEmojis[Math.floor(Math.random() * sheepEmojis.length)];
    
    const msg = `${randomSheep} **${userCommand}** ${randomSheep}\n\n_咩一下流程完成！有事随时叫我~_`;
    
    sendToFeishu(msg, targetUserId);
}

/**
 * 主函数
 */
async function main() {
    const userCommand = process.argv[2] || '咩一下';
    const targetUserId = process.argv[3];  // 飞书用户 ID
    
    if (!targetUserId) {
        console.error('❌ 缺少目标用户 ID');
        console.error('用法：node shepherd-baa-feishu.js [用户指令] [target_user_id]');
        process.exit(1);
    }
    
    // 阶段 1：立即回复
    phase1(userCommand, targetUserId);
    
    // 执行深度检查
    const deepResult = runDeepCheck();
    
    if (deepResult.success) {
        // 保存结果
        fs.writeFileSync(RESULT_FILE, JSON.stringify(deepResult.summary, null, 2));
        
        // 阶段 2：深度检查结果
        phase2(deepResult.summary, targetUserId);
        
        // 阶段 3：修复（如果有）
        if (deepResult.summary.fixable.length > 0) {
            const fixResults = [];
            phase3(fixResults, targetUserId);
        }
        
        // 阶段 4：结束
        phase4(userCommand, targetUserId);
    } else {
        sendToFeishu(`\n❌ 深度检查失败\n\n错误信息：${deepResult.error}\n`, targetUserId);
    }
}

// 执行
main().catch(console.error);
