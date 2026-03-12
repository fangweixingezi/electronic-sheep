// Electronic Sheep Multi-Language Configuration Wizard
const LanguageDetector = require('./electronic-sheep-language-detector');

class ConfigWizard {
  constructor() {
    this.languageDetector = new LanguageDetector();
    this.supportedLanguages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'es-ES', 'de-DE'];
    
    // Multi-language message templates
    this.templates = {
      'zh-CN': {
        title: '🐑 电子羊记忆系统配置向导',
        intro: '检测到你已安装电子羊v2.7记忆优化系统！请配置你的偏好：',
        options: {
          memorySystem: {
            title: '1. 记忆系统选择',
            choices: ['启用电子羊智能记忆（推荐）', '保持默认OpenClaw记忆']
          },
          forgetting: {
            title: '2. 遗忘机制设置', 
            choices: ['启用智能遗忘（自动清理低热度记忆）', '要用遗忘（保留所有记忆）']
          },
          layering: {
            title: '3. 记忆分层策略',
            choices: ['严格分层（7天/90天/永久）', '宽松分层（14天/180天/永久）', '自定义分层']
          },
          backup: {
            title: '4. 备份频率',
            choices: ['每2小时自动备份', '每日备份', '手动备份']
          },
          language: {
            title: '5. 交互语言设置',
            choices: ['跟随系统语言（当前: {currentLang}）', '切换到其他语言', '启用多语言模式']
          }
        },
        defaultReply: '请选择你的配置，或回复"默认"使用推荐设置。',
        languageSelection: '请选择交互语言：{languages}',
        multilingualMode: '已启用多语言模式。所有消息将同时显示在以下语言中：{selectedLanguages}'
      },
      'en-US': {
        title: '🐑 Electronic Sheep Memory Configuration Wizard',
        intro: 'Detected Electronic Sheep v2.7 memory optimization system! Please configure your preferences:',
        options: {
          memorySystem: {
            title: '1. Memory System Selection',
            choices: ['Enable Electronic Sheep Smart Memory (recommended)', 'Keep Default OpenClaw Memory']
          },
          forgetting: {
            title: '2. Forgetting Mechanism',
            choices: ['Enable Smart Forgetting (auto-clean low-heat memories)', 'Disable Forgetting (keep all memories)']
          },
          layering: {
            title: '3. Memory Layering Strategy',
            choices: ['Strict Layering (7d/90d/permanent)', 'Loose Layering (14d/180d/permanent)', 'Custom Layering']
          },
          backup: {
            title: '4. Backup Frequency',
            choices: ['Auto backup every 2 hours', 'Daily backup', 'Manual backup']
          },
          language: {
            title: '5. Interaction Language Settings',
            choices: ['Follow system language (current: {currentLang})', 'Switch to other language', 'Enable multilingual mode']
          }
        },
        defaultReply: 'Please select your configuration, or reply "default" for recommended settings.',
        languageSelection: 'Please select interaction language: {languages}',
        multilingualMode: 'Multilingual mode enabled. All messages will be displayed in the following languages: {selectedLanguages}'
      }
      // Additional languages can be added here
    };
  }

  async detectUserLanguage(context) {
    return await this.languageDetector.detect(context);
  }

  generateConfigMessage(userLanguage, currentLang, availableLanguages) {
    const template = this.templates[userLanguage] || this.templates['en-US'];
    
    // Format language selection options
    const langChoices = availableLanguages.map(lang => 
      `${this.getLanguageName(lang)} (${lang})`
    ).join(', ');
    
    return {
      title: template.title,
      intro: template.intro,
      options: {
        memorySystem: template.options.memorySystem,
        forgetting: template.options.forgetting,
        layering: template.options.layering,
        backup: template.options.backup,
        language: {
          title: template.options.language.title,
          choices: [
            template.options.language.choices[0].replace('{currentLang}', currentLang),
            template.options.language.choices[1],
            template.options.language.choices[2]
          ]
        }
      },
      defaultReply: template.defaultReply,
      languageSelection: template.languageSelection.replace('{languages}', langChoices)
    };
  }

  getLanguageName(langCode) {
    const names = {
      'zh-CN': '中文',
      'en-US': 'English',
      'ja-JP': '日本語',
      'ko-KR': '한국어', 
      'fr-FR': 'Français',
      'es-ES': 'Español',
      'de-DE': 'Deutsch'
    };
    return names[langCode] || langCode;
  }

  async handleLanguageSelection(selectedLang, context) {
    // Update user's language preference
    await this.saveUserLanguagePreference(context.userId, selectedLang);
    
    // Return confirmation message in selected language
    const template = this.templates[selectedLang] || this.templates['en-US'];
    return template.languageConfirmation || `Language set to ${selectedLang}`;
  }
}

module.exports = ConfigWizard;