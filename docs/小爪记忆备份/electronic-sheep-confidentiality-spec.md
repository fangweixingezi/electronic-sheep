# 电子羊通用保密等级系统规范

## 概述
这是一个适用于任何组织和用户的通用保密等级系统，不绑定特定架构。

## 标准保密等级

### L0 - 公开 (Public)
- **访问权限**: 任何人
- **适用场景**: 开源代码、公共文档、营销材料
- **默认设置**: 所有新内容的初始等级

### L1 - 内部 (Internal)
- **访问权限**: 组织内部成员（需身份验证）
- **适用场景**: 内部流程、团队协作、非敏感数据
- **安全要求**: 基本身份验证

### L2 - 机密 (Confidential)  
- **访问权限**: 授权用户（明确权限分配）
- **适用场景**: 客户数据、财务信息、产品规划
- **安全要求**: 角色基础访问控制(RBAC)

### L3 - 高度机密 (Highly Confidential)
- **访问权限**: 特定角色/部门（多重验证）
- **适用场景**: 核心算法、商业机密、战略计划
- **安全要求**: 多因素认证 + 审计日志

### L4 - 绝密 (Top Secret)
- **访问权限**: 最小权限原则（审批流程）
- **适用场景**: 国家安全、核心基础设施、应急响应
- **安全要求**: 审批工作流 + 实时监控

## 动态特性

### 自定义标签
用户可创建自定义保密标签，如：
- `financial-data`
- `customer-pii` 
- `intellectual-property`
- `regulatory-compliance`

### 继承机制
- 子内容自动继承父级保密等级
- 可手动覆盖为更高级别（不能降级）

### 权限提升
- 紧急情况下可申请临时权限提升
- 需要审批和完整审计跟踪

## API接口

### 检查访问权限
```javascript
confidentiality.checkAccess(user, contentLevel)
```

### 过滤记忆内容  
```javascript
confidentiality.filterMemory(memoryItems, user)
```

### 自动分级
```javascript
confidentiality.autoClassify(content)
```

## 多租户支持

### 组织配置
```yaml
organization: "YourOrg"
custom_levels:
  - name: "Team-Only"
    level: 1.5
    description: "Team members only"
```

### 角色映射
- **管理员**: L0-L4全访问
- **普通用户**: L0-L2  
- **安全官**: L0-L4 + 审计权限
- **访客**: L0 only

## 合规性

### 支持标准
- GDPR (通用数据保护条例)
- HIPAA (健康保险可携性和责任法案)  
- SOC 2 (服务组织控制)
- ISO 27001 (信息安全管理体系)

### 自动合规检查
- 敏感数据自动识别
- 合规性报告生成
- 风险评估提醒

## 集成指南

### OpenClaw集成
1. 安装电子羊Skill
2. 启用保密等级系统
3. 配置组织和用户角色
4. 开始使用分级记忆功能

### 其他平台
提供标准化REST API和SDK，支持任何AI平台集成。