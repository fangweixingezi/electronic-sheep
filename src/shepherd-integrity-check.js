#!/usr/bin/env node
/**
 * 咩一下 - 完整性检查
 * 检测电子羊 skill 是否有更新或篡改
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/ai';
const ELECTRONIC_SHEEP_DIR = path.join(HOME, '.openclaw', 'workspace', 'electronic-sheep');
const INTEGRITY_FILE = path.join(ELECTRONIC_SHEEP_DIR, '.integrity-check.json');

/**
 * 获取当前文件哈希
 */
function getFileHash(filePath) {
    try {
        const result = execSync(`md5 -q "${filePath}" 2>/dev/null`, { encoding: 'utf8' });
        return result.trim();
    } catch (e) {
        return null;
    }
}

/**
 * 获取 Git 当前版本
 */
function getGitVersion() {
    try {
        const result = execSync('git rev-parse --short HEAD 2>/dev/null', { 
            encoding: 'utf8',
            cwd: ELECTRONIC_SHEEP_DIR
        });
        return result.trim();
    } catch (e) {
        return null;
    }
}

/**
 * 检查是否有未提交的更改
 */
function hasUncommittedChanges() {
    try {
        const result = execSync('git status --porcelain 2>/dev/null', { 
            encoding: 'utf8',
            cwd: ELECTRONIC_SHEEP_DIR
        });
        return result.trim().length > 0;
    } catch (e) {
        return false;
    }
}

/**
 * 获取远程最新版本
 */
function getRemoteVersion() {
    try {
        execSync('git fetch origin 2>/dev/null', { 
            encoding: 'utf8',
            cwd: ELECTRONIC_SHEEP_DIR
        });
        const result = execSync('git rev-parse --short origin/main 2>/dev/null', { 
            encoding: 'utf8',
            cwd: ELECTRONIC_SHEEP_DIR
        });
        return result.trim();
    } catch (e) {
        return null;
    }
}

/**
 * 检查核心文件完整性
 */
function checkCoreFiles() {
    const coreFiles = [
        'src/shepherd-baa-check.js',
        'src/shepherd-baa-fix.js',
        'src/shepherd-natural.js',
        'src/handler.sh'
    ];
    
    const result = {
        version: getGitVersion(),
        remoteVersion: getRemoteVersion(),
        hasUpdates: false,
        hasChanges: hasUncommittedChanges(),
        files: {}
    };
    
    result.hasUpdates = result.version !== result.remoteVersion && result.remoteVersion !== null;
    
    coreFiles.forEach(file => {
        const filePath = path.join(ELECTRONIC_SHEEP_DIR, file);
        if (fs.existsSync(filePath)) {
            result.files[file] = {
                exists: true,
                hash: getFileHash(filePath)
            };
        } else {
            result.files[file] = {
                exists: false,
                hash: null
            };
        }
    });
    
    return result;
}

/**
 * 保存检查结果
 */
function saveResult(result) {
    fs.writeFileSync(INTEGRITY_FILE, JSON.stringify({
        timestamp: new Date().toISOString(),
        ...result
    }, null, 2));
}

/**
 * 主函数
 */
async function main() {
    const result = checkCoreFiles();
    saveResult(result);
    
    // 返回结果给调用者
    console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
