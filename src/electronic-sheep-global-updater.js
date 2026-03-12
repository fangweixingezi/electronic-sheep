// electronic-sheep-global-updater.js
// 全员更新管理器 - 确保所有Agent同步更新

class GlobalUpdater {
  constructor() {
    this.deploymentMode = this.getDeploymentMode(); // current-session | all-existing | global-default
  }

  getDeploymentMode() {
    try {
      const config = JSON.parse(fs.readFileSync('/Users/ai/.openclaw/workspace/electronic-sheep-global-default.json'));
      return config.deploymentMode || 'current-session';
    } catch (error) {
      return 'current-session';
    }
  }

  async updateAllAgents(newVersion) {
    if (this.deploymentMode === 'current-session') {
      console.log('仅当前会话模式，跳过全员更新');
      return;
    }

    // 获取所有活跃的Agent列表
    const agents = await this.getAllActiveAgents();
    
    console.log(`检测到部署模式: ${this.deploymentMode}`);
    console.log(`准备为 ${agents.length} 个Agent 更新电子羊到 v${newVersion}`);

    // 并行更新所有Agent的配置
    const updatePromises = agents.map(agent => 
      this.updateAgentConfig(agent, newVersion)
    );

    await Promise.all(updatePromises);
    console.log('✅ 所有Agent已成功更新电子羊配置');
  }

  async getAllActiveAgents() {
    // 从OpenClaw获取所有活跃Agent
    const result = await execCommand('openclaw agents list --json');
    const agents = JSON.parse(result).agents;
    
    // 过滤出活跃的Agent（排除系统Agent）
    return agents.filter(agent => 
      !['main', 'cron'].includes(agent.id) && 
      agent.workspace === '/Users/ai/.openclaw/workspace'
    );
  }

  async updateAgentConfig(agent, newVersion) {
    // 为指定Agent更新电子羊配置
    const agentConfigPath = `/Users/ai/.openclaw/agents/${agent.id}/agent/electronic-sheep-config.json`;
    
    // 读取Agent的用户配置
    let userConfig = {};
    try {
      userConfig = JSON.parse(fs.readFileSync(agentConfigPath));
    } catch (error) {
      // 如果没有用户配置，创建空配置
      userConfig = { userId: agent.id, overrides: {} };
    }

    // 获取新的系统默认配置
    const systemDefaults = this.getSystemDefaults(newVersion);
    
    // 智能合并配置
    const mergedConfig = this.mergeConfigs(userConfig.overrides, systemDefaults);
    
    // 保存更新后的配置
    fs.writeFileSync(agentConfigPath, JSON.stringify({
      ...userConfig,
      version: newVersion,
      lastUpdated: new Date().toISOString(),
      config: mergedConfig
    }, null, 2));

    console.log(`✅ Agent ${agent.id} 已更新到电子羊 v${newVersion}`);
  }

  mergeConfigs(userOverrides, systemDefaults) {
    // 深度合并，保留用户设置，添加新功能
    const result = { ...systemDefaults };
    
    // 递归合并用户覆盖的配置
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          // 只有当用户没有设置时才使用新默认值
          if (!(key in target)) {
            target[key] = source[key];
          }
        }
      }
    }

    deepMerge(result, userOverrides);
    return result;
  }

  getSystemDefaults(version) {
    // 返回指定版本的系统默认配置
    return {
      memory: {
        provider: 'electronic-sheep-v2.7',
        layers: {
          shortTerm: { days: 7 },
          longTerm: { minDays: 7, maxDays: 90 },
          discard: { minDays: 90, protectDays: 30 }
        },
        heatAlgorithm: {
          accessFrequency: 0.4,
          freshness: 0.3,
          relevance: 0.2,
          userRating: 0.1
        }
      },
      language: {
        default: 'system',
        autoDetect: true,
        supported: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'es-ES', 'de-DE']
      },
      backup: {
        frequency: '2h',
        enabled: true
      },
      version: version
    };
  }
}

module.exports = GlobalUpdater;