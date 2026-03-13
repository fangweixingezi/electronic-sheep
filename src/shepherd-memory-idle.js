#!/usr/bin/env node
/**
 * 电子羊记忆系统 - 闲时自动整理
 * 
 * 功能：
 * 1. 检测 Agent 空闲状态
 * 2. 空闲时自动备份显意识
 * 3. 深度睡眠时整理记忆
 * 4. 档案整理子代理
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const BAA_LOG_DIR = path.join(HOME, '.openclaw', '.baa-logs');
const MEMORY_DIR = path.join(HOME, '.openclaw', 'memory');

/**
 * 检测 Agent 是否空闲
 */
function isAgentIdle(agentId, idleThresholdMinutes = 5) {
    try {
        const sessionsDir = path.join(HOME, '.openclaw', 'agents', agentId, 'sessions');
        if (!fs.existsSync(sessionsDir)) {
            return false;
        }
        
        const sessions = fs.readdirSync(sessionsDir)
            .filter(f => f.endsWith('.jsonl'))
            .map(f => {
                const stat = fs.statSync(path.join(sessionsDir, f));
                return { file: f, mtime: stat.mtimeMs };
            });
        
        if (sessions.length === 0) {
            return true;
        }
        
        const latest = sessions.sort((a, b) => b.mtime - a.mtime)[0];
        const minutesSince = (Date.now() - latest.mtime) / (1000 * 60);
        
        return minutesSince >= idleThresholdMinutes;
    } catch (e) {
        return false;
    }
}

/**
 * 备份显意识到意识引导区
 */
function backupConsciousToGuide(agentId) {
    try {
        const consciousFile = path.join(HOME, '.openclaw', 'agents', agentId, 'conscious.md');
        const guideDir = path.join(HOME, '.openclaw', 'agents', agentId, 'subconscious', 'conscious-guide');
        
        if (!fs.existsSync(consciousFile)) {
            return { success: false, message: '显意识文件不存在' };
        }
        
        // 确保目录存在
        if (!fs.existsSync(guideDir)) {
            fs.mkdirSync(guideDir, { recursive: true });
        }
        
        // 备份
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(guideDir, `conscious-backup-${timestamp}.md`);
        fs.copyFileSync(consciousFile, backupFile);
        
        return { success: true, file: backupFile };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

/**
 * 整理档案记忆
 */
function organizeArchiveMemory(agentId) {
    try {
        const archiveDir = path.join(MEMORY_DIR, `${agentId}-archive`);
        if (!fs.existsSync(archiveDir)) {
            return { success: true, message: '档案目录不存在，无需整理' };
        }
        
        // 生成档案摘要
        const summaryFile = path.join(archiveDir, 'summary.md');
        const files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.md'));
        
        let summary = `# ${agentId} 档案记忆摘要\n\n`;
        summary += `**整理时间**: ${new Date().toISOString()}\n\n`;
        summary += `## 档案列表\n\n`;
        summary += `共 ${files.length} 个档案\n\n`;
        
        fs.writeFileSync(summaryFile, summary);
        
        return { success: true, count: files.length };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

/**
 * 主函数
 */
async function main() {
    const agentId = process.argv[2] || 'main';
    const action = process.argv[3] || 'check';
    
    console.log(`🐑 电子羊记忆整理 - ${agentId}\n`);
    
    switch (action) {
        case 'check':
            // 检查是否空闲
            const isIdle = isAgentIdle(agentId);
            console.log(`Agent ${agentId} 空闲状态：${isIdle ? '✅ 空闲' : '❌ 忙碌'}\n`);
            
            if (isIdle) {
                // 空闲时备份显意识
                console.log('⏳ 开始备份显意识...\n');
                const result = backupConsciousToGuide(agentId);
                console.log(`备份结果：${result.success ? '✅ 成功' : '❌ 失败'}\n`);
                if (result.file) {
                    console.log(`备份文件：${result.file}\n`);
                }
            }
            break;
            
        case 'organize':
            // 整理档案
            console.log('⏳ 开始整理档案记忆...\n');
            const result = organizeArchiveMemory(agentId);
            console.log(`整理结果：${result.success ? '✅ 成功' : '❌ 失败'}\n`);
            if (result.count !== undefined) {
                console.log(`档案数量：${result.count}\n`);
            }
            break;
            
        case 'full':
            // 完整整理流程
            console.log('⏳ 开始完整整理流程...\n');
            
            const isIdle2 = isAgentIdle(agentId);
            console.log(`1. 空闲检查：${isIdle2 ? '✅ 空闲' : '❌ 忙碌'}\n`);
            
            if (isIdle2) {
                const backupResult = backupConsciousToGuide(agentId);
                console.log(`2. 显意识备份：${backupResult.success ? '✅ 成功' : '❌ 失败'}\n`);
                
                const archiveResult = organizeArchiveMemory(agentId);
                console.log(`3. 档案整理：${archiveResult.success ? '✅ 成功' : '❌ 失败'}\n`);
            } else {
                console.log('⏸️ Agent 忙碌，跳过整理\n');
            }
            break;
            
        default:
            console.log('用法：node shepherd-memory-idle.js [agentId] [check|organize|full]\n');
    }
}

main().catch(console.error);
