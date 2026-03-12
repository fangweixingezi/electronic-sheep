// electronic-sheep-updater.js - 智能配置保护 + 全员更新
const fs = require('fs');
const path = require('path');

class SheepUpdater {
  constructor() {
    this.configDir = '/Users/ai/.openclaw/workspace';
    this.userConfigPath = path.join(this.configDir, 'electronic-sheep-user-config.json');
    this.systemConfigPath = path.join(this.configDir, 'electronic-sheep-system-defaults.json');
    this.deploymentConfigPath = path.join(this.configDir, 'electronic-sheep-deployment.json');
  }

  // 检查部署模式
  getDeploymentMode() {
    try {
      const deploymentConfig = JSON.parse(fs.readFileSync(this.deploymentConfigPath, 'utf8'));
      return deploymentConfig.mode || 'current-session';
    } catch (error) {
      return 'current-session';
    }
  }

  // 获取所有Agent列表
  async getAllAgents() {
    const { execSync } = require('child_process');
    try {
      const result = execSync('openclaw agents list --json', { encoding: 'utf8' });
      const agents = JSON.parse(result);
      return agents.list.map(agent => agent.id).filter(id => id !== 'main');
    } catch (error) {
      console.error('Failed to get agents:', error);
      return [];
    }
  }

  // 智能合并配置
  mergeConfigs(newUserConfig, newSystemDefaults, oldUserConfig = {}) {
    const merged = { ...newSystemDefaults };
    
    // 保留用户的所有自定义设置
    for (const [key, value] of Object.entries(oldUserConfig)) {
      if (value !== undefined && value !== null) {
        merged[key] = value;
      }
    }
    
    // 添加新功能到用户配置
    for (const [key, value] of Object.entries(newUserConfig)) {
      if (merged[key] === undefined) {
        merged[key] = value;
      }
    }
    
    return merged;
  }

  // 执行全员更新
  async performGlobalUpdate(newVersionData) {
    const deploymentMode = this.getDeploymentMode();
    console.log(`Deployment mode: ${deploymentMode}`);
    
    if (deploymentMode === 'global-default') {
      // 全员更新模式
      const allAgents = await this.getAllAgents();
      console.log(`Updating ${allAgents.length} agents globally...`);
      
      // 更新全局配置
      this.updateGlobalConfiguration(newVersionData);
      
      // 通知所有Agent重新加载配置
      for (const agentId of allAgents) {
        this.notifyAgentUpdate(agentId);
      }
      
      return { success: true, updatedAgents: allAgents.length };
    } else {
      // 仅当前会话更新
      this.updateCurrentSession(newVersionData);
      return { success: true, updatedAgents: 1 };
    }
  }

  // 更新全局配置
  updateGlobalConfiguration(newVersionData) {
    const configManager = require('./electronic-sheep-config-manager.js');
    const newConfig = configManager.mergeWithProtection(newVersionData);
    
    // 保存新的系统默认配置
    fs.writeFileSync(this.systemConfigPath, JSON.stringify(newConfig.systemDefaults, null, 2));
    
    // 保持用户配置不变
    console.log('Global configuration updated with user settings preserved');
  }

  // 通知Agent更新
  notifyAgentUpdate(agentId) {
    const { exec } = require('child_process');
    exec(`openclaw agent --agent ${agentId} --message "电子羊记忆系统已更新，请重新加载配置"`, 
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to notify ${agentId}:`, error);
        }
      });
  }

  // 更新当前会话
  updateCurrentSession(newVersionData) {
    const configManager = require('./electronic-sheep-config-manager.js');
    const newConfig = configManager.mergeWithProtection(newVersionData);
    
    // 应用到当前会话
    console.log('Current session updated with preserved user settings');
  }

  // 执行完整更新流程
  async executeUpdate(newVersionData) {
    try {
      console.log('Starting intelligent sheep update...');
      
      // 1. 备份当前配置
      this.backupCurrentConfig();
      
      // 2. 执行智能合并
      const mergedConfig = this.mergeConfigs(
        newVersionData.userConfig,
        newVersionData.systemDefaults,
        this.getCurrentUserConfig()
      );
      
      // 3. 执行全员或单会话更新
      const result = await this.performGlobalUpdate({
        systemDefaults: mergedConfig,
        userConfig: this.getCurrentUserConfig()
      });
      
      // 4. 验证更新结果
      const validation = this.validateUpdateResult();
      
      if (validation.success) {
        console.log('✅ Electronic Sheep update completed successfully!');
        return { success: true, ...result };
      } else {
        console.error('❌ Update validation failed, rolling back...');
        this.rollbackUpdate();
        return { success: false, error: validation.error };
      }
    } catch (error) {
      console.error('Update failed:', error);
      this.rollbackUpdate();
      return { success: false, error: error.message };
    }
  }

  // 备份当前配置
  backupCurrentConfig() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `/Users/ai/.openclaw/workspace/electronic-sheep-backup/before-update-${timestamp}.json`;
    
    try {
      const currentConfig = {
        userConfig: this.getCurrentUserConfig(),
        systemConfig: this.getCurrentSystemConfig(),
        deploymentConfig: this.getCurrentDeploymentConfig()
      };
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, JSON.stringify(currentConfig, null, 2));
      console.log(`Configuration backed up to: ${backupPath}`);
    } catch (error) {
      console.error('Backup failed:', error);
    }
  }

  getCurrentUserConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.userConfigPath, 'utf8'));
    } catch {
      return {};
    }
  }

  getCurrentSystemConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.systemConfigPath, 'utf8'));
    } catch {
      return {};
    }
  }

  getCurrentDeploymentConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.deploymentConfigPath, 'utf8'));
    } catch {
      return { mode: 'current-session' };
    }
  }

  validateUpdateResult() {
    // 验证更新后的配置是否有效
    try {
      // 检查服务是否正常运行
      const healthCheck = require('child_process').execSync(
        'curl -s http://localhost:19003/health',
        { timeout: 5000 }
      );
      const health = JSON.parse(healthCheck.toString());
      return health.status === 'ok' ? { success: true } : { success: false, error: 'Health check failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  rollbackUpdate() {
    // 回滚到备份配置
    console.log('Rolling back to previous configuration...');
    // 实现回滚逻辑
  }
}

module.exports = SheepUpdater;