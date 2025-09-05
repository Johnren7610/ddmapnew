#!/bin/bash

# DDmap 部署脚本
# 使用方法: ./scripts/deploy.sh [platform]
# 支持的平台: vercel, netlify, pages

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查部署依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装！请安装 Node.js 18+ 版本"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装！"
        exit 1
    fi
    
    # 检查Node版本
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 版本过低！需要18+版本，当前版本: $(node --version)"
        exit 1
    fi
    
    log_info "✓ Node.js $(node --version)"
    log_info "✓ npm $(npm --version)"
}

# 环境变量检查
check_env() {
    log_info "检查环境变量..."
    
    if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
        log_error "未找到环境变量文件！请创建 .env 或 .env.production"
        exit 1
    fi
    
    if [ -f ".env.production" ]; then
        source .env.production
    elif [ -f ".env" ]; then
        source .env
    fi
    
    if [ -z "$VITE_GOOGLE_MAPS_API_KEY" ]; then
        log_error "VITE_GOOGLE_MAPS_API_KEY 未设置！"
        echo "请在环境变量文件中设置 Google Maps API 密钥"
        exit 1
    fi
    
    log_info "✓ Google Maps API Key 已配置"
}

# 代码质量检查
run_checks() {
    log_info "运行代码质量检查..."
    
    # TypeScript类型检查
    log_info "TypeScript类型检查..."
    npm run type-check
    
    # ESLint检查
    log_info "ESLint代码检查..."
    npm run lint
    
    # 测试（如果存在）
    if npm run | grep -q "test"; then
        log_info "运行测试..."
        npm run test
    fi
    
    log_info "✓ 所有检查通过"
}

# 构建项目
build_project() {
    log_info "构建生产版本..."
    
    # 清理之前的构建
    if [ -d "dist" ]; then
        rm -rf dist
        log_info "✓ 清理旧的构建文件"
    fi
    
    # 构建
    npm run build
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "构建失败！dist目录不存在"
        exit 1
    fi
    
    # 显示构建大小
    log_info "构建完成！文件大小："
    du -sh dist/*
    
    log_info "✓ 构建成功"
}

# Vercel部署
deploy_vercel() {
    log_info "部署到 Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_info "安装 Vercel CLI..."
        npm install -g vercel
    fi
    
    # 检查登录状态
    if ! vercel whoami &> /dev/null; then
        log_warn "请先登录 Vercel:"
        vercel login
    fi
    
    # 部署
    vercel --prod
    
    log_info "✓ Vercel 部署完成"
}

# Netlify部署
deploy_netlify() {
    log_info "部署到 Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        log_info "安装 Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # 检查登录状态
    if ! netlify status &> /dev/null; then
        log_warn "请先登录 Netlify:"
        netlify login
    fi
    
    # 部署
    netlify deploy --prod --dir=dist
    
    log_info "✓ Netlify 部署完成"
}

# GitHub Pages部署
deploy_pages() {
    log_info "部署到 GitHub Pages..."
    
    # 安装 gh-pages
    if ! npm list gh-pages &> /dev/null; then
        log_info "安装 gh-pages..."
        npm install --save-dev gh-pages
    fi
    
    # 部署
    npx gh-pages -d dist
    
    log_info "✓ GitHub Pages 部署完成"
}

# 部署后验证
verify_deployment() {
    log_info "部署后验证..."
    
    # 简单的健康检查
    if [ -n "$DEPLOYMENT_URL" ]; then
        if curl -f "$DEPLOYMENT_URL" > /dev/null 2>&1; then
            log_info "✓ 网站可访问: $DEPLOYMENT_URL"
        else
            log_warn "⚠ 网站可能需要几分钟才能生效"
        fi
    fi
}

# 主函数
main() {
    local platform=${1:-"vercel"}
    
    echo "🚀 开始部署 DDmap 到 $platform"
    echo "================================"
    
    # 执行检查和构建
    check_dependencies
    check_env
    run_checks
    build_project
    
    # 根据平台部署
    case $platform in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "pages"|"github-pages")
            deploy_pages
            ;;
        *)
            log_error "不支持的部署平台: $platform"
            echo "支持的平台: vercel, netlify, pages"
            exit 1
            ;;
    esac
    
    verify_deployment
    
    echo "================================"
    log_info "🎉 部署完成！"
    echo ""
    log_info "下一步:"
    echo "1. 测试网站功能"
    echo "2. 配置自定义域名（可选）"
    echo "3. 设置监控和分析"
    echo "4. 优化SEO和性能"
}

# 帮助信息
show_help() {
    echo "DDmap 部署脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [platform]"
    echo ""
    echo "支持的平台:"
    echo "  vercel      - 部署到 Vercel (默认)"
    echo "  netlify     - 部署到 Netlify"
    echo "  pages       - 部署到 GitHub Pages"
    echo ""
    echo "示例:"
    echo "  $0 vercel   - 部署到 Vercel"
    echo "  $0 netlify  - 部署到 Netlify"
}

# 检查参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# 运行主函数
main "$@"