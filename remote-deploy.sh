#!/bin/bash

# 杭州保障房项目 - 远程部署脚本
# 使用方法: ./remote-deploy.sh [操作]
# 操作: deploy|update|start|stop|status|logs|help

set -e

# 服务器配置
SERVER_HOST="101.43.35.163"
SERVER_PORT="2222"
SERVER_USER="ubuntu"
SERVER_PATH="/opt/house-project"
USE_SUDO="true"  # 是否使用sudo权限

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

print_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# 检查必要工具
check_requirements() {
    print_message "检查本地环境..."
    
    if ! command -v scp &> /dev/null; then
        print_error "scp 命令未找到，请确保已安装 OpenSSH"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "ssh 命令未找到，请确保已安装 OpenSSH"
        exit 1
    fi
    
    if ! command -v rsync &> /dev/null; then
        print_error "rsync 命令未找到，请确保已安装 rsync"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm 未安装，请先安装 pnpm"
        exit 1
    fi
    
    print_message "本地环境检查通过"
}

# 创建服务器目录
create_server_directories() {
    print_message "创建服务器目录..."
    
    if [ "$USE_SUDO" = "true" ]; then
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "sudo mkdir -p $SERVER_PATH && sudo chown -R $SERVER_USER:$SERVER_USER $SERVER_PATH"
    else
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
    fi
}

# 上传完整项目文件（用于首次部署）
upload_full_project() {
    print_message "开始上传完整项目文件..."
    
    # 创建服务器目录
    create_server_directories
    
    # 上传前端项目源码（用于Docker构建）
    print_message "上传前端项目源码..."
    if ! rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='*.log' --exclude='.eslintcache' -e "ssh -p $SERVER_PORT" house-web/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/house-web/; then
        print_error "前端项目上传失败"
        exit 1
    fi
    
    # 上传后端项目源码
    print_message "上传后端项目源码..."
    if ! rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='*.log' --exclude='.eslintcache' --exclude='uploads' -e "ssh -p $SERVER_PORT" house-server/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/house-server/; then
        print_error "后端项目上传失败"
        exit 1
    fi
    
    # 上传配置文件
    print_message "上传配置文件..."
    if ! scp -P $SERVER_PORT docker-compose.yml $SERVER_USER@$SERVER_HOST:$SERVER_PATH/; then
        print_error "docker-compose.yml 上传失败"
        exit 1
    fi
    
    if ! scp -P $SERVER_PORT -r nginx $SERVER_USER@$SERVER_HOST:$SERVER_PATH/; then
        print_error "nginx配置上传失败"
        exit 1
    fi
    
    # 上传部署脚本
    if ! scp -P $SERVER_PORT remote-deploy.sh $SERVER_USER@$SERVER_HOST:$SERVER_PATH/deploy.sh; then
        print_error "部署脚本上传失败"
        exit 1
    fi
    
    print_message "完整项目文件上传完成"
}

# 构建并上传更新文件（用于快速更新）
upload_updates() {
    print_message "开始构建并上传更新文件..."
    
    # 构建并上传前端
    print_message "构建前端项目..."
    cd house-web
    if ! pnpm install; then
        print_error "前端依赖安装失败"
        exit 1
    fi
    
    if ! pnpm run build; then
        print_error "前端构建失败"
        exit 1
    fi
    
    # 上传前端构建产物
    print_message "上传前端构建产物..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH/house-web"
    if ! scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH/house-web/; then
        print_error "前端文件上传失败"
        exit 1
    fi
    cd ..
    
    # 上传后端项目源码
    print_message "上传后端项目源码..."
    if ! rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='*.log' --exclude='.eslintcache' --exclude='uploads' -e "ssh -p $SERVER_PORT" house-server/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/house-server/; then
        print_error "后端项目上传失败"
        exit 1
    fi
    
    print_message "更新文件上传完成"
}

