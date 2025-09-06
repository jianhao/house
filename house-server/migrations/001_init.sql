-- 启用 PostGIS 扩展
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    openid VARCHAR(100) UNIQUE NOT NULL,
    unionid VARCHAR(100),
    nickname VARCHAR(100) NOT NULL,
    avatar TEXT,
    phone VARCHAR(20),
    real_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 创建房源表
CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    cover_image TEXT,
    images JSONB DEFAULT '[]',
    price DECIMAL(12,2) NOT NULL,
    price_unit VARCHAR(20) DEFAULT '万元',
    area VARCHAR(100),
    address TEXT NOT NULL,
    location GEOMETRY(POINT, 4326),
    house_types JSONB DEFAULT '[]',
    delivery_time VARCHAR(50),
    tags JSONB DEFAULT '[]',
    rating DECIMAL(3,2) DEFAULT 0,
    developer VARCHAR(200),
    property_company VARCHAR(200),
    building_area VARCHAR(100),
    plot_ratio DECIMAL(5,2),
    green_rate DECIMAL(5,2),
    parking_ratio VARCHAR(50),
    school_district TEXT,
    description TEXT,
    nearby_facilities JSONB DEFAULT '[]',
    pros JSONB DEFAULT '[]',
    cons JSONB DEFAULT '[]',
    floor_plans JSONB DEFAULT '[]',
    sales_info JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'available',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, house_id)
);

-- 创建浏览历史表
CREATE TABLE IF NOT EXISTS browse_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建新闻表
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category VARCHAR(50) NOT NULL,
    tags JSONB DEFAULT '[]',
    author VARCHAR(100),
    source VARCHAR(100),
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建咨询记录表
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    contact_phone VARCHAR(20),
    contact_name VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    reply_content TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建预约看房表
CREATE TABLE IF NOT EXISTS viewing_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    contact_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    visitor_count INTEGER DEFAULT 1,
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建反馈表
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200),
    content TEXT NOT NULL,
    contact_info VARCHAR(200),
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending',
    reply_content TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_houses_status ON houses(status);
CREATE INDEX IF NOT EXISTS idx_houses_area ON houses(area);
CREATE INDEX IF NOT EXISTS idx_houses_price ON houses(price);
CREATE INDEX IF NOT EXISTS idx_houses_location ON houses USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_houses_created_at ON houses(created_at);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_house_id ON collections(house_id);
CREATE INDEX IF NOT EXISTS idx_browse_history_user_id ON browse_history(user_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_appointments_user_id ON viewing_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_appointments_date ON viewing_appointments(appointment_date);

-- 插入示例数据

-- 插入示例房源数据
INSERT INTO houses (
    name, cover_image, price, area, address, location, house_types, delivery_time, 
    tags, rating, developer, description
) VALUES 
(
    '西湖印象花园',
    'https://example.com/images/house1.jpg',
    280.00,
    '西湖区',
    '杭州市西湖区文三路123号',
    ST_GeomFromText('POINT(120.1551 30.2741)', 4326),
    '["两室一厅", "三室两厅"]',
    '2024年12月',
    '["地铁沟通", "学区房", "精装修"]',
    4.5,
    '绿城集团',
    '位于西湖区核心地段，交通便利，配套完善，是理想的居住选择。'
),
(
    '钱江新城公寓',
    'https://example.com/images/house2.jpg',
    350.00,
    '江干区',
    '杭州市上城区钱江路456号',
    ST_GeomFromText('POINT(120.2103 30.2467)', 4326),
    '["一室一厅", "两室一厅"]',
    '2025年6月',
    '["江景房", "高层", "现代化"]',
    4.3,
    '万科集团',
    '钱江新城核心区域，享受城市繁华与江景美色。'
),
(
    '滨江科技城',
    'https://example.com/images/house3.jpg',
    420.00,
    '滨江区',
    '杭州市滨江区江南大道789号',
    ST_GeomFromText('POINT(120.2097 30.1984)', 4326),
    '["三室两厅", "四室两厅"]',
    '2024年9月',
    '["科技园区", "配套齐全", "投资价值"]',
    4.7,
    '保利地产',
    '位于滨江高新技术开发区，周边科技企业云集，发展潜力巨大。'
);

-- 插入示例新闻数据
INSERT INTO news (
    title, summary, content, category, author, source, is_featured, published_at
) VALUES 
(
    '杭州保障房政策最新解读',
    '2024年杭州保障房申请条件和流程详细说明',
    '根据最新政策，杭州市保障房申请条件进一步放宽...',
    '政策解读',
    '政策研究室',
    '杭州住建局',
    true,
    NOW()
),
(
    '西湖区新增保障房项目开工',
    '西湖区计划新建3000套保障房，预计2025年交付',
    '为解决住房困难群体的居住问题，西湖区启动新一轮保障房建设...',
    '项目动态',
    '记者小王',
    '杭州日报',
    false,
    NOW() - INTERVAL '1 day'
);

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_browse_history_updated_at BEFORE UPDATE ON browse_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_viewing_appointments_updated_at BEFORE UPDATE ON viewing_appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();