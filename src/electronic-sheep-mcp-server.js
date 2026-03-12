#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 导入新模块
const ConfigManager = require('./electronic-sheep-config-manager');
const GlobalUpdater = require('./electronic-sheep-global-updater');

const app = express();
const PORT = 19003;

app.use(cors());
app.use(bodyParser.json());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    service: "electronic-sheep-memory",
    version: "2.7.1",
    timestamp: new Date().toISOString()
  });
});

// MCP工具端点 - 记忆搜索
app.post('/mcp/tools/memory_search', async (req, res) => {
  try {
    const { query, minScore = 0.5, maxResults = 5 } = req.body;
    
    // 这里集成实际的记忆搜索逻辑
    // 返回模拟结果
    res.json({
      results: [
        {
          content: "电子羊v2.7.1记忆系统已启用，支持QMD+MCPorter模式",
          score: 0.95,
          path: "MEMORY.md"
        }
      ],
      provider: "qmd",
      model: "qmd"
    });
  } catch (error) {
    console.error('Memory search error:', error);
    res.status(500).json({ error: 'Memory search failed' });
  }
});

// MCP工具端点 - 配置管理
app.post('/mcp/tools/config_manage', async (req, res) => {
  try {
    const { action, config } = req.body;
    const configManager = new ConfigManager();
    
    let result;
    switch (action) {
      case 'merge':
        result = await configManager.mergeConfigs(config.userConfig, config.systemDefaults, config.versionChanges);
        break;
      case 'backup':
        result = await configManager.backupUserConfig();
        break;
      case 'validate':
        result = await configManager.validateMergeResult(config.mergedConfig);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Config management error:', error);
    res.status(500).json({ error: 'Config management failed' });
  }
});

// MCP工具端点 - 全员更新
app.post('/mcp/tools/global_update', async (req, res) => {
  try {
    const { action, targetAgents, newVersion } = req.body;
    const globalUpdater = new GlobalUpdater();
    
    let result;
    switch (action) {
      case 'check':
        result = await globalUpdater.checkGlobalUpdateStatus();
        break;
      case 'deploy':
        result = await globalUpdater.deployToAllAgents(targetAgents, newVersion);
        break;
      case 'rollback':
        result = await globalUpdater.rollbackGlobalUpdate(newVersion);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Global update error:', error);
    res.status(500).json({ error: 'Global update failed' });
  }
});

// 启动服务器
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Electronic Sheep MCP Server v2.7.1 running on port ${PORT}`);
  console.log('Features: QMD+MCPorter, Multi-language, Global Deployment, Smart Config Protection');
});