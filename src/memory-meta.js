#!/usr/bin/env node
/**
 * 电子羊记忆系统 - 元数据管理
 * 
 * 为每个 Agent 的记忆文件提供元数据管理
 * 支持分布式互相监控
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '/Users/ai';
const MEMORY_DIR = path.join(HOME, '.openclaw', 'memory');
const META_DIR = path.join(MEMORY_DIR, '.meta');

// 确保元数据目录存在
if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true });
}

/**
 * 获取 Agent 的元数据
 */
function getMeta(agentId) {
    const metaFile = path.join(META_DIR, `${agentId}.json`);
    
    if (!fs.existsSync(metaFile)) {
        // 创建默认元数据
        const defaultMeta = {
            agentId: agentId,
            createdAt: Date.now(),
            lastWrite: Date.now(),
            lastCleanup: 0,
            healthScore: 50,  // 初始健康度 50
            cleanupPriority: 'P1',  // 默认优先级
            monitoredBy: [],  // 被谁监控
            monitoring: [],   // 监控谁
            cleanupHistory: []  // 整理历史
        };
        
        fs.writeFileSync(metaFile, JSON.stringify(defaultMeta, null, 2));
        return defaultMeta;
    }
    
    return JSON.parse(fs.readFileSync(metaFile, 'utf8'));
}

/**
 * 保存元数据
 */
function saveMeta(agentId, meta) {
    const metaFile = path.join(META_DIR, `${agentId}.json`);
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
}

/**
 * 更新最后写入时间
 */
function updateLastWrite(agentId) {
    const meta = getMeta(agentId);
    meta.lastWrite = Date.now();
    saveMeta(agentId, meta);
}

/**
 * 更新健康度
 */
function updateHealth(agentId, garbageRatio) {
    const meta = getMeta(agentId);
    
    // 垃圾多 → 健康度下降
    // 垃圾少 → 健康度上升
    const delta = 50 - garbageRatio;
    meta.healthScore = Math.max(0, Math.min(100, meta.healthScore + delta));
    
    // 记录整理历史
    meta.cleanupHistory.push({
        timestamp: Date.now(),
        garbageRatio: garbageRatio,
        healthScore: meta.healthScore
    });
    
    // 保留最近 10 次记录
    if (meta.cleanupHistory.length > 10) {
        meta.cleanupHistory = meta.cleanupHistory.slice(-10);
    }
    
    // 根据健康度调整优先级
    if (meta.healthScore > 90) {
        meta.cleanupPriority = 'P3';  // 低优先级
    } else if (meta.healthScore > 70) {
        meta.cleanupPriority = 'P2';  // 中优先级
    } else if (meta.healthScore > 30) {
        meta.cleanupPriority = 'P1';  // 正常优先级
    } else {
        meta.cleanupPriority = 'P0';  // 高优先级
    }
    
    saveMeta(agentId, meta);
    return meta.healthScore;
}

/**
 * 建立监控关系
 */
function establishMonitoringRelations(agentId) {
    const meta = getMeta(agentId);
    const allAgents = getAllAgents();
    
    // 过滤掉自己
    const others = allAgents.filter(a => a !== agentId);
    
    // 随机选择 2-3 个监控目标
    const shuffled = others.sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
    
    meta.monitoring = targets;
    
    // 告知对方"我在监控你"
    targets.forEach(target => {
        const targetMeta = getMeta(target);
        if (!targetMeta.monitoredBy.includes(agentId)) {
            targetMeta.monitoredBy.push(agentId);
            saveMeta(target, targetMeta);
        }
    });
    
    saveMeta(agentId, meta);
    return meta.monitoring;
}

/**
 * 获取所有 Agent
 */
function getAllAgents() {
    if (!fs.existsSync(MEMORY_DIR)) {
        return [];
    }
    
    return fs.readdirSync(MEMORY_DIR)
        .filter(f => f.endsWith('.sqlite'))
        .map(f => f.replace('.sqlite', ''));
}

/**
 * 获取监控我的 Agent
 */
function getMonitors(agentId) {
    const meta = getMeta(agentId);
    return meta.monitoredBy || [];
}

/**
 * 获取我监控的 Agent
 */
function getMonitoringTargets(agentId) {
    const meta = getMeta(agentId);
    return meta.monitoring || [];
}

/**
 * 获取整理阈值（根据健康度动态调整）
 */
function getCleanupThreshold(agentId) {
    const meta = getMeta(agentId);
    const health = meta.healthScore || 50;
    
    // 健康度高 → 阈值高（减少触发）
    // 健康度低 → 阈值低（积极触发）
    if (health > 90) return 120;  // 2 小时
    if (health > 70) return 60;   // 1 小时
    if (health > 30) return 30;   // 30 分钟
    return 15;  // 15 分钟
}

/**
 * 记录整理完成
 */
function onCleanupComplete(agentId, result) {
    const meta = getMeta(agentId);
    meta.lastCleanup = Date.now();
    
    // 更新健康度
    updateHealth(agentId, result.garbageRatio);
    
    saveMeta(agentId, meta);
}

/**
 * 获取需要整理的 Agent 列表
 */
function getAgentsNeedingCleanup() {
    const allAgents = getAllAgents();
    const now = Date.now();
    
    return allAgents.filter(agentId => {
        const meta = getMeta(agentId);
        const minutesSince = (now - meta.lastWrite) / (1000 * 60);
        const threshold = getCleanupThreshold(agentId);
        
        return minutesSince >= threshold;
    }).sort((a, b) => {
        // 按优先级排序
        const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };
        const metaA = getMeta(a);
        const metaB = getMeta(b);
        return priorityOrder[metaA.cleanupPriority] - priorityOrder[metaB.cleanupPriority];
    });
}

// 导出函数
module.exports = {
    getMeta,
    saveMeta,
    updateLastWrite,
    updateHealth,
    establishMonitoringRelations,
    getAllAgents,
    getMonitors,
    getMonitoringTargets,
    getCleanupThreshold,
    onCleanupComplete,
    getAgentsNeedingCleanup
};
