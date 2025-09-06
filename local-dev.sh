#!/bin/bash

# 杭州保障房项目 - 本地开发脚本
# 使用方法: ./local-dev.sh [操作]
# 操作: start|stop|restart|logs|status|build|db-init|db-reset|clean|help

set -e

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

# 检查端口是否被占用
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "端口 $port ($service_name) 已被占用"
        local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        print_info "占用进程 PID: $pid"
        
        # 检查是否是Docker容器占用
        local container_id=$(docker ps --filter "publish=$port" --format "{{.ID}}" 2>/dev/null | head -1)
        if [ ! -z "$container_id" ]; then
            local container_name=$(docker ps --filter "id=$container_id" --format "{{.Names}}")
            print_warning "端口被Docker容器占用: $container_name ($container_id)"
            
            read -p "是否停止占用端口的容器？(y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_message "停止容器 $container_name..."
                docker stop $container_id >/dev/null 2>&1 || true
                docker rm $container_id >/dev/null 2>&1 || true
                print_message "容器已停止并删除"
            else
                print_error "无法启动服务，端口 $port 仍被占用"
                return 1
            fi
        else
            print_error "端口 $port 被其他进程占用，请手动处理"
            print_info "可以使用命令查看: lsof -i :$port"
            return 1
        fi
    fi
    return 0
}

# 检查所有必需端口
check_ports() {
    print_message "检查端口占用情况..."
    
    local ports=("5432:PostgreSQL" "6379:Redis" "3001:后端API" "3000:前端应用")
    local has_conflict=false
    
    for port_info in "${ports[@]}"; do
        local port=$(echo $port_info | cut -d: -f1)
        local service=$(echo $port_info | cut -d: -f2)
        
        if ! check_port $port $service; then
            has_conflict=true
        fi
    done
    
    if [ "$has_conflict" = true ]; then
        print_error "存在端口冲突，请解决后重试"
        return 1
    fi
    
    print_message "端口检查通过"
    return 0
}

# 清理孤立容器
clean_orphans() {
    print_message "清理孤立容器..."
    
    # 停止并删除可能存在的旧容器
    local old_containers=("house-postgres" "house-redis" "house-server" "house-web")
    
    for container in "${old_containers[@]}"; do
        if docker ps -a --format "{{.Names}}" | grep -q "^$container$"; then
            print_warning "发现旧容器: $container"
            docker stop $container >/dev/null 2>&1 || true
            docker rm $container >/dev/null 2>&1 || true
            print_message "已清理旧容器: $container"
        fi
    done
}

# 检查 Docker 和 Docker Compose
check_requirements() {
    print_message "检查系统要求..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    # 检查Docker服务是否运行
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker 服务未运行，请启动 Docker"
        exit 1
    fi
    
    print_message "系统要求检查通过"
}

# 构建开发环境镜像
build_dev() {
    print_message "构建开发环境 Docker 镜像..."
    docker compose -f docker-compose.dev.yml build --no-cache
    print_message "开发环境镜像构建完成"
}

# 启动开发环境
start_dev() {
    # 检查端口冲突
    if ! check_ports; then
        exit 1
    fi
    
    # 清理孤立容器
    clean_orphans
    
    print_message "启动本地开发环境..."
    
    # 使用 --remove-orphans 参数避免孤立容器警告
    if ! docker compose -f docker-compose.dev.yml up -d --remove-orphans; then
        print_error "启动失败，请检查错误信息"
        exit 1
    fi
    
    print_message "等待服务启动..."
    sleep 15
    
    # 检查服务状态
    print_message "检查服务状态..."
    docker compose -f docker-compose.dev.yml ps
    
    # 检查服务健康状态
    local unhealthy_services=$(docker compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}" | grep -v "Up" | grep -v "NAME" || true)
    
    if [ ! -z "$unhealthy_services" ]; then
        print_warning "发现异常服务:"
        echo "$unhealthy_services"
        print_info "可以使用 './local-dev.sh logs' 查看详细日志"
    fi
    
    print_info "开发环境启动完成！"
    print_info "数据库: postgresql://postgres:password@localhost:5432/house_db"
    print_info "Redis: redis://localhost:6379"
    print_info "后端API: http://localhost:3001"
    print_info "前端应用: http://localhost:3000"
    print_info "健康检查: http://localhost:3001/health"
    print_info "API文档: http://localhost:3001/docs"
    echo
    print_warning "注意: 数据库尚未初始化，如需初始化请运行:"
    print_info "  ./local-dev.sh db-init    # 初始化数据库并导入20个保障房数据"
    print_info "  ./local-dev.sh db-reset   # 重置数据库（删除所有数据后重新初始化）"
}

