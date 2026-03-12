# 🛡️ 通用保密等级系统 / Universal Confidentiality System

## 📋 保密等级模型

### L0 - 公开 (Public)
- **访问权限**: 任何人
- **适用场景**: 开源代码、公共文档、用户手册
- **默认等级**: 所有新内容的初始等级

### L1 - 内部 (Internal)
- **访问权限**: 组织内部成员  
- **适用场景**: 公司内部文档、团队协作内容
- **要求**: 需要身份验证

### L2 - 机密 (Confidential)
- **访问权限**: 授权用户
- **适用场景**: 敏感业务数据、技术细节
- **要求**: 明确权限分配

### L3 - 高度机密 (Highly Confidential)  
- **访问权限**: 特定角色/部门
- **适用场景**: 核心商业机密、安全机制
- **要求**: 多重身份验证

### L4 - 绝密 (Top Secret)
- **访问权限**: 最小权限原则
- **适用场景**: 国家安全级别、CEO专属决策
- **要求**: 审计+审批流程

## 🔧 技术实现

### 动态访问控制
```javascript
// 自动检测用户身份和权限
const userLevel = confidentialityManager.getUserClearance(userId);
const hasAccess = confidentialityManager.checkAccess(userLevel, contentLevel);
```

### 内容脱敏
```javascript
// 超出权限的内容自动脱敏
if (content.classification > userLevel) {
  return "[REDACTED - INSUFFICIENT CLEARANCE]";
}
```

## 🌍 通用性特性

### 多租户支持
- 适用于任何组织架构
- 不绑定特定公司或团队
- 开箱即用的安全配置

### 自定义扩展
- 用户可创建自定义保密标签
- 支持继承和覆盖机制  
- 提供标准化API接口

### 角色权限映射
| 角色 | 默认权限 | 说明 |
|------|---------|------|
| 管理员 | L4 | 可配置所有保密等级 |
| 普通用户 | L1 | 只能访问L0-L1内容 |
| 安全官 | L3 | 可审计所有访问记录 |
| 访客 | L0 | 仅公开内容 |

## 🚀 使用指南

### 启用保密系统
电子羊v2.7.1默认启用基础保密功能，高级功能可通过配置开启。

### 配置自定义等级
```yaml
confidentiality_levels:
  - name: "Custom Level"
    level: 5
    description: "Custom security level"
```

### API集成
提供标准REST API用于第三方系统集成：
- `POST /confidentiality/check` - 权限验证
- `GET /confidentiality/levels` - 获取等级列表
- `PUT /confidentiality/content` - 设置内容等级

## 📊 安全审计

### 访问日志
记录所有保密信息的访问尝试，包括：
- 用户ID和权限等级
- 访问的内容等级  
- 访问结果（允许/拒绝）
- 时间戳

### 异常检测
- 检测越权访问行为
- 识别异常访问模式
- 自动上报安全威胁

## 🔒 安全默认配置

### 开箱即用
- **默认等级**: L0 (公开)
- **用户权限**: L1 (内部)  
- **管理员权限**: L4 (绝密)
- **审计日志**: 自动启用

### 最佳实践
1. **最小权限原则**: 只授予必要的访问权限
2. **定期审查**: 定期检查和更新权限分配
3. **敏感内容标记**: 主动标记高敏感度内容
4. **审计监控**: 持续监控访问日志

---

**版本**: v2.7.1  
**最后更新**: 2026-03-12  
**作者**: 电子羊部 - 保密系统设计师