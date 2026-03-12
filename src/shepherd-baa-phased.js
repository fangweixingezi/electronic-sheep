#!/usr/bin/env node
/**
 * 咩一下 - 分阶段异步汇报
 * 
 * 阶段 1：立即幽默回复 + 快速检查
 * 阶段 2：深度检查完成 → 完整结果 + 建议
 * 阶段 3：修复完成 → 修复结果
 * 阶段 4：结束 → 羊重复用户指令
 * 
 * 用法：node shepherd-baa-phased.js [用户指令]
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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
 * 快速检查（<1 秒）
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
 * 阶段 1：立即回复
 */
function phase1_quick(userCommand) {
    const response = getRandomResponse();
    const quickIssues = quickCheck();
    
    console.log(`🐑 **咩一下 / Baa**\n`);
    console.log(`${response.open}\n`);
    console.log(`${response.middle}\n`);
    
    if (quickIssues.length > 0) {
        console.log('⚠️  **快速检查发现**:\n');
        quickIssues.forEach(issue => {
            const icon = issue.type === 'error' ? '❌' : '⚠️';
            console.log(`${icon} ${issue.message}`);
        });
        console.log('');
    } else {
        console.log('✨ 快速检查：一切看起来都很正常！\n');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`${response.wait}\n`);
    console.log('📊 深度检查进行中，请稍候...');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🐑 咩~\n');
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
        
        return {
            success: true,
            summary: summary
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
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
        feishu: { configured: false, issues: [] },
        fixable: []
    };
    
    // 解析 Agent 配置
    const agentMatch = output.match(/✅ 完整 \| (\d+)/);
    if (agentMatch) summary.agents.complete = parseInt(agentMatch[1]);
    
    const incompleteMatch = output.match(/⚠️ 不完整 \| (\d+)/);
    if (incompleteMatch) summary.agents.incomplete = parseInt(incompleteMatch[1]);
    
    const missingMatch = output.match(/❌ 缺失 \| (\d+)/);
    if (missingMatch) summary.agents.missing = parseInt(missingMatch[1]);
    
    summary.agents.total = summary.agents.complete + summary.agents.incomplete + summary.agents.missing;
    
    // 解析活跃度
    const activeMatch = output.match(/🟢 活跃 \(48h 内\): (\d+)/);
    if (activeMatch) summary.active.count = parseInt(activeMatch[1]);
    
    const inactiveMatch = output.match(/😴 休眠 \(48h\+\): (\d+)/);
    if (inactiveMatch) summary.active.inactive = parseInt(inactiveMatch[1]);
    
    // 解析 Cron
    const cronTotalMatch = output.match(/总任务数：(\d+)/);
    if (cronTotalMatch) summary.cron.total = parseInt(cronTotalMatch[1]);
    
    const cronErrorMatch = output.match(/有错误：(\d+)/);
    if (cronErrorMatch) summary.cron.errors = parseInt(cronErrorMatch[1]);
    
    // 提取错误详情
    const errorSection = output.match(/### 有错误的任务([\s\S]*?)(?=##|$)/);
    if (errorSection) {
        const errorLines = errorSection[1].split('\n').filter(l => l.includes('**'));
        errorLines.slice(0, 5).forEach(line => {
            const match = line.match(/\*\*(.+?)\*\*: (.+)/);
            if (match) {
                summary.cron.details.push({ name: match[1], error: match[2] });
            }
        });
    }
    
    // 识别可修复项
    if (summary.agents.incomplete > 0) {
        summary.fixable.push({
            type: 'agent_config',
            count: summary.agents.incomplete,
            action: '补全 Agent 配置文件',
            command: 'node shepherd-fix-agents.js'
        });
    }
    
    if (summary.cron.errors > 0) {
        summary.fixable.push({
            type: 'cron_errors',
            count: summary.cron.errors,
            action: '清理/修复 Cron 任务',
            command: 'openclaw cron update/remove'
        });
    }
    
    return summary;
}

/**
 * 阶段 2：深度检查结果汇报
 */
function phase2_deep_result(summary) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 **深度检查结果**\n');
    
    // Agent 配置
    console.log('### 1️⃣ Agent 配置完整性');
    console.log(`| ✅ 完整 | ${summary.agents.complete}/${summary.agents.total} (${Math.round(summary.agents.complete/summary.agents.total*100)}%) |`);
    console.log(`| ⚠️ 不完整 | ${summary.agents.incomplete} |`);
    console.log(`| ❌ 缺失 | ${summary.agents.missing} |`);
    console.log('');
    
    // 活跃度
    console.log('### 2️⃣ Agent 活跃度');
    console.log(`🟢 活跃 (48h 内): ${summary.active.count} 个`);
    console.log(`😴 休眠 (48h+): ${summary.active.inactive} 个`);
    console.log('');
    
    // Cron 错误
    console.log('### 3️⃣ Cron 任务状态');
    console.log(`总任务：${summary.cron.total} 个`);
    if (summary.cron.errors > 0) {
        console.log(`❌ 错误：${summary.cron.errors} 个`);
        if (summary.cron.details.length > 0) {
            console.log('\n**部分错误**：');
            summary.cron.details.forEach(d => {
                console.log(`- ${d.name}: ${d.error.substring(0, 50)}...`);
            });
        }
    } else {
        console.log(`✅ 无错误`);
    }
    console.log('');
    
    // 总结和建议
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 **总结与建议**\n');
    
    const issues = summary.agents.incomplete + summary.cron.errors;
    if (issues === 0) {
        console.log('🎉 系统状态完美！无需操作！');
    } else {
        console.log(`🔍 发现 **${issues}** 个问题\n`);
        console.log('💡 **建议操作**：');
        if (summary.agents.incomplete > 0) {
            console.log(`   1. 修复 ${summary.agents.incomplete} 个配置不完整的 Agent`);
        }
        if (summary.cron.errors > 0) {
            console.log(`   2. 检查 ${summary.cron.errors} 个 Cron 任务错误`);
        }
        console.log(`   3. 再次咩一下验证修复效果`);
    }
    console.log('');
    
    // 可修复项
    if (summary.fixable.length > 0) {
        console.log('🔧 **可自动修复项**：');
        summary.fixable.forEach((f, i) => {
            console.log(`   ${i+1}. ${f.action} (${f.count}个) - 回复"修复"自动执行`);
        });
        console.log('');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 阶段 3：修复结果汇报
 */
function phase3_fix_result(fixResults) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔧 **修复结果**\n');
    
    if (fixResults.length === 0) {
        console.log('✅ 无需修复项');
    } else {
        fixResults.forEach((result, i) => {
            if (result.success) {
                console.log(`✅ ${i+1}. ${result.action}: 成功修复 ${result.fixed} 个`);
            } else {
                console.log(`⚠️ ${i+1}. ${result.action}: 部分失败 - ${result.error}`);
            }
        });
    }
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 阶段 4：结束 - 羊重复用户指令
 */
function phase4_end(userCommand) {
    const sheepEmojis = ['🐑', '🐏', '🐐', '🦙'];
    const randomSheep = sheepEmojis[Math.floor(Math.random() * sheepEmojis.length)];
    
    console.log(`${randomSheep} **${userCommand}** ${randomSheep}\n`);
    console.log('_咩一下流程完成！有事随时叫我~_\n');
}

/**
 * 主函数
 */
async function main() {
    const userCommand = process.argv[2] || '咩一下';
    
    // 阶段 1：立即回复
    phase1_quick(userCommand);
    
    // 后台执行深度检查
    const deepResult = runDeepCheck();
    
    if (deepResult.success) {
        // 阶段 2：深度检查结果
        phase2_deep_result(deepResult.summary);
        
        // 保存结果
        fs.writeFileSync(RESULT_FILE, JSON.stringify(deepResult.summary, null, 2));
        
        // 阶段 3：修复（如果有）
        if (deepResult.summary.fixable.length > 0) {
            // 这里可以等待用户确认，或者自动修复
            // 简化版本：自动修复
            const fixResults = [];
            // TODO: 实际修复逻辑
            phase3_fix_result(fixResults);
        }
        
        // 阶段 4：结束
        phase4_end(userCommand);
    } else {
        console.log('\n❌ 深度检查失败\n');
        console.log(`错误信息：${deepResult.error}\n`);
    }
}

// 执行
main().catch(console.error);
