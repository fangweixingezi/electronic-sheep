class ElectronicSheepConfigManager {
  constructor() {
    this.configDir = '/Users/ai/.openclaw/workspace/electronic-sheep-config/';
    this.systemDefaultsFile = `${this.configDir}system-defaults.json`;
    this.userOverridesFile = `${this.configDir}user-overrides.json`;
    this.versionInfoFile = `${this.configDir}version-info.json`;
    this.agentDeploymentsFile = `${this.configDir}agent-deployments.json`;
    
    // 确保配置目录存在
    require('fs').mkdirSync(this.configDir, { recursive: true });
  }

  // 读取当前配置
  getCurrentConfig() {
    const fs = require('fs');
    const systemDefaults = fs.existsSync(this.systemDefaultsFile) ? 
      JSON.parse(fs.readFileSync(this.systemDefaultsFile, 'utf8')) : {};
    const userOverrides = fs.existsSync(this.userOverridesFile) ? 
      JSON.parse(fs.readFileSync(this.userOverridesFile, 'utf8')) : {};
    
    return { systemDefaults, userOverrides };
  }

  // 智能合并配置
  mergeConfigs(newSystemDefaults, currentUserOverrides) {
    const merged = { ...newSystemDefaults };
    
    // 保留所有用户自定义设置
    for (const [key, value] of Object.entries(currentUserOverrides)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // 对象类型：深度合并
        merged[key] = { ...merged[key], ...value };
      } else {
        // 基本类型：直接保留用户值
        merged[key] = value;
      }
    }
    
    return merged;
  }

  // 备份用户配置
  backupUserConfig(version) {
    const fs = require('fs');
    const backupFile = `${this.configDir}user-overrides-backup-${version}.json`;
    if (fs.existsSync(this.userOverridesFile)) {
      fs.copyFileSync(this.userOverridesFile, backupFile);
    }
  }

  // 获取部署范围
  getDeploymentScope() {
    const fs = require('fs');
    if (fs.existsSync(this.agentDeploymentsFile)) {
      const deployments = JSON.parse(fs.readFileSync(this.agentDeploymentsFile, 'utf8'));
      return deployments.scope || 'current-session';
    }
    return 'current-session';
  }

  // 获取所有已部署的Agent列表
  getDeployedAgents() {
    const fs = require('fs');
    if (fs.existsSync(this.agentDeploymentsFile)) {
      const deployments = JSON.parse(fs.readFileSync(this.agentDeploymentsFile, 'utf8'));
      return deployments.agents || [];
    }
    return [];
  }

  // 更新部署信息
  updateDeploymentInfo(scope, agentList, version) {
    const fs = require('fs');
    const deploymentInfo = {
      scope,
      agents: agentList,
      lastUpdated: new Date().toISOString(),
      currentVersion: version
    };
    fs.writeFileSync(this.agentDeploymentsFile, JSON.stringify(deploymentInfo, null, 2));
  }

  // 验证配置有效性
  validateConfig(config) {
    // 基本验证逻辑
    return config.memory && config.language;
  }
}

module.exports = ElectronicSheepConfigManager;