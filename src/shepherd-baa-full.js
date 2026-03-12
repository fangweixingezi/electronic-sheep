#!/usr/bin/env node
/**
 * 咩一下 - 完整版（等待深度检查完成）
 * 
 * 立即显示幽默回复 + 快速检查
 * 等待深度检查完成（最多 30 秒）
 * 展示深度检查结果摘要
 * 
 * 用法：node shepherd-baa-full.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');

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
        middle: r.middle[Math.floor(Math.random() * r.middle.length)]
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
 * 执行深度检查并获取结果
 */
function runDeepCheck() {
    const deepCheckScript = path.join(__dirname, 'shepherd-deep-check.js');
    const logFile = path.join(BAA_LOG_DIR, `deep-check-${Date.now()}.log`);
    const resultFile = path.join(BAA_LOG_DIR, 'latest-result.json');
    
    console.log('');
    console.log('⏳ 深度检查中，请稍候（最多 30 秒）...');
    console.log('');
    
    try {
        // 执行深度检查并捕获输出
        const result = execSync(`node "${deepCheckScript}" 2>&1`, { 
            encoding: 'utf8',
            timeout: 30000 
        });
        
        // 保存完整日志
        fs.writeFileSync(logFile, result);
        
        // 解析关键数据
        const summary = parseDeepCheckResult(result);
        
        // 保存摘要结果
        fs.writeFileSync(resultFile, JSON.stringify(summary, null, 2));
        
        return {
            success: true,
            logFile: logFile,
            summary: summary
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            logFile: logFile
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
        cron: { total: 0, errors: 0 },
        feishu: { configured: false, issues: [] }
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
    
    return summary;
}

/**
 * 主函数
 */
async function main() {
    const response = getRandomResponse();
    const quickIssues = quickCheck();
    
    // 输出幽默回复 + 快速检查
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
    
    // 执行深度检查
    const deepResult = runDeepCheck();
    
    if (deepResult.success) {
        const s = deepResult.summary;
        
        console.log('📊 **深度检查结果**\n');
        
        // Agent 配置
        console.log('### 1️⃣ Agent 配置');
        console.log(`| ✅ 完整 | ${s.agents.complete}/${s.agents.total} (${Math.round(s.agents.complete/s.agents.total*100)}%) |`);
        console.log(`| ⚠️ 不完整 | ${s.agents.incomplete} |`);
        console.log(`| ❌ 缺失 | ${s.agents.missing} |`);
        console.log('');
        
        // 活跃度
        console.log('### 2️⃣ 活跃度');
        console.log(`🟢 活跃：${s.active.count} 个`);
        console.log(`😴 休眠：${s.active.inactive} 个`);
        console.log('');
        
        // Cron 错误
        console.log('### 3️⃣ Cron 任务');
        console.log(`总任务：${s.cron.total} 个`);
        if (s.cron.errors > 0) {
            console.log(`❌ 错误：${s.cron.errors} 个`);
        } else {
            console.log(`✅ 无错误`);
        }
        console.log('');
        
        // 总结
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📋 **总结**\n');
        
        const issues = s.agents.incomplete + s.cron.errors;
        if (issues === 0) {
            console.log('🎉 系统状态完美！无需操作！');
        } else {
            console.log(`🔍 发现 ${issues} 个问题`);
            console.log('');
            console.log('💡 **建议操作**：');
            if (s.agents.incomplete > 0) {
                console.log(`   1. 修复 ${s.agents.incomplete} 个配置不完整的 Agent`);
            }
            if (s.cron.errors > 0) {
                console.log(`   2. 检查 ${s.cron.errors} 个 Cron 任务错误`);
            }
            console.log(`   3. 再次咩一下验证修复效果`);
        }
        console.log('');
        console.log(`📁 详细日志：${deepResult.logFile}`);
        console.log('');
        
    } else {
        console.log('❌ 深度检查失败\n');
        console.log(`错误信息：${deepResult.error}`);
        console.log('');
        console.log(`📁 日志文件：${deepResult.logFile}`);
        console.log('');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🐑 咩~\n');
}

// 执行
main().catch(console.error);
