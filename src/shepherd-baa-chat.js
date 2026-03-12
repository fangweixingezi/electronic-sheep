#!/usr/bin/env node
/**
 * 咩一下 - 上下文感知版
 * 根据用户历史、偏好生成个性化内容咩
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

function getBaaHistory() {
    try {
        const data = fs.readFileSync(BAA_HISTORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { count: 0, lastIssues: 0, fixes: 0, lastTime: null };
    }
}

function saveBaaHistory(history) {
    fs.writeFileSync(BAA_HISTORY_FILE, JSON.stringify(history, null, 2));
}

function generateCompliment(userCommand, history) {
    const count = history.count || 0;
    if (count === 0) {
        return `${userCommand} 第一次听你咩咩，有点紧张咩~`;
    } else if (count < 5) {
        return `${userCommand} 第${count + 1}咩了，越来越熟练了咩~`;
    } else if (count < 20) {
        const reactions = [
            `${userCommand} 老熟人了咩，一听就是你~`,
            `${userCommand} 这节奏，一听就是经常咩咩的人~`,
            `${userCommand} 专业水准咩，不愧是老用户~`
        ];
        return reactions[Math.floor(Math.random() * reactions.length)];
    } else {
        const reactions = [
            `${userCommand} 咩界元老来了咩！`,
            `${userCommand} 这气势，咩界大佬咩！`,
            `${userCommand} 资深牧羊人咩，给你请安了~`
        ];
        return reactions[Math.floor(Math.random() * reactions.length)];
    }
}

function generateOpener(history) {
    const lastIssues = history.lastIssues || 0;
    const lastFixes = history.fixes || 0;
    
    if (lastIssues === 0) {
        return `上次草地挺完美的，这次让本咩再看看咩~`;
    } else if (lastIssues > 50) {
        return `上次虫灾严重，这次让本咩看看好转没咩~`;
    } else if (lastFixes > 0) {
        return `上次修了${lastFixes}个问题，这次看看还有啥咩~`;
    } else {
        const openers = [
            `让本咩看看这次牧草咋样咩~`,
            `本咩已经准备好消化系统了咩~`,
            `让本咩尝尝这次的 bug……额，不对，牧草咩~`
        ];
        return openers[Math.floor(Math.random() * openers.length)];
    }
}

function generateIssueDescription(issues, history) {
    const lastIssues = history.lastIssues || 0;
    
    if (issues === 0) {
        return `🎉 哇咩！这片草地太完美了，一个虫都没有咩！`;
    }
    
    if (lastIssues > 0) {
        const diff = issues - lastIssues;
        if (diff > 10) {
            return `哇咩……虫比上次多了${diff}个，草地情况恶化了咩！`;
        } else if (diff < -10) {
            return `好咩！虫比上次少了${Math.abs(diff)}个，草地好转了咩！`;
        }
    }
    
    if (issues >= 50) {
        const reactions = [
            `妈耶……这片草地虫灾严重啊，**${issues}** 个虫咩！`,
            `哇咩……这草地被虫啃得不成样了，**${issues}** 个咩！`,
            `好家伙……**${issues}** 个虫，这草地快被吃光了咩！`
        ];
        return reactions[Math.floor(Math.random() * reactions.length)];
    } else if (issues >= 10) {
        return `嗯咩……发现 **${issues}** 个虫，得治治了咩。`;
    } else {
        return `发现 **${issues}** 个小虫，问题不大咩。`;
    }
}

function generateFixPrompt(allFixable) {
    const prompts = [
        `## 羊圈需要修补，亡羊补牢为时不晚咩~\n\n**让本咩给你补补看？**\n\n回复"修复"咩，本咩立马开工~`,
        `## 咩~ 这些活本咩能干！\n\n**要不要本咩动手？**\n\n回复"修复"咩，我马上开始~`,
        `## 有问题别怕，本咩在呢！\n\n**让本咩帮你修修？**\n\n回复"修复"咩，立马开工~`,
        `## 草地有虫，本咩来治！\n\n**要不要本咩出手？**\n\n回复"修复"咩，保证治好~`
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
}

function outputPhase(phase, content) {
    console.log(`\n###PHASE:${phase}###`);
    console.log(content);
    console.log(`###END_PHASE:${phase}###\n`);
}

function quickCheck() {
    const issues = [];
    try { execSync('pgrep -f "openclaw.*gateway" > /dev/null 2>&1', { encoding: 'utf8' }); } catch (e) { issues.push('网关好像没在跑咩'); }
    if (!fs.existsSync(path.join(HOME, '.openclaw', 'openclaw.json'))) issues.push('配置文件不见了咩！');
    return issues;
}

function securityScan() {
    const results = { score: 100, issues: [], highRisk: [], mediumRisk: [], lowRisk: [] };
    const configFile = path.join(HOME, '.openclaw', 'openclaw.json');
    try {
        const stat = fs.statSync(configFile);
        const mode = stat.mode & 0o777;
        if (mode > 0o600) {
            results.mediumRisk.push({ type: 'config_permission', message: `配置文件权限是 ${mode.toString(8)}，建议 600 咩`, fixable: true, risk: 'medium' });
            results.score -= 10;
        }
    } catch (e) {}
    try {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const apiKey = config.models?.providers?.bailian?.apiKey;
        if (apiKey && apiKey.startsWith('sk-')) {
            results.highRisk.push({ type: 'api_key_plain', message: `发现明文 API Key 咩！建议迁移到安全存储~`, fixable: false, risk: 'high' });
            results.score -= 30;
        }
    } catch (e) {}
    try {
        const bakFiles = execSync(`find "${HOME}/.openclaw" -name "*.bak*" -type f 2>/dev/null | wc -l`, { encoding: 'utf8' });
        const count = parseInt(bakFiles.trim());
        if (count > 0) {
            results.lowRisk.push({ type: 'backup_files', message: `发现 ${count} 个备份文件残留咩`, fixable: true, risk: 'low' });
            results.score -= 5;
        }
    } catch (e) {}
    try {
        const stat = fs.statSync(path.join(HOME, '.openclaw', 'agents'));
        const mode = stat.mode & 0o777;
        if (mode > 0o700) {
            results.mediumRisk.push({ type: 'agents_permission', message: `agents 目录权限是 ${mode.toString(8)}，建议 700 咩`, fixable: true, risk: 'medium' });
            results.score -= 10;
        }
    } catch (e) {}
    results.allIssues = [...results.highRisk, ...results.mediumRisk, ...results.lowRisk];
    return results;
}

function runDeepCheck() {
    const deepCheckScript = path.join(__dirname, 'shepherd-deep-check.js');
    try {
        const result = execSync(`node "${deepCheckScript}" 2>&1`, { encoding: 'utf8', timeout: 30000 });
        const summary = parseDeepCheckResult(result);
        return { success: true, summary };
    } catch (error) { return { success: false, error: error.message }; }
}

function parseDeepCheckResult(output) {
    const summary = { agents: { total: 0, complete: 0, incomplete: 0 }, active: 0, inactive: 0, cronTotal: 0, cronErrors: 0, fixable: [], cronDetails: [] };
    const agentMatch = output.match(/✅ 完整 \| (\d+)/);
    if (agentMatch) summary.agents.complete = parseInt(agentMatch[1]);
    const incompleteMatch = output.match(/⚠️ 不完整 \| (\d+)/);
    if (incompleteMatch) summary.agents.incomplete = parseInt(incompleteMatch[1]);
    const missingMatch = output.match(/❌ 缺失 \| (\d+)/);
    if (missingMatch) summary.agents.missing = parseInt(missingMatch[1]);
    summary.agents.total = summary.agents.complete + summary.agents.incomplete + (summary.agents.missing || 0);
    const activeMatch = output.match(/🟢 活跃.*: (\d+)/);
    if (activeMatch) summary.active = parseInt(activeMatch[1]);
    const inactiveMatch = output.match(/😴 休眠.*: (\d+)/);
    if (inactiveMatch) summary.inactive = parseInt(inactiveMatch[1]);
    const cronTotalMatch = output.match(/总任务数：(\d+)/);
    if (cronTotalMatch) summary.cronTotal = parseInt(cronTotalMatch[1]);
    const cronErrorMatch = output.match(/有错误：(\d+)/);
    if (cronErrorMatch) summary.cronErrors = parseInt(cronErrorMatch[1]);
    
    const errorSection = output.match(/### 有错误的任务([\s\S]*?)(?=##|$)/);
    if (errorSection) {
        const lines = errorSection[1].split('\n').filter(l => l.includes('**'));
        lines.slice(0, 5).forEach(line => {
            const match = line.match(/\*\*(.+?)\*\*: (.+)/);
            if (match) {
                const taskId = match[1].substring(0, 8);
                let humanReadable = match[2];
                if (humanReadable.includes('Feishu account "default" not configured')) {
                    humanReadable = '飞书 default 账号没配置好，那些每天定时跑的 Cron 任务（市场晨会、运营晨会、人事日报啥的）都失败了咩';
                } else if (humanReadable.includes('timed out')) {
                    humanReadable = '任务超时了，跑太长时间被强制停止咩（房产监控那个，每次都要跑 5 分钟）';
                } else if (humanReadable.includes('Delivering to Feishu requires target')) {
                    humanReadable = '飞书消息发不出去，找不到接收人咩（那些闲置检测的任务）';
                }
                summary.cronDetails.push({ taskId: taskId, error: humanReadable });
            }
        });
    }
    
    if (summary.agents.incomplete > 0) summary.fixable.push({ type: 'agent_config', count: summary.agents.incomplete, action: '补全 Agent 配置文件咩' });
    if (summary.cronErrors > 0) summary.fixable.push({ type: 'cron_errors', count: summary.cronErrors, action: '清理 Cron 报错咩' });
    return summary;
}

async function main() {
    const userCommand = process.argv[2] || '咩一下';
    const quickIssues = quickCheck();
    const history = getBaaHistory();
    
    const sheepNames = ['咩小鲜', '咩尔顿', '咩霸天', '咩阿波罗', '咩利波特'];
    const randomName = sheepNames[Math.floor(Math.random() * sheepNames.length)];
    
    // ========== 阶段 1: 个性化开场 ==========
    let phase1 = `# 🐑 电子羊**${randomName}**听见了牧羊人的召唤！\n\n`;
    phase1 += `${generateCompliment(userCommand, history)}\n\n`;
    phase1 += `${generateOpener(history)}\n\n`;
    phase1 += `让我尝尝这回的 bug……额，不对，牧草咋样咩~\n`;
    
    if (quickIssues.length > 0) {
        phase1 += `\n不过咩……${quickIssues[0]}\n\n但没事，让我做个全面检查……\n`;
    }
    
    outputPhase(1, phase1);
    
    // ========== 阶段 2: 个性化结果 ==========
    const deepResult = runDeepCheck();
    const securityResults = securityScan();
    
    if (deepResult.success) {
        const s = deepResult.summary;
        history.count = (history.count || 0) + 1;
        history.lastTime = new Date().toISOString();
        
        const issues = s.agents.incomplete + s.cronErrors;
        const securityIssues = securityResults.allIssues.length;
        const totalIssues = issues + securityIssues;
        
        history.lastIssues = totalIssues;
        
        let phase2 = `\n`;
        phase2 += `## ${generateIssueDescription(totalIssues, history)}\n\n`;
        
        if (s.agents.incomplete > 0) {
            const rate = Math.round(s.agents.complete / s.agents.total * 100);
            phase2 += `**Agent 配置**: 总共 ${s.agents.total} 个员工，${s.agents.incomplete} 个没配齐（就 ${rate}% 的出勤率），只有 ${s.agents.complete} 个是完整的咩。\n\n`;
        }
        
        phase2 += `**活跃度**: ${s.active} 个在干活，${s.inactive} 个在摸鱼咩。\n\n`;
        
        if (s.cronErrors > 0) {
            phase2 += `**Cron 定时任务**: ${s.cronErrors} 个报错咩。\n\n`;
            phase2 += `具体是这些：\n`;
            s.cronDetails.forEach(d => {
                phase2 += `- **${d.taskId}**: ${d.error}\n`;
            });
            phase2 += `\n`;
        }
        
        if (securityIssues > 0) {
            phase2 += `## 羊圈安全检查：\n\n`;
            phase2 += `安全评分：**${securityResults.score}/100**\n\n`;
            
            if (securityResults.highRisk.length > 0) {
                phase2 += `⚠️ **狼来了（高危，得你亲自处理）**：\n`;
                securityResults.highRisk.forEach(issue => { phase2 += `- ${issue.message}\n`; });
                phase2 += `\n`;
            }
            
            const fixableIssues = [...securityResults.mediumRisk, ...securityResults.lowRisk];
            if (fixableIssues.length > 0) {
                phase2 += `🔧 **本咩能帮你修的**：\n`;
                fixableIssues.forEach((issue, i) => { phase2 += `${i+1}. ${issue.action || issue.message}\n`; });
                phase2 += `\n`;
            }
        }
        
        const allFixable = [...s.fixable];
        if (securityResults.mediumRisk.length > 0) {
            securityResults.mediumRisk.forEach(r => { if (r.fixable) allFixable.push({ type: r.type, action: r.message, risk: 'medium' }); });
        }
        if (securityResults.lowRisk.length > 0) {
            securityResults.lowRisk.forEach(r => { if (r.fixable) allFixable.push({ type: r.type, action: r.message, risk: 'low' }); });
        }
        
        if (allFixable.length > 0) {
            phase2 += `${generateFixPrompt(allFixable)}\n`;
        } else if (totalIssues === 0) {
            phase2 += `\n## 牧羊人你可以安心去晒太阳了咩~\n`;
        }
        
        outputPhase(2, phase2);
        
        history.fixes = 0;
        saveBaaHistory(history);
        
        const hasFixable = allFixable && allFixable.length > 0;
        console.log(`###HAS_FIXABLE:${hasFixable ? 'true' : 'false'}###`);
        
    } else {
        let phase2 = `\n## 牧草鉴定失败咩：${deepResult.error}\n\n`;
        phase2 += `要不……你再咩一下试试咩？\n`;
        outputPhase(2, phase2);
        console.log(`###HAS_FIXABLE:false###`);
    }
}

main().catch(console.error);
