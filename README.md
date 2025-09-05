# 🚚 DDmap - 司机专用地址点评平台

<div align="center">

![DDmap Logo](https://img.shields.io/badge/DDmap-司机专用-green?style=for-the-badge&logo=map&logoColor=white)

**为配送司机量身定制的地址点评与黑名单管理系统**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)

[🌟 在线演示](#) | [📱 移动端预览](#) | [🐛 问题反馈](https://github.com/Coopermydog/DDmap/issues)

</div>

## 📖 项目简介

DDmap 是一个专为配送司机打造的地址点评平台，帮助司机们分享配送经验，避开问题地址，提高配送效率和安全性。

### 🎯 核心功能

- **📍 地址标注系统** - 在地图上标记和评价配送地址
- **⭐ 多维度评分** - 停车便利度、小费情况、安全评级
- **👑 会员订阅** - 高级功能解锁，无限制黑名单管理
- **🚫 零小费预警** - 智能预警附近零小费地址
- **📱 移动端优化** - 完美适配手机浏览器使用
- **💬 社区评价** - 司机间经验分享和互助

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn
- 现代浏览器（支持ES2020+）

### 安装运行

```bash
# 克隆项目
git clone https://github.com/Coopermydog/DDmap.git
cd DDmap

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的 Google Maps API Key

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境配置

在 `.env` 文件中配置：

```env
VITE_GOOGLE_MAPS_API_KEY=你的Google地图API密钥
```

## ✨ 功能特色

### 🗺️ 智能地图系统
- **交互式地图** - 支持点击添加标注，悬停查看详情
- **实时定位** - 基于GPS的精准位置标记
- **离线地图** - 网络不佳时的备用显示方案

### 💎 会员订阅系统
- **免费用户** - 5个黑名单地址额度
- **月度会员** - ¥19/月，无限制功能
- **年度会员** - ¥99/年，50%优惠价格

### 🔍 高级搜索功能
- **距离筛选** - 3km/5km/8km/10km/15km自定义范围
- **分类筛选** - 按评分、小费情况、安全等级筛选
- **热门排行** - 基于点赞数的地址排名

### 📱 移动端体验
- **响应式设计** - 完美适配各种屏幕尺寸
- **触摸优化** - 44px最小触摸目标，防误触设计
- **性能优化** - 快速加载，流畅交互

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 原子化CSS框架
- **Vite** - 极速构建工具

### 核心库
- **Google Maps API** - 地图服务
- **Zustand** - 轻量级状态管理
- **React Hook Form** - 表单处理
- **Date-fns** - 日期处理工具

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git钩子管理

## 📦 项目结构

```
DDmap/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React组件
│   │   ├── MapView.tsx   # 主地图组件
│   │   ├── GoogleMap.tsx # Google地图集成
│   │   └── ...
│   ├── pages/            # 页面组件
│   ├── hooks/            # 自定义Hooks
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   └── api/              # API接口
├── .env.example          # 环境变量模板
├── tailwind.config.js    # Tailwind配置
└── vite.config.ts        # Vite配置
```

## 🎨 设计理念

### 用户体验优先
- **直观操作** - 点击即用，无需复杂学习
- **信息清晰** - 重要信息突出显示
- **快速响应** - 最小化加载时间

### 移动优先设计
- **触摸友好** - 所有交互元素符合移动端标准
- **网络适应** - 弱网环境下的优雅降级
- **电池友好** - 优化性能减少耗电

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📈 路线图

### v1.0 ✅ 已完成
- [x] 基础地图功能
- [x] 评分系统
- [x] 会员订阅
- [x] 移动端优化

### v1.1 🚧 开发中
- [ ] 用户认证系统
- [ ] 数据持久化
- [ ] 消息通知
- [ ] 高级统计

### v2.0 📋 计划中
- [ ] 路线规划
- [ ] 实时聊天
- [ ] 数据分析
- [ ] API开放平台

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何参与
1. Fork 这个项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发规范
- 遵循现有的代码风格
- 编写清晰的提交信息
- 添加必要的测试用例
- 更新相关文档

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情

## 🙏 致谢

- 感谢所有参与测试和反馈的司机朋友们
- 感谢开源社区提供的优秀工具和库
- 特别感谢 [Google Maps Platform](https://developers.google.com/maps) 提供地图服务

## 📞 联系我们

- 🐛 **问题报告**: [GitHub Issues](https://github.com/Coopermydog/DDmap/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/Coopermydog/DDmap/discussions)
- 📧 **商务合作**: 通过GitHub联系我们

---

<div align="center">

**让每一次配送都更安全、更高效** 🚚💨

Made with ❤️ for delivery drivers

</div>