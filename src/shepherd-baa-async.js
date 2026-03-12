#!/usr/bin/env node
/**
 * 咩一下 - 异步后台检查
 * 
 * 立即返回幽默回复，后台异步深度检查
 * 用法：node shepherd-baa-async.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');
const BAA_RESULT_FILE = path.join(BAA_LOG_DIR, 'latest-result.json');

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
            "📬 深度检查已在后台运行，结果稍后查看！",
            "🐑 咩咩正在努力工作，完成后告诉你！",
            "⏳ 详细检查中，你可以先喝杯茶～",
            "🔍 咩咩钻到系统里去了，一会儿回来！",
            "💫 电子羊正在系统深处探索！",
            "🚀 深度扫描发射！等待信号返回……",
        ],
        check: [
            "查看命令：cat ~/.openclaw/.baa-logs/latest-result.json",
            "或者等咩咩主动告诉你结果～",
            "结果会保存到：~/.openclaw/.baa-logs/latest-result.json",
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
        wait: r.wait[Math.floor(Math.random() * r.wait.length)],
        check: r.check[Math.floor(Math.random() * r.check.length)]
    };
}

/**
 * 快速检查（<1 秒）
 */
function quickCheck() {
    const issues = [];
    
    // 1. 检查网关进程
    try {
        const gatewayCheck = execSync('pgrep -f "openclaw.*gateway" 2>/dev/null || echo ""', { encoding: 'utf8' });
        if (!gatewayCheck.trim()) {
            issues.push({ type: 'warning', message: '网关进程似乎不在运行' });
        }
    } catch (e) {
        issues.push({ type: 'warning', message: '无法检查网关状态' });
    }
    
    // 2. 检查配置文件
    const configFile = path.join(HOME, '.openclaw', 'openclaw.json');
    if (!fs.existsSync(configFile)) {
        issues.push({ type: 'error', message: '配置文件不见了！' });
    }
    
    // 3. 检查磁盘空间
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
 * 后台深度检查
 */
function startDeepCheck() {
    const deepCheckScript = path.join(__dirname, 'shepherd-deep-check.js');
    const logFile = path.join(BAA_LOG_DIR, `deep-check-${Date.now()}.log`);
    
    // 启动后台进程
    exec(`node "${deepCheckScript}" > "${logFile}" 2>&1`, (error, stdout, stderr) => {
        const result = {
            timestamp: new Date().toISOString(),
            logFile: logFile,
            completed: !error,
            error: error ? error.message : null
        };
        
        // 保存结果
        fs.writeFileSync(BAA_RESULT_FILE, JSON.stringify(result, null, 2));
        
        // 如果有错误，记录详细日志
        if (stderr) {
            fs.appendFileSync(logFile, '\n\n=== Error Log ===\n' + stderr);
        }
    });
    
    return logFile;
}

/**
 * 主函数
 */
async function main() {
    const response = getRandomResponse();
    const quickIssues = quickCheck();
    
    // 立即输出幽默回复
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
    console.log(`📁 ${response.check}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🐑 咩~\n');
    
    // 启动后台深度检查
    const logFile = startDeepCheck();
    console.log(`_深度检查日志：${logFile}_`);
}

// 执行
main().catch(console.error);
