// Electronic Sheep Version Manager
// Supports 3 recent versions + 1 major version rollback

class VersionManager {
  constructor() {
    this.versionsDir = '/Users/ai/.openclaw/workspace/electronic-sheep-versions';
    this.currentVersion = 'v2.7.1';
    this.majorVersion = 'v2.0.0'; // Last major stable version
    this.maxRecentVersions = 3;
  }

  async saveCurrentVersion() {
    const versionPath = `${this.versionsDir}/${this.currentVersion}`;
    await this.ensureDir(versionPath);
    
    // Backup current files
    const files = ['electronic-sheep-mcp-server.js', 'electronic-sheep-config-wizard.js', 
                   'electronic-sheep-language-detector.js', 'electronic-sheep-global-config.js'];
    
    for (const file of files) {
      const src = `/Users/ai/.openclaw/workspace/${file}`;
      const dest = `${versionPath}/${file}`;
      if (require('fs').existsSync(src)) {
        require('fs').copyFileSync(src, dest);
      }
    }
    
    // Save version metadata
    const metadata = {
      version: this.currentVersion,
      timestamp: new Date().toISOString(),
      backupFiles: files
    };
    require('fs').writeFileSync(`${versionPath}/metadata.json`, JSON.stringify(metadata, null, 2));
  }

  async getAvailableVersions() {
    const versions = [];
    if (require('fs').existsSync(this.versionsDir)) {
      const dirs = require('fs').readdirSync(this.versionsDir);
      for (const dir of dirs) {
        if (require('fs').existsSync(`${this.versionsDir}/${dir}/metadata.json`)) {
          const meta = JSON.parse(require('fs').readFileSync(`${this.versionsDir}/${dir}/metadata.json`, 'utf8'));
          versions.push(meta);
        }
      }
    }
    return versions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async rollbackToVersion(targetVersion) {
    const versionPath = `${this.versionsDir}/${targetVersion}`;
    if (!require('fs').existsSync(versionPath)) {
      throw new Error(`Version ${targetVersion} not found in backup`);
    }
    
    const metadata = JSON.parse(require('fs').readFileSync(`${versionPath}/metadata.json`, 'utf8'));
    
    // Restore files
    for (const file of metadata.backupFiles) {
      const src = `${versionPath}/${file}`;
      const dest = `/Users/ai/.openclaw/workspace/${file}`;
      if (require('fs').existsSync(src)) {
        require('fs').copyFileSync(src, dest);
      }
    }
    
    // Update current version
    this.currentVersion = targetVersion;
    return { success: true, version: targetVersion, timestamp: new Date().toISOString() };
  }

  async ensureDir(dir) {
    if (!require('fs').existsSync(dir)) {
      require('fs').mkdirSync(dir, { recursive: true });
    }
  }

  async cleanupOldVersions() {
    const versions = await this.getAvailableVersions();
    if (versions.length > this.maxRecentVersions) {
      // Keep only the most recent versions + major version
      const toKeep = versions.slice(0, this.maxRecentVersions);
      const majorVersion = versions.find(v => v.version === this.majorVersion);
      if (majorVersion && !toKeep.includes(majorVersion)) {
        toKeep.push(majorVersion);
      }
      
      // Remove old versions
      for (const version of versions) {
        if (!toKeep.includes(version)) {
          const versionPath = `${this.versionsDir}/${version.version}`;
          require('fs').rmSync(versionPath, { recursive: true, force: true });
        }
      }
    }
  }
}

module.exports = VersionManager;