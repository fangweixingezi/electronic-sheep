#!/usr/bin/env node
/**
 * 咩一下 - 自然语言理解
 * Agent 戴着面具理解用户的自然语言
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');
const RESULT_FILE = path.join(BAA_LOG_DIR, 'baa-result.json');

/**
 * 理解用户意图
 */
function understandIntent(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // 退出触发词
    const exitTriggers = ['拜拜', '再见', '好了', '可以了', '不用了', '退出', '结束', 'stop', 'bye', '88'];
    
    // 继续触发词
    const continueTriggers = ['继续', '接着', '再来', 'continue', 'more', '还有'];
    
    // 修复触发词
    const fixTriggers = ['修复', '修', 'fix', 'repair', '处理', '解决', '搞定'];
    
    // 状态查询
    const statusTriggers = ['状态', '情况', '咋样', '如何', 'status', 'check', '看看'];
    
    // 咩一下触发词
    const baaTriggers = ['咩', 'baa', '咩一下', 'shepherd-baa'];
    
    // 判断意图
    if (exitTriggers.some(t => input.includes(t))) {
        return { action: 'exit', confidence: 0.9 };
    }
    
    if (continueTriggers.some(t => input.includes(t))) {
        const hasResult = fs.existsSync(RESULT_FILE);
        if (hasResult) {
            return { action: 'continue_fix', confidence: 0.9 };
        }
    }
    
    if (fixTriggers.some(t => input.includes(t))) {
        return { action: 'fix', confidence: 0.9 };
    }
    
    if (statusTriggers.some(t => input.includes(t))) {
        return { action: 'status', confidence: 0.9 };
    }
    
    if (baaTriggers.includes(input) || (input.length >= 3 && new Set(input).size === 1)) {
        return { action: 'baa', confidence: 0.9 };
    }
    
    // 默认：可能是继续修复
    const hasResult = fs.existsSync(RESULT_FILE);
    if (hasResult) {
        return { action: 'continue_fix', confidence: 0.5 };
    }
    
    return { action: 'baa', confidence: 0.5 };
}

/**
 * 主函数
 */
async function main() {
    const userInput = process.argv[2] || '';
    
    if (!userInput) {
        return;
    }
    
    // 如果是咩一下触发，先检查完整性
    const isBaaTrigger = baaTriggers.includes(userInput) || (userInput.length >= 3 && new Set(userInput).size === 1);
    
    if (isBaaTrigger) {
        // 运行完整性检查（不输出给用户）
        try {
            const scriptDir = __dirname;
            execSync(`node "${scriptDir}/shepherd-integrity-check.js" > /dev/null 2>&1`, { encoding: 'utf8' });
        } catch (e) {
            // 完整性检查失败不影响咩一下功能
        }
    }
    
    // 理解意图
    const intent = understandIntent(userInput);
    
    // 根据意图执行对应操作
    const scriptDir = __dirname;
    
    if (intent.action === 'exit') {
        console.log(`\n###EXIT_SIGNAL###\n###END_EXIT_SIGNAL###\n`);
    } else if (intent.action === 'baa') {
        execSync(`node "${scriptDir}/shepherd-baa-check.js"`, { stdio: 'inherit' });
    } else if (intent.action === 'fix' || intent.action === 'continue_fix') {
        execSync(`node "${scriptDir}/shepherd-baa-fix.js" "${userInput}"`, { stdio: 'inherit' });
    } else if (intent.action === 'status') {
        execSync(`node "${scriptDir}/shepherd-baa-check.js"`, { stdio: 'inherit' });
    }
}

main().catch(console.error);
