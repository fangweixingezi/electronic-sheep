#!/usr/bin/env node
/**
 * 咩深入 - 深度系统检查
 * 
 * 检查 Agent 配置完整性、员工状态、职位空缺等
 * 用法：node shepherd-deep-check.js
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '/Users/ai';
const AGENT_DIR = path.join(HOME, '.openclaw', 'agents');

// 必需文件清单
const REQUIRED_FILES = [
    'IDENTITY.md',
    'SKILL.md',
    'system-prompt.md'
];

// 可选文件清单
const OPTIONAL_FILES = [
    'agent.json',
    'conscious.md',
    'models.json'
];

// 电子羊部扩展团队（需要特殊检查）
const ES_AGENTS = [
    'es-psych-1',
    'es-market-1',
    'es-ux-1',
    'es-content-1'
];

/**
 * 检查 Agent 配置完整性
 */
function checkAgentConfig(agentId) {
    const agentPath = path.join(AGENT_DIR, agentId, 'agent');
    const result = {
        id: agentId,
        exists: false,
        required: {},
        optional: {},
        complete: false
    };
    
    if (!fs.existsSync(agentPath)) {
        return result;
    }
    
    result.exists = true;
    
    // 检查必需文件
    REQUIRED_FILES.forEach(file => {
        const filePath = path.join(agentPath, file);
        result.required[file] = fs.existsSync(filePath);
    });
    
    // 检查可选文件
    OPTIONAL_FILES.forEach(file => {
        const filePath = path.join(agentPath, file);
        result.optional[file] = fs.existsSync(filePath);
    });
    
    // 判断是否完整
    const requiredComplete = Object.values(result.required).every(v => v);
    result.complete = requiredComplete;
    
    return result;
}

/**
 * 获取 Agent 最后活跃时间
 */
function getLastActive(agentId) {
    const sessionsPath = path.join(AGENT_DIR, agentId, 'sessions');
    
    if (!fs.existsSync(sessionsPath)) {
        return null;
    }
    
    const sessions = fs.readdirSync(sessionsPath)
        .filter(f => f.endsWith('.jsonl'))
        .map(f => {
            const stat = fs.statSync(path.join(sessionsPath, f));
            return { file: f, mtime: stat.mtimeMs };
        });
    
    if (sessions.length === 0) {
        return null;
    }
    
    // 返回最新的修改时间
    sessions.sort((a, b) => b.mtime - a.mtime);
    return new Date(sessions[0].mtime);
}

/**
 * 检查 Cron 任务错误
 */
function checkCronErrors() {
    const cronFile = path.join(HOME, '.openclaw', 'cron', 'jobs.json');
    
    if (!fs.existsSync(cronFile)) {
        return { error: 'Cron 配置文件不存在' };
    }
    
    try {
        const cron = JSON.parse(fs.readFileSync(cronFile, 'utf8'));
        const errors = [];
        
        if (cron.jobs) {
            cron.jobs.forEach(job => {
                if (job.state?.lastRunStatus === 'error') {
                    errors.push({
                        id: job.id || job.name,
                        error: job.state.lastError,
                        consecutiveErrors: job.state.consecutiveErrors || 0
                    });
                }
            });
        }
        
        return {
            total: cron.jobs?.length || 0,
            errors: errors.length,
            details: errors
        };
    } catch (e) {
        return { error: '解析失败：' + e.message };
    }
}

/**
 * 检查飞书账号配置
 */
function checkFeishuConfig() {
    const configFile = path.join(HOME, '.openclaw', 'openclaw.json');
    
    if (!fs.existsSync(configFile)) {
        return { error: '配置文件不存在' };
    }
    
    try {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const feishu = config.channels?.feishu;
        
        if (!feishu) {
            return { configured: false };
        }
        
        const accounts = feishu.accounts || {};
        const result = {
            configured: true,
            accounts: Object.keys(accounts).length,
            issues: []
        };
        
        // 检查 default 账号
        if (accounts.default && !accounts.default.appId) {
            result.issues.push('default 账号缺少 appId');
        }
        
        // 检查 groupPolicy
        if (accounts.default?.groupPolicy === 'open') {
            result.issues.push('groupPolicy="open" 存在安全风险');
        }
        
        return result;
    } catch (e) {
        return { error: '解析失败：' + e.message };
    }
}

/**
 * 主检查函数
 */
