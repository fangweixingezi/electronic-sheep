// Electronic Sheep MCP Server with Global Agent Configuration
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 19003;

app.use(cors());
app.use(bodyParser.json());

// Load global configuration
let globalConfig = {};
try {
  const configPath = path.join(__dirname, 'electronic-sheep-global-config.json');
  if (fs.existsSync(configPath)) {
    globalConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (error) {
  console.log('No global config found, using defaults');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '2.7.1',
    features: ['qmd-mcporter', 'multi-language', 'global-deployment']
  });
});

// Memory query endpoint
app.post('/memory/query', (req, res) => {
  // Implementation for memory queries
  res.json({ results: [], provider: 'electronic-sheep-v2.7' });
});

// Agent creation webhook
app.post('/agent/created', (req, res) => {
  const { agentId, language } = req.body;
  
  // Apply global configuration to new agent
  const agentConfig = {
    memory: globalConfig.memory || { backend: 'qmd' },
    language: language || globalConfig.language || 'system'
  };
  
  console.log(`Applied global config to new agent: ${agentId}`);
  res.json({ success: true, config: agentConfig });
});

// Configuration update endpoint
app.post('/config/update', (req, res) => {
  const { config } = req.body;
  globalConfig = { ...globalConfig, ...config };
  
  // Save to file
  fs.writeFileSync(
    path.join(__dirname, 'electronic-sheep-global-config.json'),
    JSON.stringify(globalConfig, null, 2)
  );
  
  res.json({ success: true, message: 'Global configuration updated' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Electronic Sheep MCP Server v2.7.1 running on port ${PORT}`);
  console.log('Features: QMD+MCPorter, Multi-language, Global Deployment');
});