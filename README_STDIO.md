# 电子羊 MCP Stdio 服务 - 使用说明

## 🎉 问题解决

**之前的问题**：
- ❌ 电子羊服务使用硬编码端口（19002/19003/19004）
- ❌ 可能与 OpenClaw 或其他服务端口冲突
- ❌ 飞书回调地址配置复杂

**现在的解决方案**：
- ✅ 使用 MCP stdio 传输协议
- ✅ **零端口** - 通过 stdin/stdout 通信
- ✅ **零冲突** - 不需要网络端口
- ✅ **自动管理** - OpenClaw/mcporter 自动启动/停止服务

---

## 🚀 快速开始

### 1. 服务已配置

mcporter 配置已更新 (`~/.openclaw/mcporter.json`)：

```json
{
  "servers": {
    "electronic-sheep-memory": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/ai/.openclaw/workspace/electronic-sheep/src/electronic-sheep-stdio-server.js"],
      "timeoutMs": 30000
    }
  }
}
```

### 2. 使用 mcporter 调用

```bash
# 检查服务状态
mcporter call electronic-sheep-memory.health_check

# 搜索记忆
mcporter call electronic-sheep-memory.memory_search query="电子羊" limit=5

# 存储记忆
mcporter call electronic-sheep-memory.memory_store content="测试记忆" category="test"
```

### 3. 在 OpenClaw 中使用

电子羊记忆服务现在作为 MCP 工具集成到 OpenClaw：

```
/记忆搜索 电子羊
```

---

## 📋 可用工具

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `health_check` | 检查服务健康状态 | 无 |
| `memory_search` | 搜索记忆 | query, limit, minScore |
| `memory_store` | 存储记忆 | content, category, relevance |
| `memory_forget` | 遗忘低价值记忆 | threshold, dryRun |

---

## 🔧 手动测试

### 测试健康检查
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"health_check","arguments":{}}}' | \
  node /Users/ai/.openclaw/workspace/electronic-sheep/src/electronic-sheep-stdio-server.js 2>/dev/null | jq .
```

### 测试记忆搜索
```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"memory_search","arguments":{"query":"电子羊","limit":5}}}' | \
  node /Users/ai/.openclaw/workspace/electronic-sheep/src/electronic-sheep-stdio-server.js 2>/dev/null | jq .
```

---

## 🎯 优势对比

| 特性 | 之前 (HTTP) | 现在 (Stdio) |
|------|------------|-------------|
| 端口占用 | 3 个 (19002/3/4) | 0 个 ✅ |
| 端口冲突风险 | 有 | 无 ✅ |
| 启动方式 | 手动/独立进程 | 自动 (按需启动) ✅ |
| 资源占用 | 常驻内存 | 按需加载 ✅ |
| 配置复杂度 | 需要配置 URL | 自动发现 ✅ |
| 飞书回调 | 需要公网地址 | 不需要 ✅ |

---

## 🐛 故障排查

### 问题 1：服务无法启动
```bash
# 检查 Node.js 版本
node --version

# 手动测试服务
node /Users/ai/.openclaw/workspace/electronic-sheep/src/electronic-sheep-stdio-server.js
```

### 问题 2：mcporter 找不到服务
```bash
# 检查配置
cat ~/.openclaw/mcporter.json

# 重新加载配置
mcporter config list
```

### 问题 3：权限问题
```bash
# 确保脚本可执行
chmod +x /Users/ai/.openclaw/workspace/electronic-sheep/src/electronic-sheep-stdio-server.js
```

---

## 📝 技术细节

### MCP 协议版本
- Protocol: `2024-11-05`
- Transport: `stdio`
- Encoding: `JSON-RPC 2.0`

### 内存存储
- 位置：`~/.openclaw/memory/MEMORY.md`
- 缓存：进程内 Map（重启后清空）
- 热度算法：访问频率 40% + 新鲜度 30% + 相关度 20% + 用户评分 10%

### 自动清理
- 服务在 stdin 关闭后自动退出
- 无残留进程
- 无端口占用

---

## 🎓 参考资料

- [MCP Protocol Spec](https://modelcontextprotocol.io/specification)
- [mcporter Documentation](http://mcporter.dev)
- [OpenClaw MCP Integration](https://docs.openclaw.ai)

---

_电子羊 v2.7.1 - 零端口记忆服务_ 🐑
