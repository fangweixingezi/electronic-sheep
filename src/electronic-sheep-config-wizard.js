// Enhanced Electronic Sheep Configuration Wizard with Global Deployment Options
const CONFIG_OPTIONS = {
  deployment: {
    'current-session': '仅当前会话',
    'all-existing': '全员部署（所有现有Agent）', 
    'global-default': '全局默认（现有+新Agent自动启用）'
  },
  memory: {
    'electronic-sheep-v2.7': '电子羊智能记忆系统（推荐）',
    'builtin': 'OpenClaw默认记忆系统'
  },
  forgetting: {
    'enabled': '启用智能遗忘',
    'disabled': '禁用遗忘（保留所有记忆）'
  },
  layers: {
    'strict': '严格分层（7天/90天/永久）',
    'loose': '宽松分层（14天/180天/永久）',
    'custom': '自定义分层'
  },
  backup: {
    '2h': '每2小时自动备份',
    'daily': '每日备份', 
    'manual': '手动备份'
  }
};

class ElectronicSheepConfigWizard {
  constructor() {
    this.globalConfig = {
      memoryProvider: 'electronic-sheep-v2.7',
      autoDeploy: true,
      inheritSettings: true,
      language: 'system',
      autoDetectLanguage: true
    };
  }

  async showDeploymentOptions(userLang) {
    const messages = {
      'zh-CN': `🐑 **电子羊记忆系统部署向导**

检测到电子羊v2.7.1已安装，选择部署范围：

🔘 **仅当前会话** - 只为当前用户启用
🔘 **全员部署** - 为所有现有Agent启用（推荐）
🔘 **全局默认** - 为所有现有+新Agent自动启用`,
      
      'en-US': `🐑 **Electronic Sheep Memory Deployment Wizard**

Detected Electronic Sheep v2.7.1 installed, choose deployment scope:

🔘 **Current Session Only** - Enable for current user only  
🔘 **All Existing Agents** - Enable for all existing agents (recommended)
🔘 **Global Default** - Enable for all existing + new agents automatically`
    };
    
    return messages[userLang] || messages['en-US'];
  }

  async applyGlobalDeployment(deploymentType) {
    switch(deploymentType) {
      case 'all-existing':
        await this.deployToAllExistingAgents();
        break;
      case 'global-default':
        await this.setGlobalDefault();
        await this.deployToAllExistingAgents();
        break;
      case 'current-session':
        // Already handled by current session
        break;
    }
  }

  async deployToAllExistingAgents() {
    // Get all agent IDs from OpenClaw config
    const agents = await this.getAllAgentIds();
    for (const agentId of agents) {
      await this.applyMemoryConfig(agentId);
    }
    return `✅ 已为 ${agents.length} 个Agent启用电子羊记忆系统`;
  }

  async setGlobalDefault() {
    // Set global configuration that new agents will inherit
    this.globalConfig.autoDeploy = true;
    this.globalConfig.inheritSettings = true;
    await this.saveGlobalConfig();
    return '✅ 全局默认配置已设置，新Agent将自动启用电子羊记忆系统';
  }

  async getAllAgentIds() {
    // Read from openclaw.json agents list
    const config = require('/Users/ai/.openclaw/openclaw.json');
    return config.agents.list.map(agent => agent.id);
  }

  async applyMemoryConfig(agentId) {
    // Apply memory configuration to specific agent
    // This will be handled through the QMD+MCPorter global system
    console.log(`Applying electronic sheep memory config to agent: ${agentId}`);
  }

  async saveGlobalConfig() {
    // Save global configuration for new agent inheritance
    const fs = require('fs');
    fs.writeFileSync('/Users/ai/.openclaw/workspace/electronic-sheep-global-config.json', 
                    JSON.stringify(this.globalConfig, null, 2));
  }
}

module.exports = ElectronicSheepConfigWizard;