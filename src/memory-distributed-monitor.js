#!/usr/bin/env node
/**
 * 电子羊记忆系统 - 分布式互相监控
 * 
 * 每个 Agent 监控 2-3 个其他 Agent
 * 发现空闲时触发整理
 * 避免同时触发（负载均衡）
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const meta = require('./memory-meta');

// 全局状态
let isCleaningUp = false;
let concurrentCleanups = 0;
const MAX_CONCURRENT = 3;  // 最多同时 3 个 Agent 整理

/**
 * 检查是否可以触发整理
 */
function canTriggerCleanup() {
    // 已经有太多在整理 → 暂停
    if (concurrentCleanups >= MAX_CONCURRENT) {
        return false;
    }
    
    // 系统负载高 → 暂停
    const load = getSystemLoad();
    if (load > 50) {
        return false;
    }
    
    return true;
}

/**
 * 获取系统负载
 */
function getSystemLoad() {
    try {
        const loadavg = require('os').loadavg();
        const cpuCount = require('os').cpus().length;
        const load = (loadavg[0] / cpuCount) * 100;
        return Math.min(100, load);
    } catch (e) {
        return 0;
    }
}

/**
 * 监控目标 Agent
 */
function monitorTargets(agentId) {
    const targets = meta.getMonitoringTargets(agentId);
    
    if (!targets || targets.length === 0) {
        // 还没有监控关系 → 建立
        meta.establishMonitoringRelations(agentId);
        return;
    }
    
    const now = Date.now();
    
    targets.forEach(target => {
        // 检查目标是否需要整理
        const targetMeta = meta.getMeta(target);
        const minutesSince = (now - targetMeta.lastWrite) / (1000 * 60);
        const threshold = meta.getCleanupThreshold(target);
        
        if (minutesSince >= threshold) {
            // 需要整理 → 检查是否可以触发
            if (canTriggerCleanup()) {
                console.log(`🐑 ${agentId} 发现 ${target} 需要整理（${Math.floor(minutesSince)}分钟 > ${threshold}分钟）`);
                triggerCleanup(target, agentId);
            } else {
                console.log(`⏸️ ${agentId} 发现 ${target} 需要整理，但系统忙，加入队列`);
                queueCleanup(target);
            }
        }
    });
}

/**
 * 触发整理
 */
function triggerCleanup(agentId, triggeredBy) {
    if (isCleaningUp) {
        console.log(`⏸️ ${agentId} 整理正在进行，跳过`);
        return;
    }
    
    isCleaningUp = true;
    concurrentCleanups++;
    
    console.log(`🧹 ${triggeredBy} 触发 ${agentId} 整理记忆...`);
    
    try {
        // 执行整理
        execSync(`node "${path.join(SCRIPT_DIR, 'shepherd-memory-idle.js')}" ${agentId} full`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        // 记录整理完成
        meta.onCleanupComplete(agentId, {
            garbageRatio: 30,  // 假设值，实际应该从整理结果获取
            timestamp: Date.now()
        });
        
        console.log(`✅ ${agentId} 整理完成`);
    } catch (e) {
        console.error(`❌ ${agentId} 整理失败：${e.message}`);
    } finally {
        concurrentCleanups--;
        isCleaningUp = false;
    }
}

/**
 * 队列整理（稍后触发）
 */
function queueCleanup(agentId) {
    // 5 分钟后重试
    setTimeout(() => {
        if (canTriggerCleanup()) {
            triggerCleanup(agentId, 'queue');
        } else {
            console.log(`⏸️ ${agentId} 队列整理仍然系统忙，放弃`);
        }
    }, 5 * 60 * 1000);
}

/**
 * 启动监控循环
 */
function startMonitoring(agentId) {
    console.log(`🐑 ${agentId} 启动分布式监控...`);
    
    // 建立监控关系
    const targets = meta.establishMonitoringRelations(agentId);
    console.log(`📋 ${agentId} 监控目标：${targets.join(', ')}`);
    
    // 每分钟检查一次
    setInterval(() => {
        monitorTargets(agentId);
    }, 60000);
}

/**
 * 主函数
 */
async function main() {
    const agentId = process.argv[2] || 'main';
    
    console.log(`🐑 电子羊分布式监控 - ${agentId}\n`);
    
    // 启动监控
    startMonitoring(agentId);
    
    // 保持进程运行
    process.on('SIGINT', () => {
        console.log(`\n🐑 ${agentId} 停止监控`);
        process.exit(0);
    });
}

main().catch(console.error);
