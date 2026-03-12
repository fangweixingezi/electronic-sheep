// 电子羊多语言检测和管理模块
class LanguageManager {
  constructor() {
    this.supportedLanguages = {
      'zh-CN': '简体中文',
      'en-US': 'English', 
      'ja-JP': '日本語',
      'ko-KR': '한국어',
      'fr-FR': 'Français',
      'es-ES': 'Español',
      'de-DE': 'Deutsch'
    };
    
    this.userPreferences = new Map(); // userId -> language settings
  }
  
  // 检测用户语言（按优先级）
  detectUserLanguage(userId, context) {
    // 1. 用户显式设置
    if (this.userPreferences.has(userId)) {
      return this.userPreferences.get(userId);
    }
    
    // 2. 从上下文检测（浏览器/系统）
    if (context.navigatorLanguage) {
      const lang = this.normalizeLanguage(context.navigatorLanguage);
      if (this.supportedLanguages[lang]) return lang;
    }
    
    // 3. 系统环境变量
    if (process.env.LANG) {
      const lang = this.normalizeLanguage(process.env.LANG);
      if (this.supportedLanguages[lang]) return lang;
    }
    
    // 4. 默认
    return 'en-US';
  }
  
  normalizeLanguage(lang) {
    // 处理各种语言格式：zh-CN, zh_CN, zh, Chinese等
    lang = lang.toLowerCase();
    if (lang.startsWith('zh')) return 'zh-CN';
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('ja') || lang.startsWith('jp')) return 'ja-JP';
    if (lang.startsWith('ko') || lang.startsWith('kr')) return 'ko-KR';
    if (lang.startsWith('fr')) return 'fr-FR';
    if (lang.startsWith('es') || lang.startsWith('sp')) return 'es-ES';
    if (lang.startsWith('de') || lang.startsWith('ge')) return 'de-DE';
    return lang;
  }
  
  // 设置用户语言偏好
  setUserLanguage(userId, language, multiLanguage = false) {
    if (multiLanguage) {
      // 多语言模式：存储数组
      this.userPreferences.set(userId, { languages: language, multi: true });
    } else {
      // 单语言模式
      this.userPreferences.set(userId, { primary: language, multi: false });
    }
  }
  
  // 获取本地化消息
  getLocalizedMessage(messageKey, userId, context) {
    const userLang = this.detectUserLanguage(userId, context);
    const messages = this.getMessageTemplates(messageKey);
    return messages[userLang] || messages['en-US'];
  }
  
  getMessageTemplates(key) {
    const templates = {
      'welcome': {
        'zh-CN': '🐑 欢迎使用电子羊记忆系统！',
        'en-US': '🐑 Welcome to Electronic Sheep Memory System!',
        'ja-JP': '🐑 電子羊メモリシステムへようこそ！',
        'ko-KR': '🐑 전자양 메모리 시스템에 오신 것을 환영합니다!',
        'fr-FR': '🐑 Bienvenue dans le système de mémoire Electronic Sheep !',
        'es-ES': '🐑 ¡Bienvenido al sistema de memoria Electronic Sheep!',
        'de-DE': '🐑 Willkommen im Electronic Sheep Speichersystem!'
      },
      'config_wizard': {
        'zh-CN': '🐑 电子羊记忆系统配置向导',
        'en-US': '🐑 Electronic Sheep Memory Configuration Wizard',
        'ja-JP': '🐑 電子羊メモリ設定ウィザード',
        'ko-KR': '🐑 전자양 메모리 설정 마법사',
        'fr-FR': '🐑 Assistant de configuration de la mémoire Electronic Sheep',
        'es-ES': '🐑 Asistente de configuración de memoria Electronic Sheep',
        'de-DE': '🐑 Electronic Sheep Speicherkonfigurations-Assistent'
      }
      // ... 更多消息模板
    };
    return templates[key] || {};
  }
}

module.exports = new LanguageManager();