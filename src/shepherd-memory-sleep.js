#!/usr/bin/env node
/**
 * 电子羊记忆系统 - 深度睡眠整理
 * 
 * 功能：
 * 1. 检测是否需要深度睡眠（嗜睡状态）
 * 2. 深度睡眠时分配子代理整理记忆
 * 3. 生成整理报告提交给主意识
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const MEMORY_DIR = path.join(HOME, '.openclaw', 'memory');
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');

/**
 * 检测记忆系统是否"嗜睡"
 * 标准：记忆文件总大小超过阈值
 */
function isMemorySleepy(thresholdGB = 1) {
    try {
        const files = fs.readdirSync(MEMORY_DIR)
            .filter(f => f.endsWith('.sqlite'))
            .map(f => {
                const stat = fs.statSync(path.join(MEMORY_DIR, f));
                return { file: f, size: stat.size };
            });
        
        const totalSize = files.reduce((sum, f) => sum + f.size, 0);
        const totalGB = totalSize / (1024 * 1024 * 1024);
        
        return {
            isSleepy: totalGB >= thresholdGB,
            totalGB: totalGB.toFixed(2),
            thresholdGB: thresholdGB,
            files: files.length
        };
    } catch (e) {
        return { isSleepy: false, error: e.message };
    }
}

/**
 * 分配子代理整理记忆
 */
function assignSubAgent(agentId, task) {
    try {
        const cmd = `openclaw agent --agent ${agentId} --message "${task}"`;
        execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
        return { success: true, agent: agentId };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 生成整理报告
 */
function generateSleepReport(agentId, results) {
    try {
        const reportDir = path.join(BAA_LOG_DIR, 'sleep-reports');
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(reportDir, `${agentId}-sleep-${timestamp}.md`);
        
        let report = `# ${agentId} 深度睡眠整理报告\n\n`;
        report += `**整理时间**: ${new Date().toISOString()}\n\n`;
        report += `## 整理任务\n\n`;
        
        results.forEach((r, i) => {
            report += `${i+1}. ${r.task}: ${r.success ? '✅ 成功' : '❌ 失败'}\n`;
            if (r.details) {
                report += `   ${r.details}\n`;
            }
        });
        
        report += `\n## 下次整理时间\n\n`;
        report += `建议：${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}\n`;
        
        fs.writeFileSync(reportFile, report);
        
        return { success: true, file: reportFile };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * 主函数
 */
async function main() {
    const agentId = process.argv[2] || 'main';
    
    console.log(`🐑 电子羊深度睡眠整理 - ${agentId}\n`);
    
    // 1. 检查是否"嗜睡"
    console.log('1️⃣ 检查记忆系统状态...\n');
    const sleepyStatus = isMemorySleepy(0.001); // 测试用 1MB 阈值
    
    if (sleepyStatus.error) {
        console.log(`❌ 检查失败：${sleepyStatus.error}\n`);
        return;
    }
    
    console.log(`记忆文件：${sleepyStatus.files} 个\n`);
    console.log(`总大小：${sleepyStatus.totalGB} GB\n`);
    console.log(`嗜睡状态：${sleepyStatus.isSleepy ? '✅ 是' : '❌ 否'}\n`);
    
    if (!sleepyStatus.isSleepy) {
        console.log('💤 记忆系统状态良好，无需深度睡眠整理\n');
        return;
    }
    
    // 2. 分配子代理整理
    console.log('2️⃣ 分配子代理整理记忆...\n');
    
    const tasks = [
        { agent: 'es-dev-1', task: '整理记忆文件结构' },
        { agent: 'es-data-1', task: '分析记忆热度分布' },
        { agent: 'es-ops-1', task: '清理过期记忆' }
    ];
    
    const results = [];
    
    for (const t of tasks) {
        console.log(`   分配 ${t.agent}: ${t.task}...\n`);
        const result = assignSubAgent(t.agent, t.task);
        results.push({
            task: t.task,
            agent: t.agent,
            success: result.success,
            details: result.success ? `已分配给 ${t.agent}` : result.error
        });
    }
    
    // 3. 生成报告
    console.log('\n3️⃣ 生成整理报告...\n');
    const report = generateSleepReport(agentId, results);
    console.log(`报告生成：${report.success ? '✅ 成功' : '❌ 失败'}\n`);
    if (report.file) {
        console.log(`报告文件：${report.file}\n`);
    }
    
    console.log('✅ 深度睡眠整理完成！\n');
}

main().catch(console.error);
