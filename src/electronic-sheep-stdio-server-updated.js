#!/usr/bin/env node
/**
 * Electronic Sheep v2.7.1 - MCP Stdio Server + 分布式监控
 * 
 * 通过 stdin/stdout 通信，无需网络端口
 * 新增：分布式互相监控功能
 */

const fs = require('fs');
const path = require('path');
const meta = require('./memory-meta');

// 内存存储目录
const MEMORY_DIR = path.join(process.env.HOME || '/Users/ai', '.openclaw', 'memory');
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
                        version: '2.7.1-distributed'
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
                            name: 'memory_update_write_time',
                            description: '更新记忆写入时间（用于分布式监控）',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    agentId: { type: 'string', description: 'Agent ID' }
                                },
                                required: ['agentId']
                            }
                        }
                    ]
                }
            };
            
        case 'tools/call':
            const { name, arguments: args } = params;
            
            if (name === 'memory_update_write_time') {
                meta.updateLastWrite(args.agentId);
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [{
                            type: 'text',
                            text: `✅ ${args.agentId} 记忆写入时间已更新`
                        }]
                    }
                };
            }
            
            // 其他工具处理...
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
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
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
    
    // 启动分布式监控（后台运行）
    const agentId = process.argv[2] || 'main';
    console.error(`🐑 Electronic Sheep v2.7.1-distributed 启动中...`);
    console.error(`📡 ${agentId} 启动分布式监控...`);
    
    // 延迟启动监控（等待服务器初始化）
    setTimeout(() => {
        const monitor = require('./memory-distributed-monitor');
        monitor.startMonitoring(agentId);
    }, 5000);
    
    console.error('🐑 Electronic Sheep v2.7.1-distributed 已就绪');
}

// 启动服务
main();
