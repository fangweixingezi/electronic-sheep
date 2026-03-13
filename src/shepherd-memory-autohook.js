#!/usr/bin/env node
/**
 * 电子羊记忆系统 - 自动触发钩子
 * 
 * 用法：在 Agent 会话结束时调用
 * node shepherd-memory-autohook.js <agentId>
 * 
 * 功能：
 * 1. 检测 Agent 是否进入空闲状态
 * 2. 如果空闲，触发记忆整理
 * 3. 不空闲则跳过
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const SCRIPT_DIR = __dirname;

/**
 * 检测 Agent 是否空闲
 */
function isAgentIdle(agentId, idleThresholdMinutes = 5) {
    try {
        const sessionsDir = path.join(HOME, '.openclaw', 'agents', agentId, 'sessions');
        if (!fs.existsSync(sessionsDir)) {
            return true;
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
 * 主函数
 */
async function main() {
    const agentId = process.argv[2];
    
    if (!agentId) {
        console.log('用法：node shepherd-memory-autohook.js <agentId>\n');
        console.log('说明：在 Agent 会话结束时自动调用此脚本\n');
        process.exit(1);
    }
    
    console.log(`🐑 电子羊记忆自动触发 - ${agentId}\n`);
    
    // 检测是否空闲
    console.log('1️⃣ 检测空闲状态...\n');
    const idle = isAgentIdle(agentId);
    console.log(`空闲状态：${idle ? '✅ 是' : '❌ 否'}\n`);
    
    if (!idle) {
        console.log('⏸️ Agent 仍在活跃，跳过记忆整理\n');
        return;
    }
    
    // 触发记忆整理
    console.log('2️⃣ 触发记忆整理...\n');
    try {
        execSync(`node "${path.join(SCRIPT_DIR, 'shepherd-memory-idle.js')}" ${agentId} full`, {
            encoding: 'utf8',
            stdio: 'inherit'
        });
        console.log('✅ 记忆整理完成\n');
    } catch (e) {
        console.log(`❌ 记忆整理失败：${e.message}\n`);
    }
}

main().catch(console.error);
