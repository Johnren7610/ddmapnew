# 🚀 DDmap 部署指南

本文档提供了DDmap项目的完整部署指南，包括开发环境搭建、生产环境部署和持续集成配置。

## 📋 目录

- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [Docker部署](#docker部署)
- [持续集成](#持续集成)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## 🛠️ 开发环境部署

### 系统要求

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或 yarn 1.22+
- **Git**: 2.x
- **现代浏览器**: Chrome 90+, Firefox 88+, Safari 14+

### 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/Coopermydog/DDmap.git
cd DDmap

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env

# 4. 启动开发服务器
npm run dev
```

### 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# Google Maps API配置
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# 应用配置
VITE_APP_TITLE=DDmap
VITE_APP_VERSION=1.0.0

# API配置 (如果有后端API)
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# 第三方服务配置
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### 开发服务器选项

```bash
# 标准开发模式
npm run dev

# 指定端口
npm run dev -- --port 3000

# 允许外部访问
npm run dev -- --host

# 开启HTTPS (用于测试PWA等功能)
npm run dev -- --https
```

## 🌐 生产环境部署

### 方式一：静态文件部署

```bash
# 1. 构建生产版本
npm run build

# 2. 预览构建结果 (可选)
npm run preview

# 3. 部署dist目录到静态文件服务器
# 支持的平台：
# - Vercel, Netlify, GitHub Pages
# - AWS S3, 阿里云OSS, 腾讯云COS
# - Apache, Nginx
```

### 方式二：Vercel部署 (推荐)

1. **连接GitHub仓库**
   ```bash
   # 安装Vercel CLI
   npm i -g vercel
   
   # 登录Vercel
   vercel login
   
   # 部署项目
   vercel --prod
   ```

2. **配置环境变量**
   - 在Vercel Dashboard中配置环境变量
   - 或使用 `vercel env` 命令

3. **自定义域名**
   ```bash
   # 添加自定义域名
   vercel domains add your-domain.com
   ```

### 方式三：Netlify部署

1. **直接拖拽部署**
   - 构建项目：`npm run build`
   - 将 `dist` 目录拖拽到 Netlify

2. **Git集成部署**
   - 连接GitHub仓库
   - 配置构建设置：
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **配置重定向** (用于SPA路由)
   
   创建 `public/_redirects` 文件：
   ```
   /*    /index.html   200
   ```

### 方式四：GitHub Pages部署

```bash
# 1. 安装gh-pages
npm install --save-dev gh-pages

# 2. 在package.json中添加脚本
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 3. 构建并部署
npm run build
npm run deploy
```

## 🐳 Docker部署

### Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码并构建
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建结果到nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  ddmap-frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # 如果需要配置反向代理
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - ddmap-frontend
```

### Nginx配置

创建 `nginx.conf`：

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 启用Gzip压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }

        # 安全头配置
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }
}
```

## ⚙️ 持续集成 (CI/CD)

### GitHub Actions配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
      env:
        VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 环境变量管理

在GitHub仓库设置中添加以下Secrets：

- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API密钥
- `VERCEL_TOKEN`: Vercel访问令牌
- `ORG_ID`: Vercel组织ID
- `PROJECT_ID`: Vercel项目ID

## 🔧 环境变量详细配置

### 开发环境 (.env.development)

```env
NODE_ENV=development
VITE_APP_ENV=development
VITE_GOOGLE_MAPS_API_KEY=your_dev_api_key
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_MOCK=true
```

### 生产环境 (.env.production)

```env
NODE_ENV=production
VITE_APP_ENV=production
VITE_GOOGLE_MAPS_API_KEY=your_prod_api_key
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
```

### 测试环境 (.env.test)

```env
NODE_ENV=test
VITE_APP_ENV=test
VITE_GOOGLE_MAPS_API_KEY=test_api_key
VITE_API_BASE_URL=https://test-api.yourdomain.com
```

## 🐛 常见问题

### 构建问题

**问题**: `npm run build` 失败
```bash
# 解决方案
rm -rf node_modules package-lock.json
npm install
npm run build
```

**问题**: TypeScript类型错误
```bash
# 解决方案
npm run type-check
# 修复类型错误后重新构建
```

### 部署问题

**问题**: 路由在生产环境不工作 (404错误)
```nginx
# Nginx配置添加
location / {
    try_files $uri $uri/ /index.html;
}
```

**问题**: API请求CORS错误
```typescript
// 开发环境代理配置 (vite.config.ts)
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 性能优化

**问题**: 首次加载慢
```typescript
// 代码分割
const LazyComponent = lazy(() => import('./components/HeavyComponent'));

// 预加载关键资源
<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin>
```

**问题**: 构建产物过大
```typescript
// vite.config.ts 配置优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
})
```

## 📊 监控和维护

### 性能监控

```typescript
// 添加性能监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 错误监控

```typescript
// 集成Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
});
```

### 日志管理

```typescript
// 结构化日志
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

---

💡 **提示**: 如有部署相关问题，请查看 [GitHub Issues](https://github.com/Coopermydog/DDmap/issues) 或提交新的问题。