# 停止开发环境
stop_dev() {
    print_message "停止本地开发环境..."
    docker compose -f docker-compose.dev.yml down --remove-orphans
    print_message "开发环境已停止"
}

# 重启开发环境
restart_dev() {
    print_message "重启本地开发环境..."
    docker compose -f docker-compose.dev.yml restart
    print_message "开发环境重启完成"
}

# 查看开发环境日志
view_dev_logs() {
    print_message "查看开发环境日志..."
    docker compose -f docker-compose.dev.yml logs -f --tail=100
}

# 初始化数据库
init_database() {
    print_message "初始化开发数据库..."
    
    # 等待数据库服务启动
    print_message "等待 PostgreSQL 服务启动..."
    sleep 10
    
    # 执行数据库迁移
    print_message "执行数据库迁移..."
    docker compose -f docker-compose.dev.yml exec house-server-dev pnpm run migrate || true
    
    # 执行种子数据
    print_message "导入种子数据..."
    docker compose -f docker-compose.dev.yml exec house-server-dev pnpm run seed || true
    
    print_message "数据库初始化完成"
}

# 重置数据库
reset_database() {
    print_warning "重置开发数据库（将删除所有数据）..."
    read -p "确定要重置数据库吗？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "停止服务..."
        docker compose -f docker-compose.dev.yml down
        
        print_message "删除数据库卷..."
        docker volume rm house_postgres_dev_data 2>/dev/null || true
        
        print_message "重新启动服务..."
        docker compose -f docker-compose.dev.yml up -d
        
        sleep 15
        
        print_message "重新初始化数据库..."
        init_database
        
        print_message "数据库重置完成"
    else
        print_message "取消重置操作"
    fi
}

# 清理开发环境
clean_dev() {
    print_warning "清理开发环境 Docker 资源..."
    docker compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    print_message "开发环境清理完成"
}

# 显示开发环境状态
show_status() {
    print_message "开发环境状态:"
    docker compose -f docker-compose.dev.yml ps
    
    echo
    print_info "服务地址:"
    print_info "  数据库: postgresql://postgres:password@localhost:5432/house_db"
    print_info "  Redis: redis://localhost:6379"
    print_info "  后端API: http://localhost:3001"
    print_info "  健康检查: http://localhost:3001/health"
    print_info "  API文档: http://localhost:3001/docs"
}

# 显示帮助信息
show_help() {
    echo "杭州保障房项目 - 本地开发脚本"
    echo ""
    echo "使用方法:"
    echo "  ./local-dev.sh [操作]"
    echo ""
    echo "操作:"
    echo "  start     - 启动本地开发环境"
    echo "  stop      - 停止本地开发环境"
    echo "  restart   - 重启本地开发环境"
    echo "  logs      - 查看开发环境日志"
    echo "  status    - 显示开发环境状态"
    echo "  build     - 构建开发环境镜像"
    echo "  db-init   - 初始化数据库"
    echo "  db-reset  - 重置数据库（删除所有数据）"
    echo "  clean     - 清理开发环境资源"
    echo "  help      - 显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./local-dev.sh start        # 启动开发环境"
    echo "  ./local-dev.sh logs         # 查看日志"
    echo "  ./local-dev.sh db-init      # 初始化数据库"
    echo "  ./local-dev.sh stop         # 停止开发环境"
    echo ""
    echo "服务地址:"
    echo "  后端API: http://localhost:3001"
    echo "  前端应用: http://localhost:3000"
    echo "  健康检查: http://localhost:3001/health"
    echo "  API文档: http://localhost:3001/docs"
}

# 主函数
main() {
    local action=${1:-help}
    
    case $action in
        "start")
            check_requirements
            start_dev
            ;;
        "stop")
            stop_dev
            ;;
        "restart")
            restart_dev
            ;;
        "logs")
            view_dev_logs
            ;;
        "status")
            show_status
            ;;
        "build")
            check_requirements
            build_dev
            ;;
        "db-init")
            init_database
            ;;
        "db-reset")
            reset_database
            ;;
        "clean")
            clean_dev
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