# 🛡️ 电子羊安全机制 / Electronic Sheep Security

## 🐕 牧羊犬 v2.2 完全体安全功能

### 1. 命令包装 / Command Wrapping
```bash
~/.openclaw/safe-gateway.sh "gateway restart"
~/.openclaw/safe-command.sh config patch ...
```

### 2. 敏感数据扫描 / Sensitive Data Scan
```bash
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-scan
```

### 3. 配置审计 / Config Audit
```bash
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-audit
```

### 4. Cron 监控 / Cron Monitor
```bash
~/.openclaw/agents/main/skills/electronic-sheep/src/handler.sh shepherd-monitor
```

## 自动防护

安装电子羊技能后，所有安全功能自动启用！
