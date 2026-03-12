#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 每日23:00执行自动检查
async function checkForUpdates() {
    try {
        console.log('🐑 电子羊自动更新检查 - 开始');
        
        // 检查GitHub最新版本
        const latestVersion = await getLatestVersionFromGitHub();
        const currentVersion = getCurrentVersion();
        
        if (compareVersions(latestVersion, currentVersion) > 0) {
            console.log(`🆕 发现新版本: ${latestVersion} (当前: ${currentVersion})`);
            
            // 发送更新提示到主会话
            await sendUpdateNotification(latestVersion, currentVersion);
        } else {
            console.log('✅ 当前已是最新版本');
        }
        
        console.log('🐑 电子羊自动更新检查 - 完成');
    } catch (error) {
        console.error('❌ 自动更新检查失败:', error.message);
    }
}

// 获取GitHub最新版本
async function getLatestVersionFromGitHub() {
    // 实际实现会调用GitHub API
    return 'v2.7.2'; // 模拟最新版本
}

// 获取当前版本
function getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'package.json'), 'utf8'
    ));
    return packageJson.version;
}

// 版本比较
function compareVersions(v1, v2) {
    const parts1 = v1.replace('v', '').split('.').map(Number);
    const parts2 = v2.replace('v', '').split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

// 发送更新通知
async function sendUpdateNotification(latestVersion, currentVersion) {
    const message = `🐑 **电子羊系统更新可用**\n\n` +
                   `🆕 新版本: ${latestVersion}\n` +
                   `📦 当前版本: ${currentVersion}\n\n` +
                   `💡 **无感更新特性**:\n` +
                   `- 零停机时间\n` +
                   `- 自动备份当前配置\n` +
                   `- 支持一键回滚\n\n` +
                   `🔧 回复以下命令进行操作:\n` +
                   `- \`/sheep update\` - 立即更新\n` +
                   `- \`/sheep versions\` - 查看可用版本\n` +
                   `- \`/sheep rollback\` - 回滚到上一版本`;
    
    // 发送到主会话
    console.log('发送更新通知:', message);
}

// 如果直接运行此脚本
if (require.main === module) {
    checkForUpdates();
}