async function deepCheck() {
    console.log('🐑 **咩深入 - 深度系统检查**\n');
    
    const startTime = Date.now();
    
    // 获取所有 Agent 目录
    let agents = [];
    if (fs.existsSync(AGENT_DIR)) {
        agents = fs.readdirSync(AGENT_DIR)
            .filter(name => !name.startsWith('.'));
    }
    
    console.log(`📊 检查范围：${agents.length} 个 Agent\n`);
    
    // ========== 1. Agent 配置检查 ==========
    console.log('## 1️⃣ Agent 配置完整性检查\n');
    
    const configResults = agents.map(agentId => checkAgentConfig(agentId));
    
    const complete = configResults.filter(r => r.complete && r.exists);
    const incomplete = configResults.filter(r => r.exists && !r.complete);
    const missing = configResults.filter(r => !r.exists);
    
    console.log(`| 状态 | 数量 | 占比 |`);
    console.log(`|------|------|------|`);
    console.log(`| ✅ 完整 | ${complete.length} | ${Math.round(complete.length / agents.length * 100)}% |`);
    console.log(`| ⚠️ 不完整 | ${incomplete.length} | ${Math.round(incomplete.length / agents.length * 100)}% |`);
    console.log(`| ❌ 缺失 | ${missing.length} | ${Math.round(missing.length / agents.length * 100)}% |`);
    console.log('');
    
    if (incomplete.length > 0) {
        console.log('### ⚠️ 配置不完整的 Agent\n');
        incomplete.slice(0, 10).forEach(r => {
            const missingFiles = Object.entries(r.required)
                .filter(([_, exists]) => !exists)
                .map(([file]) => file);
            console.log(`- **${r.id}**: 缺少 ${missingFiles.join(', ')}`);
        });
        if (incomplete.length > 10) {
            console.log(`- ... 还有 ${incomplete.length - 10} 个`);
        }
        console.log('');
    }
    
    // ========== 2. 活跃度检查 ==========
    console.log('## 2️⃣ Agent 活跃度检查（48 小时）\n');
    
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    
    const active = [];
    const inactive = [];
    
    agents.forEach(agentId => {
        const lastActive = getLastActive(agentId);
        if (!lastActive) {
            inactive.push({ id: agentId, reason: '无会话记录' });
            return;
        }
        
        const hoursSince = (now - lastActive.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 48) {
            active.push({ id: agentId, lastActive });
        } else {
            inactive.push({ id: agentId, lastActive, hoursSince });
        }
    });
    
    console.log(`🟢 活跃 (48h 内): ${active.length} 个`);
    console.log(`😴 休眠 (48h+): ${inactive.length} 个\n`);
    
    if (active.length > 0) {
        console.log('### 活跃 Agent\n');
        active.forEach(a => {
            console.log(`- ${a.id}: ${a.lastActive.toLocaleString('zh-CN')}`);
        });
        console.log('');
    }
    
    // ========== 3. Cron 任务检查 ==========
    console.log('## 3️⃣ Cron 任务状态检查\n');
    
    const cronStatus = checkCronErrors();
    
    if (cronStatus.error) {
        console.log(`❌ ${cronStatus.error}\n`);
    } else {
        console.log(`总任务数：${cronStatus.total}`);
        console.log(`有错误：${cronStatus.errors}\n`);
        
        if (cronStatus.details && cronStatus.details.length > 0) {
            console.log('### 有错误的任务\n');
            cronStatus.details.forEach(d => {
                console.log(`- **${d.id}**: ${d.error || '未知错误'} (连续 ${d.consecutiveErrors} 次)`);
            });
            console.log('');
        }
    }
    
    // ========== 4. 飞书配置检查 ==========
    console.log('## 4️⃣ 飞书账号配置检查\n');
    
    const feishuStatus = checkFeishuConfig();
    
    if (feishuStatus.error) {
        console.log(`❌ ${feishuStatus.error}\n`);
    } else if (!feishuStatus.configured) {
        console.log(`❌ 飞书账号未配置\n`);
    } else {
        console.log(`✅ 已配置 ${feishuStatus.accounts} 个账号`);
        
        if (feishuStatus.issues.length > 0) {
            console.log('\n### ⚠️ 配置问题\n');
            feishuStatus.issues.forEach(issue => {
                console.log(`- ${issue}`);
            });
        } else {
            console.log('✅ 无配置问题');
        }
        console.log('');
    }
    
    // ========== 总结 ==========
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 咩深入检查完成！\n');
    console.log(`⏱️  耗时：${duration}秒`);
    console.log(`📋 检查项：4 大类`);
    console.log(`🔍 发现：${incomplete.length} 个配置问题，${cronStatus.errors || 0} 个 Cron 错误`);
    console.log('');
    
    if (incomplete.length > 0 || (cronStatus.errors && cronStatus.errors > 0)) {
        console.log('💡 建议操作：');
        console.log('   1. 修复配置不完整的 Agent');
        console.log('   2. 检查 Cron 任务错误原因');
        console.log('   3. 再次咩深入验证修复效果');
    } else {
        console.log('🎉 系统状态完美！');
    }
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 执行
deepCheck().catch(console.error);
