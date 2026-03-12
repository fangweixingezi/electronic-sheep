#!/usr/bin/env node
/**
 * Electronic Sheep v2.7.1 - MCP Stdio Server
 * 
 * 通过 stdin/stdout 通信，无需网络端口
 * 用法：node electronic-sheep-stdio-server.js
 */

const fs = require('fs');
const path = require('path');

// 内存存储目录
const MEMORY_DIR = path.join(process.env.HOME, '.openclaw', 'memory');
const MEMORY_FILE = path.join(MEMORY_DIR, 'MEMORY.md');

// 确保目录存在
if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

// 热度算法权重
const HEAT_WEIGHTS = {
    accessFrequency: 0.4,
    freshness: 0.3,
    relevance: 0.2,
    userRating: 0.1
};

// 内存缓存
let memoryCache = new Map();

/**
 * 计算热度分数
 */
function calculateHeatScore(entry) {
    const now = Date.now();
    const daysSinceAccess = (now - entry.lastAccessed) / (1000 * 60 * 60 * 24);
    const daysSinceCreated = (now - entry.createdAt) / (1000 * 60 * 60 * 24);
    
    const accessFrequencyScore = entry.accessCount / Math.max(daysSinceCreated, 1);
    const freshnessScore = Math.max(0, 1 - (daysSinceCreated / 180));
    const relevanceScore = entry.relevance || 0.5;
    const userRatingScore = entry.userRating || 0.5;
    
    return (
        accessFrequencyScore * HEAT_WEIGHTS.accessFrequency +
        freshnessScore * HEAT_WEIGHTS.freshness +
        relevanceScore * HEAT_WEIGHTS.relevance +
        userRatingScore * HEAT_WEIGHTS.userRating
    );
}

/**
 * 处理 MCP 请求
 */
function handleRequest(request) {
    const { method, params } = request;
    
    switch (method) {
        case 'initialize':
            return {
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        tools: {},
                        resources: {},
                        prompts: {}
                    },
                    serverInfo: {
                        name: 'electronic-sheep',
                        version: '2.7.1'
                    }
                }
            };
            
        case 'tools/list':
            return {
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    tools: [
                        {
                            name: 'memory_search',
                            description: '搜索记忆内容，支持热度排序',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    query: { type: 'string', description: '搜索关键词' },
                                    limit: { type: 'number', description: '返回数量', default: 10 },
                                    minScore: { type: 'number', description: '最小相关度', default: 0.5 }
                                },
                                required: ['query']
                            }
                        },
                        {
                            name: 'memory_store',
                            description: '存储新的记忆条目',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    content: { type: 'string', description: '记忆内容' },
                                    category: { type: 'string', description: '分类标签' },
                                    relevance: { type: 'number', description: '相关度 0-1' }
                                },
                                required: ['content']
                            }
                        },
                        {
                            name: 'memory_forget',
                            description: '根据热度算法遗忘低价值记忆',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    threshold: { type: 'number', description: '热度阈值', default: 0.3 },
                                    dryRun: { type: 'boolean', description: '仅预览不删除', default: false }
                                }
                            }
                        },
                        {
                            name: 'health_check',
                            description: '检查记忆服务健康状态',
                            inputSchema: {
                                type: 'object',
                                properties: {}
                            }
                        }
                    ]
                }
            };
            
        case 'tools/call':
            const { name, arguments: args } = params;
            
            if (name === 'health_check') {
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    status: 'ok',
                                    service: 'electronic-sheep-stdio',
                                    version: '2.7.1',
                                    memoryFile: MEMORY_FILE,
                                    cacheSize: memoryCache.size,
                                    timestamp: new Date().toISOString()
                                }, null, 2)
                            }
                        ]
                    }
                };
            }
            
            if (name === 'memory_search') {
                const { query, limit = 10, minScore = 0.5 } = args || {};
                
                // 简单搜索实现
                const results = [];
                for (let [key, entry] of memoryCache) {
                    if (entry.content.toLowerCase().includes(query.toLowerCase())) {
                        const heatScore = calculateHeatScore(entry);
                        if (heatScore >= minScore) {
                            results.push({
                                id: key,
                                content: entry.content,
                                heatScore: heatScore,
                                lastAccessed: entry.lastAccessed,
                                createdAt: entry.createdAt
                            });
                        }
                    }
                }
                
                // 按热度排序
                results.sort((a, b) => b.heatScore - a.heatScore);
                
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    results: results.slice(0, limit),
                                    total: results.length,
                                    provider: 'electronic-sheep-v2.7.1'
                                }, null, 2)
                            }
                        ]
                    }
                };
            }
            
            if (name === 'memory_store') {
                const { content, category = 'default', relevance = 0.5 } = args || {};
                const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                memoryCache.set(id, {
                    content,
                    category,
                    relevance,
                    accessCount: 0,
                    lastAccessed: Date.now(),
                    createdAt: Date.now(),
                    userRating: 0.5
                });
                
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: true,
                                    id: id,
                                    message: '记忆已存储'
                                }, null, 2)
                            }
                        ]
                    }
                };
            }
            
            if (name === 'memory_forget') {
                const { threshold = 0.3, dryRun = false } = args || {};
                const toForget = [];
                
                for (let [key, entry] of memoryCache) {
                    const heatScore = calculateHeatScore(entry);
                    if (heatScore < threshold) {
                        toForget.push({ id: key, heatScore, content: entry.content.substring(0, 50) });
                    }
                }
                
                if (!dryRun) {
                    toForget.forEach(item => memoryCache.delete(item.id));
                }
                
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    success: true,
                                    dryRun,
                                    forgottenCount: toForget.length,
                                    remainingCount: memoryCache.size,
                                    forgotten: toForget
                                }, null, 2)
                            }
                        ]
                    }
                };
            }
            
            // 未知工具
            return {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: -32601,
                    message: `Unknown tool: ${name}`
                }
            };
            
        default:
            return {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: -32601,
                    message: `Method not found: ${method}`
                }
            };
    }
}

/**
 * 主循环：从 stdin 读取 JSON-RPC 请求，处理后写入 stdout
 */
function main() {
    let buffer = '';
    
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
        buffer += chunk;
        
        // 按行处理（JSON-RPC 消息通常每行一个）
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整行
        
        for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
                const request = JSON.parse(line);
                const response = handleRequest(request);
                process.stdout.write(JSON.stringify(response) + '\n');
            } catch (error) {
                const errorResponse = {
                    jsonrpc: '2.0',
                    id: null,
                    error: {
                        code: -32700,
                        message: 'Parse error',
                        data: error.message
                    }
                };
                process.stdout.write(JSON.stringify(errorResponse) + '\n');
            }
        }
    });
    
    process.stdin.on('end', () => {
        console.error('🐑 Electronic Sheep stdio server: stdin closed, shutting down');
        process.exit(0);
    });
    
    process.stderr.write('🐑 Electronic Sheep v2.7.1 MCP Stdio Server started\n');
}

// 启动服务
main();
