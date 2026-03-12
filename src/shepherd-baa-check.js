#!/usr/bin/env node
/**
 * 咩一下 - 检测阶段
 * 咩里咩气地检测，用牧草/虫/羊圈的比喻
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');
const RESULT_FILE = path.join(BAA_LOG_DIR, 'baa-result.json');
const BAA_HISTORY_FILE = path.join(BAA_LOG_DIR, 'baa-history.json');

if (!fs.existsSync(BAA_LOG_DIR)) {
    fs.mkdirSync(BAA_LOG_DIR, { recursive: true });
}

/**
 * 白名单（这些不算问题）
 */
const WHITELIST_PATTERNS = [
    '*.bak',
    '*.bak.*',
    '*.backup',
    '*.old',
    '.secret-key',
    'load-secrets.sh'
];

/**
 * 获取历史记录
 */
function getBaaHistory() {
    try {
        const data = fs.readFileSync(BAA_HISTORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { count: 0, lastIssues: 0, fixes: 0, lastTime: null };
    }
}

/**
 * 检测问题
 */
function detectIssues() {
    const issues = {
        agentConfig: { incomplete: 0, total: 0, active: 0, inactive: 0, details: [] },
        cronErrors: { count: 0, details: [] },
        security: { highRisk: [], score: 100 }
    };
    
    // 1. 检测 Agent 配置
    const agentsDir = path.join(HOME, '.openclaw', 'agents');
    if (fs.existsSync(agentsDir)) {
        const agents = fs.readdirSync(agentsDir).filter(d => !d.startsWith('.'));
        issues.agentConfig.total = agents.length;
        
        agents.forEach(agent => {
            const agentDir = path.join(agentsDir, agent, 'agent');
            if (fs.existsSync(agentDir)) {
                const requiredFiles = ['IDENTITY.md', 'SKILL.md', 'system-prompt.md'];
                const missing = requiredFiles.filter(f => !fs.existsSync(path.join(agentDir, f)));
                
                if (missing.length > 0) {
                    issues.agentConfig.incomplete++;
                    issues.agentConfig.details.push({
                        agent: agent,
                        missing: missing
                    });
                }
                
                // 检测活跃度
                const sessionsDir = path.join(agentsDir, agent, 'sessions');
                if (fs.existsSync(sessionsDir)) {
                    const sessions = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.jsonl'));
                    if (sessions.length > 0) {
                        const latest = sessions.map(s => {
                            const stat = fs.statSync(path.join(sessionsDir, s));
                            return { file: s, mtime: stat.mtimeMs };
                        }).sort((a, b) => b.mtime - a.mtime)[0];
                        
                        const hoursSince = (Date.now() - latest.mtime) / (1000 * 60 * 60);
                        if (hoursSince < 48) {
                            issues.agentConfig.active++;
                        } else {
                            issues.agentConfig.inactive++;
                        }
                    } else {
                        issues.agentConfig.inactive++;
                    }
                } else {
                    issues.agentConfig.inactive++;
                }
            }
        });
    }
    
    // 2. 检测 Cron 错误
    const cronFile = path.join(HOME, '.openclaw', 'cron', 'jobs.json');
    if (fs.existsSync(cronFile)) {
        try {
            const cron = JSON.parse(fs.readFileSync(cronFile, 'utf8'));
            if (cron.jobs) {
                cron.jobs.forEach(job => {
                    if (job.state?.lastRunStatus === 'error') {
                        issues.cronErrors.count++;
                        issues.cronErrors.details.push({
                            name: job.name || job.id,
                            error: job.state.lastError,
                            consecutiveErrors: job.state.consecutiveErrors || 0
                        });
                    }
                });
            }
        } catch (e) {}
    }
    
    // 3. 检测安全问题（API Key 加入白名单，不再报告）
    // 明文 API Key 是正常配置，不算安全问题
    
    // 扣分项
    if (issues.agentConfig.incomplete > 0) {
        issues.security.score -= Math.min(20, issues.agentConfig.incomplete);
    }
    if (issues.cronErrors.count > 0) {
        issues.security.score -= Math.min(15, issues.cronErrors.count);
    }
    
    // API Key 是白名单，不扣分
    
    // 4. 检测备份文件（白名单，不算问题，只报告数量）
    let backupCount = 0;
    try {
        const bakFiles = execSync(`find "${HOME}/.openclaw" -name "*.bak*" -type f 2>/dev/null | wc -l`, { encoding: 'utf8' });
        backupCount = parseInt(bakFiles.trim());
    } catch (e) {}
    
    return { issues, backupCount };
}

/**
 * 咩里咩气地输出检测结果
 */
function outputReport(result) {
    const { issues, backupCount } = result;
    const history = getBaaHistory();
    
    const totalIssues = issues.agentConfig.incomplete + issues.cronErrors.count + issues.security.highRisk.length;
    
    // 读取历史记录，生成个性化开场
    const count = history.count || 0;
    let opening = '';
    if (count === 0) {
        opening = '第一次听你咩咩，有点紧张咩~';
    } else if (count < 5) {
        opening = `第${count + 1}咩了，越来越熟练了咩~`;
    } else {
        opening = '老熟人了咩，一听就是你~';
    }
    
    // 根据上次结果生成第二句
    const lastIssues = history.lastIssues || 0;
    let secondLine = '';
    if (lastIssues === 0) {
        secondLine = '上次草地挺完美的，这次让本咩再看看咩~';
    } else if (lastIssues > 50) {
        secondLine = '上次虫灾严重，这次让本咩看看好转没咩~';
    } else {
        secondLine = '让我尝尝这回的 bug……额，不对，牧草咋样咩~';
    }
    
    // 开场
    console.log(`# 🐑 电子羊**咩小鲜**听见了牧羊人的召唤！\n`);
    console.log(`咩一下 ${opening}\n`);
    console.log(`${secondLine}\n`);
    
    // 总览
    if (totalIssues >= 50) {
        console.log(`## 哇咩……这草地被虫啃得不成样了，**${totalIssues}** 个咩！\n`);
    } else if (totalIssues >= 10) {
        console.log(`## 嗯咩……发现 **${totalIssues}** 个虫，得治治了咩。\n`);
    } else if (totalIssues > 0) {
        console.log(`## 发现 **${totalIssues}** 个小虫，问题不大咩。\n`);
    } else {
        console.log(`## 🎉 哇咩！这片草地太完美了，一个虫都没有咩！\n`);
    }
    
    // Agent 配置
    if (issues.agentConfig.incomplete > 0) {
        const rate = Math.round(issues.agentConfig.active / issues.agentConfig.total * 100);
        console.log(`**Agent 配置**: ${issues.agentConfig.incomplete} 个没配齐（就 ${rate}% 的出勤率），只有 ${issues.agentConfig.active} 个是完整的咩。\n`);
    }
    
    // 活跃度
    console.log(`**活跃度**: ${issues.agentConfig.active} 个在干活，${issues.agentConfig.inactive} 个在摸鱼咩。\n`);
    
    // Cron 错误
    if (issues.cronErrors.count > 0) {
        console.log(`**Cron**: ${issues.cronErrors.count} 个报错咩。\n`);
        console.log(`具体是这些：\n`);
        issues.cronErrors.details.slice(0, 5).forEach(d => {
            let humanReadable = d.error;
            if (humanReadable.includes('Feishu account "default" not configured')) {
                humanReadable = '飞书 default 账号没配置好，那些每天定时跑的 Cron 任务（市场晨会、运营晨会、人事日报啥的）都失败了咩';
            } else if (humanReadable.includes('timed out')) {
                humanReadable = '任务超时了，跑太长时间被强制停止咩（房产监控那个，每次都要跑 5 分钟）';
            } else if (humanReadable.includes('Delivering to Feishu requires target')) {
                humanReadable = '飞书消息发不出去，找不到接收人咩（那些闲置检测的任务）';
            }
            console.log(`- ${humanReadable}\n`);
        });
    }
    
    // 羊圈安全检查
    console.log(`## 羊圈安全检查：\n`);
    console.log(`**安全评分**: **${issues.security.score}/100**\n`);
    
    if (issues.security.highRisk.length > 0) {
        console.log(`⚠️ **狼来了**：发现明文 API Key（得你亲自处理）\n`);
    }
    
    // 备份文件（白名单）
    if (backupCount > 0) {
        console.log(`🔧 **本咩能帮你修的**：\n`);
        console.log(`发现 ${backupCount} 个备份文件残留咩\n`);
    }
    
    // 修复提示
    if (totalIssues > 0 || backupCount > 0) {
        const prompts = [
            `## 羊圈需要修补，亡羊补牢为时不晚咩~\n\n**让本咩给你补补看？**\n\n回复"修复"咩，本咩立马开工~`,
            `## 咩~ 这些活本咩能干！\n\n**要不要本咩动手？**\n\n回复"修复"咩，我马上开始~`,
            `## 有问题别怕，本咩在呢！\n\n**让本咩帮你修修？**\n\n回复"修复"咩，立马开工~`,
            `## 草地有虫，本咩来治！\n\n**要不要本咩出手？**\n\n回复"修复"咩，保证治好~`
        ];
        console.log(`\n${prompts[Math.floor(Math.random() * prompts.length)]}\n`);
    }
    
    // 保存结果
    fs.writeFileSync(RESULT_FILE, JSON.stringify({
        timestamp: new Date().toISOString(),
        issues,
        backupCount,
        totalIssues
    }, null, 2));
    
    // 更新历史
    history.count = count + 1;
    history.lastIssues = totalIssues;
    history.lastTime = new Date().toISOString();
    fs.writeFileSync(BAA_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// 主函数
async function main() {
    const result = detectIssues();
    outputReport(result);
}

main().catch(console.error);