# 部署服务（首次部署）
deploy_services() {
    print_message "开始部署服务..."
    
    if [ "$USE_SUDO" = "true" ]; then
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
sudo chmod +x deploy.sh
sudo docker compose build --no-cache
sudo docker compose up -d
sleep 30
sudo docker compose exec house-server pnpm run migrate || true
sudo docker compose exec house-server pnpm run seed || true
EOF
    else
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
chmod +x deploy.sh
docker compose build --no-cache
docker compose up -d
sleep 30
docker compose exec house-server pnpm run migrate || true
docker compose exec house-server pnpm run seed || true
EOF
    fi
    
    print_message "服务部署完成"
    print_info "前端访问地址: http://$SERVER_HOST"
    print_info "后端API地址: http://$SERVER_HOST:3001"
    print_info "健康检查: http://$SERVER_HOST:3001/health"
}

# 更新服务（快速更新）
update_services() {
    print_message "开始更新服务..."
    
    # 上传更新文件
    upload_updates
    
    # 重新构建并重启服务
    print_message "重新构建并重启服务..."
    if [ "$USE_SUDO" = "true" ]; then
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
sudo docker compose build house-server
sudo docker compose restart
EOF
    else
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
docker compose build house-server
docker compose restart
EOF
    fi
    
    print_message "服务更新完成"
}

# 启动服务
start_services() {
    print_message "启动服务..."
    
    if [ "$USE_SUDO" = "true" ]; then
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && sudo docker compose up -d"
    else
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && docker compose up -d"
    fi
    
    print_message "服务启动完成"
}

# 停止服务
stop_services() {
    print_message "停止服务..."
    
    if [ "$USE_SUDO" = "true" ]; then
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && sudo docker compose down"
    else
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && docker compose down"
    fi
    
    print_message "服务停止完成"
}

# 查看服务状态
check_status() {
    print_message "查看服务状态..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
docker compose ps
echo ""
echo "服务地址:"
echo "  前端: http://$SERVER_HOST"
echo "  后端API: http://$SERVER_HOST:3001"
echo "  健康检查: http://$SERVER_HOST:3001/health"
EOF
}

# 查看服务日志
view_logs() {
    print_message "查看服务日志..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
cd $SERVER_PATH
docker compose logs -f --tail=100
EOF
}

# 显示帮助信息
show_help() {
    echo "杭州保障房项目 - 远程部署脚本"
    echo ""
    echo "技术栈: Vue3+TS (前端) + Fastify+PostgreSQL+Redis (后端)"
    echo ""
    echo "使用方法:"
    echo "  ./remote-deploy.sh [操作]"
    echo ""
    echo "操作:"
    echo "  deploy    - 完整部署（首次部署使用）"
    echo "            上传完整项目 + 构建Docker镜像 + 启动服务 + 初始化数据库"
    echo "  update    - 快速更新（日常更新使用）"
    echo "            构建前端 + 上传更新文件 + 重启服务"
    echo "  start     - 启动服务"
    echo "  stop      - 停止服务"
    echo "  status    - 查看服务状态"
    echo "  logs      - 查看服务日志"
    echo "  help      - 显示帮助信息"
    echo ""
    echo "常用流程:"
    echo "  首次部署: ./remote-deploy.sh deploy"
    echo "  代码更新: ./remote-deploy.sh update"
    echo "  启动服务: ./remote-deploy.sh start"
    echo "  查看状态: ./remote-deploy.sh status"
    echo ""
    echo "服务器配置:"
    echo "  地址: $SERVER_HOST:$SERVER_PORT"
    echo "  用户: $SERVER_USER"
    echo "  路径: $SERVER_PATH"
    echo ""
    echo "服务地址:"
    echo "  前端: http://$SERVER_HOST"
    echo "  后端API: http://$SERVER_HOST:3001"
    echo "  健康检查: http://$SERVER_HOST:3001/health"
}

# 主函数
main() {
    local action=${1:-help}
    
    case $action in
        "deploy")
            check_requirements
            upload_full_project
            deploy_services
            ;;
        "update")
            check_requirements
            update_services
            ;;
        "start")
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "status")
            check_status
            ;;
        "logs")
            view_logs
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "未知操作: $action"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"