// Electronic Sheep Global Configuration Manager v2.7.1
// Manages default settings for all agents and new agent auto-configuration

class GlobalConfigManager {
  constructor() {
    this.config = {
      memory: {
        defaultProvider: 'electronic-sheep-v2.7',
        autoDeploy: true,
        inheritSettings: true,
        deploymentScope: 'global-default' // current-session | all-existing | global-default
      },
      language: {
        default: 'system',
        autoDetect: true,
        fallback: 'en-US'
      },
      features: {
        smartForgetting: true,
        multiLanguage: true,
        autoBackup: true,
        heatAlgorithm: true
      }
    };
    this.agentConfigs = new Map();
  }

  // Get global default configuration
  getGlobalConfig() {
    return { ...this.config };
  }

  // Set deployment scope
  setDeploymentScope(scope) {
    if (['current-session', 'all-existing', 'global-default'].includes(scope)) {
      this.config.memory.deploymentScope = scope;
      return true;
    }
    return false;
  }

  // Apply configuration to specific agent
  applyToAgent(agentId, configOverride = {}) {
    const agentConfig = {
      ...this.getGlobalConfig(),
      ...configOverride
    };
    this.agentConfigs.set(agentId, agentConfig);
    return agentConfig;
  }

  // Get configuration for new agent
  getConfigForNewAgent(agentId, systemLanguage = 'en-US') {
    const baseConfig = this.getGlobalConfig();
    
    // Auto-detect language if needed
    if (baseConfig.language.default === 'system') {
      baseConfig.language.current = systemLanguage;
    }
    
    return this.applyToAgent(agentId, baseConfig);
  }

  // Check if agent should use electronic sheep
  shouldUseElectronicSheep(agentId) {
    const agentConfig = this.agentConfigs.get(agentId);
    if (agentConfig) {
      return agentConfig.memory.defaultProvider === 'electronic-sheep-v2.7';
    }
    
    // Default to global setting
    return this.config.memory.autoDeploy && 
           this.config.memory.deploymentScope !== 'current-session';
  }
}

module.exports = GlobalConfigManager;