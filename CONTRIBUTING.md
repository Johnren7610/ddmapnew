# 🤝 DDmap 贡献指南

感谢您对DDmap项目的兴趣！我们欢迎所有形式的贡献，无论是代码、文档、问题报告还是功能建议。

## 📋 目录

- [如何开始](#如何开始)
- [开发环境搭建](#开发环境搭建)
- [贡献类型](#贡献类型)
- [代码规范](#代码规范)
- [提交流程](#提交流程)
- [问题报告](#问题报告)
- [功能请求](#功能请求)
- [代码审查](#代码审查)

## 🚀 如何开始

### 1. Fork 项目

点击GitHub页面右上角的 "Fork" 按钮，将项目复制到您的GitHub账户。

### 2. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/DDmap.git
cd DDmap
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/Coopermydog/DDmap.git
```

### 4. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或者修复bug
git checkout -b fix/your-bug-fix
```

## 🛠️ 开发环境搭建

### 系统要求

- Node.js 18+
- npm 9+ 或 yarn 1.22+
- Git 2.x

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，添加必要的配置
```

### 启动开发服务器

```bash
npm run dev
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 代码检查

```bash
# TypeScript类型检查
npm run type-check

# ESLint代码检查
npm run lint

# 自动修复代码风格问题
npm run lint:fix

# 格式化代码
npm run format
```

## 🎯 贡献类型

### 🐛 Bug修复

1. 在Issues中搜索相关的bug报告
2. 如果没有相关Issue，请先创建一个
3. 创建修复分支：`git checkout -b fix/issue-number-description`
4. 修复问题并添加测试
5. 提交Pull Request

### ✨ 新功能开发

1. 在Issues或Discussions中讨论新功能
2. 等待维护者确认功能需求
3. 创建功能分支：`git checkout -b feature/feature-name`
4. 实现功能并添加测试
5. 更新相关文档
6. 提交Pull Request

### 📚 文档改进

1. 识别需要改进的文档
2. 创建分支：`git checkout -b docs/improvement-description`
3. 更新文档
4. 提交Pull Request

### 🎨 UI/UX改进

1. 在Issues中描述UI/UX问题
2. 提供设计建议或原型
3. 创建分支：`git checkout -b ui/improvement-description`
4. 实现改进
5. 提供前后对比截图
6. 提交Pull Request

## 📝 代码规范

### TypeScript/React规范

```typescript
// ✅ 好的做法
interface User {
  id: string;
  name: string;
  email: string;
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ 避免的做法
const UserCard = (props: any) => {
  return (
    <div>
      <h3>{props.user.name}</h3>
      <p>{props.user.email}</p>
    </div>
  );
};
```

### CSS/Tailwind规范

```tsx
// ✅ 好的做法 - 有序的Tailwind类名
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <span className="text-lg font-semibold text-gray-900">Title</span>
</div>

// ❌ 避免的做法 - 混乱的类名顺序
<div className="shadow-md text-gray-900 rounded-lg font-semibold flex bg-white p-4 text-lg items-center justify-between">
  <span>Title</span>
</div>
```

### 文件命名规范

```
src/
├── components/
│   ├── MapView/           # 组件文件夹
│   │   ├── index.tsx     # 主组件文件
│   │   ├── MapView.test.tsx  # 测试文件
│   │   └── MapView.stories.tsx  # Storybook文件
│   └── ui/               # 通用UI组件
├── hooks/
│   └── useMapData.ts     # 自定义hook
├── utils/
│   └── mapUtils.ts       # 工具函数
└── types/
    └── map.ts           # 类型定义
```

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>

<body>

<footer>
```

**类型 (Type):**
- `feat`: 新功能
- `fix`: bug修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

**示例:**
```
feat(map): add zero-tip address warning system

- Implement distance-based filtering
- Add customizable radius selection (3-15km)
- Include Haversine formula for distance calculation
- Add premium membership validation

Closes #123
```

## 🔄 提交流程

### 1. 保持分支最新

```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

### 2. 提交更改

```bash
git add .
git commit -m "feat(component): add new feature"
```

### 3. 推送分支

```bash
git push origin your-branch
```

### 4. 创建Pull Request

1. 访问GitHub上的项目页面
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写PR描述模板
5. 请求代码审查

### PR描述模板

```markdown
## 🔧 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 📝 变更描述
简要描述您的更改内容...

## 🧪 测试计划
- [ ] 添加了单元测试
- [ ] 添加了集成测试
- [ ] 手动测试通过
- [ ] 验证了移动端兼容性

## 📸 截图 (如果适用)
<!-- 添加相关截图 -->

## 🔗 相关Issue
Closes #123

## ✅ 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] PR标题遵循约定提交格式
```

## 🐛 问题报告

### 报告Bug前的检查

1. 搜索现有Issues，确认问题未被报告
2. 确认问题在最新版本中仍然存在
3. 尝试在不同浏览器中重现问题

### Bug报告模板

创建Issue时使用以下模板：

```markdown
## 🐛 Bug描述
简洁清晰地描述bug是什么...

## 🔄 重现步骤
1. 访问 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 出现错误

## 🎯 预期行为
描述您期望发生什么...

## 📸 截图
如果适用，添加截图来帮助解释问题

## 🖥️ 环境信息
- 操作系统: [如 iOS 16.1, Windows 11]
- 浏览器: [如 Chrome 108, Safari 16]
- 设备: [如 iPhone 14, Desktop]
- 项目版本: [如 v1.0.0]

## 📄 额外上下文
在此添加关于问题的任何其他上下文...
```

## 💡 功能请求

### 请求新功能前

1. 搜索现有Issues和Discussions
2. 考虑功能的普遍适用性
3. 准备详细的使用场景

### 功能请求模板

```markdown
## 🚀 功能请求

**问题描述**
当前缺少什么功能？描述您遇到的问题...

**解决方案**
您希望看到什么样的解决方案？

**替代方案**
您是否考虑过其他替代解决方案？

**使用场景**
这个功能将在什么情况下使用？

**额外上下文**
添加任何其他上下文或截图...
```

## 👀 代码审查

### 审查者指南

1. **功能性**: 代码是否按预期工作？
2. **可读性**: 代码是否清晰易懂？
3. **性能**: 是否有性能问题？
4. **安全性**: 是否存在安全漏洞？
5. **测试**: 是否有足够的测试覆盖？

### 反馈指南

```markdown
# ✅ 好的反馈
这个函数可能会在大数据量时有性能问题。建议考虑使用虚拟化或分页。

# ❌ 不好的反馈
这个不行。
```

### 响应反馈

1. 认真考虑所有反馈
2. 及时回应问题和建议
3. 如有不同意见，礼貌讨论
4. 感谢审查者的时间

## 🏷️ 版本发布

### 语义化版本

- `MAJOR.MINOR.PATCH` (如 1.0.0)
- **MAJOR**: 不兼容的API更改
- **MINOR**: 向后兼容的功能添加
- **PATCH**: 向后兼容的bug修复

### 发布流程

1. 更新版本号
2. 更新CHANGELOG.md
3. 创建发布标签
4. 编写发布说明

## 🎉 认可贡献者

我们使用 [All Contributors](https://allcontributors.org/) 来认可所有类型的贡献。

贡献类型包括：
- 💻 代码
- 📖 文档
- 🐛 Bug报告
- 💡 想法
- 🤔 答疑
- ⚠️ 测试
- 🎨 设计

## 📞 获得帮助

如果您需要帮助：

1. 📚 查看[文档](README.md)
2. 🔍 搜索现有[Issues](https://github.com/Coopermydog/DDmap/issues)
3. 💬 在[Discussions](https://github.com/Coopermydog/DDmap/discussions)中提问
4. 📧 联系维护者

## 📜 行为准则

请确保在参与项目时遵循我们的[行为准则](CODE_OF_CONDUCT.md)。我们致力于为每个人提供友好、安全和欢迎的环境。

---

再次感谢您的贡献！🙏 每一个贡献都让DDmap变得更好。