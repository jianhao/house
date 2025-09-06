-- 杭州保障房系统 Mock 数据
-- 清空现有数据
TRUNCATE TABLE feedback, viewing_appointments, consultations, news, browse_history, collections, houses, users RESTART IDENTITY CASCADE;

-- 插入用户数据
INSERT INTO users (id, openid, unionid, nickname, avatar, phone, real_name, created_at, last_login_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'wx_openid_001', 'wx_unionid_001', '张小明', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132', '13800138001', '张明', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'wx_openid_002', 'wx_unionid_002', '李小红', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132', '13800138002', '李红', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440003', 'wx_openid_003', 'wx_unionid_003', '王大华', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132', '13800138003', '王华', NOW() - INTERVAL '20 days', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440004', 'wx_openid_004', 'wx_unionid_004', '陈小美', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132', '13800138004', '陈美', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 minutes'),
('550e8400-e29b-41d4-a716-446655440005', 'wx_openid_005', 'wx_unionid_005', '刘小强', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132', '13800138005', '刘强', NOW() - INTERVAL '10 days', NOW());

-- 插入房源数据
INSERT INTO houses (
    id, name, cover_image, images, price, price_unit, area, address, location, 
    house_types, delivery_time, tags, rating, developer, property_company, 
    building_area, plot_ratio, green_rate, parking_ratio, school_district, 
    description, nearby_facilities, pros, cons, floor_plans, sales_info, 
    status, view_count, created_at
) VALUES
-- 西湖区房源
('660e8400-e29b-41d4-a716-446655440001', '西湖印象花园', 
 'https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg',
 '["https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg", "https://cdn.pixabay.com/photo/2017/03/28/12/10/chairs-2181947_1280.jpg", "https://cdn.pixabay.com/photo/2016/12/30/07/59/kitchen-1940174_1280.jpg"]',
 280.00, '万元', '西湖区', '杭州市西湖区文三路123号西湖印象花园',
 ST_GeomFromText('POINT(120.1551 30.2741)', 4326),
 '["两室一厅", "三室两厅", "四室两厅"]',
 '2024年12月', '["地铁沟通", "学区房", "精装修", "南北通透"]',
 4.5, '绿城集团', '绿城物业', '89-128㎡', 2.5, 35.0, '1:1.2',
 '文三街小学、十三中学区', 
 '位于西湖区核心地段，毗邻西湖风景区，交通便利，配套完善。项目采用现代简约建筑风格，户型设计合理，采光通风良好，是理想的居住选择。周边教育资源丰富，生活配套齐全。',
 '["地铁1号线文三路站", "华润万家超市", "文三街小学", "浙江大学玉泉校区", "西湖文化广场"]',
 '["地理位置优越", "交通便利", "学区房", "精装修交付", "物业管理完善"]',
 '["价格相对较高", "车位紧张"]',
 '[{"type": "两室一厅", "area": "89㎡", "price": "280万", "layout": "客厅朝南，主卧朝南"}, {"type": "三室两厅", "area": "108㎡", "price": "320万", "layout": "南北通透，双阳台设计"}, {"type": "四室两厅", "area": "128㎡", "price": "380万", "layout": "豪华户型，三面采光"}]',
 '{"sales_phone": "0571-88888888", "sales_address": "西湖区文三路123号售楼处", "open_time": "9:00-18:00", "discount": "首付3成，可贷款70%"}',
 'available', 1250, NOW() - INTERVAL '15 days'),

('660e8400-e29b-41d4-a716-446655440002', '钱江新城公寓',
 'https://cdn.pixabay.com/photo/2017/03/19/01/43/living-room-2155376_1280.jpg',
 '["https://cdn.pixabay.com/photo/2017/03/19/01/43/living-room-2155376_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg", "https://cdn.pixabay.com/photo/2017/08/27/10/16/interior-2685521_1280.jpg"]',
 350.00, '万元', '上城区', '杭州市上城区钱江路456号钱江新城公寓',
 ST_GeomFromText('POINT(120.2103 30.2467)', 4326),
 '["一室一厅", "两室一厅", "三室两厅"]',
 '2025年6月', '["江景房", "高层", "现代化", "CBD核心"]',
 4.3, '万科集团', '万科物业', '68-118㎡', 3.0, 30.0, '1:1.5',
 '胜利小学、建兰中学区',
 '钱江新城核心区域，享受城市繁华与钱塘江景美色。项目地处杭州CBD中心，周边金融机构云集，商业配套完善。高层设计，视野开阔，是商务人士的理想选择。',
 '["地铁4号线钱江路站", "万象城购物中心", "胜利小学", "浙江省人民医院", "钱江新城市民中心"]',
 '["CBD核心位置", "江景视野", "商业配套完善", "投资价值高", "交通便利"]',
 '["生活成本较高", "周末人流量大"]',
 '[{"type": "一室一厅", "area": "68㎡", "price": "350万", "layout": "开放式厨房，江景阳台"}, {"type": "两室一厅", "area": "88㎡", "price": "420万", "layout": "主卧朝江，次卧朝南"}, {"type": "三室两厅", "area": "118㎡", "price": "520万", "layout": "豪华江景房，双卫设计"}]',
 '{"sales_phone": "0571-87777777", "sales_address": "上城区钱江路456号售楼处", "open_time": "9:00-19:00", "discount": "VIP客户享95折优惠"}',
 'available', 980, NOW() - INTERVAL '12 days'),

('660e8400-e29b-41d4-a716-446655440003', '滨江科技城',
 'https://cdn.pixabay.com/photo/2016/04/18/08/50/kitchen-1336160_1280.jpg',
 '["https://cdn.pixabay.com/photo/2016/04/18/08/50/kitchen-1336160_1280.jpg", "https://cdn.pixabay.com/photo/2017/08/02/01/01/living-room-2569325_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/30/08/46/living-room-1872192_1280.jpg"]',
 420.00, '万元', '滨江区', '杭州市滨江区江南大道789号滨江科技城',
 ST_GeomFromText('POINT(120.2097 30.1984)', 4326),
 '["三室两厅", "四室两厅", "五室三厅"]',
 '2024年9月', '["科技园区", "配套齐全", "投资价值", "人才公寓"]',
 4.7, '保利地产', '保利物业', '118-168㎡', 2.8, 40.0, '1:1.8',
 '江南实验学校、高新实验学校区',
 '位于滨江高新技术开发区，周边科技企业云集，发展潜力巨大。项目专为科技人才打造，智能化程度高，生活配套完善。毗邻多家知名互联网公司，是科技从业者的首选。',
 '["地铁1号线滨和路站", "星光大道商业街", "江南实验学校", "浙江大学医学院附属儿童医院", "白马湖生态创意城"]',
 '["科技园区核心", "发展潜力大", "智能化社区", "教育资源优质", "生态环境好"]',
 '["距离市中心较远", "周边仍在开发中"]',
 '[{"type": "三室两厅", "area": "118㎡", "price": "420万", "layout": "智能家居，南北通透"}, {"type": "四室两厅", "area": "138㎡", "price": "520万", "layout": "双主卧设计，书房独立"}, {"type": "五室三厅", "area": "168㎡", "price": "680万", "layout": "复式设计，私家花园"}]',
 '{"sales_phone": "0571-86666666", "sales_address": "滨江区江南大道789号售楼处", "open_time": "9:00-18:30", "discount": "科技人才专享优惠政策"}',
 'available', 1580, NOW() - INTERVAL '8 days'),

-- 拱墅区房源
('660e8400-e29b-41d4-a716-446655440004', '运河天地',
 'https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg',
 '["https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/21/16/01/apartment-1846447_1280.jpg"]',
 220.00, '万元', '拱墅区', '杭州市拱墅区大关路321号运河天地',
 ST_GeomFromText('POINT(120.1234 30.3156)', 4326),
 '["两室一厅", "三室一厅", "三室两厅"]',
 '2024年10月', '["运河景观", "文化底蕴", "交通便利", "老城改造"]',
 4.2, '融创中国', '融创物业', '78-108㎡', 2.2, 32.0, '1:1.0',
 '大关小学、大关中学区',
 '坐落于京杭大运河畔，承载着深厚的历史文化底蕴。项目融合现代设计与传统文化，打造宜居宜业的品质社区。周边配套成熟，生活便利。',
 '["地铁2号线大关站", "大关公园", "大关小学", "杭州市第一人民医院", "运河文化广场"]',
 '["历史文化底蕴", "运河景观", "配套成熟", "价格适中", "改善型住房"]',
 '["建筑密度较高", "停车位不足"]',
 '[{"type": "两室一厅", "area": "78㎡", "price": "220万", "layout": "紧凑实用，运河景观"}, {"type": "三室一厅", "area": "95㎡", "price": "280万", "layout": "三代同堂，温馨舒适"}, {"type": "三室两厅", "area": "108㎡", "price": "320万", "layout": "改善户型，双卫配置"}]',
 '{"sales_phone": "0571-85555555", "sales_address": "拱墅区大关路321号售楼处", "open_time": "9:00-18:00", "discount": "老城改造优惠政策"}',
 'available', 760, NOW() - INTERVAL '20 days'),

-- 余杭区房源
('660e8400-e29b-41d4-a716-446655440005', '未来科技城',
 'https://cdn.pixabay.com/photo/2016/12/26/17/28/spur-1932925_1280.jpg',
 '["https://cdn.pixabay.com/photo/2016/12/26/17/28/spur-1932925_1280.jpg", "https://cdn.pixabay.com/photo/2017/01/07/17/48/interior-1961070_1280.jpg"]',
 380.00, '万元', '余杭区', '杭州市余杭区文一西路1000号未来科技城',
 ST_GeomFromText('POINT(120.0234 30.2890)', 4326),
 '["三室两厅", "四室两厅", "别墅"]',
 '2025年3月', '["科技新城", "生态宜居", "配套完善", "发展潜力"]',
 4.6, '龙湖集团', '龙湖物业', '108-200㎡', 2.0, 45.0, '1:2.0',
 '未来科技城第一小学、学军中学海创园学校区',
 '杭州未来科技城核心区域，汇聚阿里巴巴等知名企业。项目规划超前，配套完善，是科技精英的理想家园。生态环境优美，发展前景广阔。',
 '["地铁5号线科技园站", "阿里巴巴总部", "未来科技城第一小学", "浙江大学医学院附属第一医院余杭院区", "梦想小镇"]',
 '["科技产业集聚", "生态环境优美", "配套设施完善", "投资潜力巨大", "国际化社区"]',
 '["距离主城区较远", "房价上涨较快"]',
 '[{"type": "三室两厅", "area": "108㎡", "price": "380万", "layout": "现代简约，智能家居"}, {"type": "四室两厅", "area": "138㎡", "price": "480万", "layout": "豪华装修，双主卧"}, {"type": "别墅", "area": "200㎡", "price": "680万", "layout": "独栋别墅，私家花园"}]',
 '{"sales_phone": "0571-89999999", "sales_address": "余杭区文一西路1000号售楼处", "open_time": "9:00-19:00", "discount": "人才购房补贴政策"}',
 'available', 2100, NOW() - INTERVAL '5 days'),

-- 萧山区房源
('660e8400-e29b-41d4-a716-446655440006', '钱江世纪城',
 'https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg',
 '["https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/30/08/46/living-room-1872192_1280.jpg"]',
 320.00, '万元', '萧山区', '杭州市萧山区市心中路888号钱江世纪城',
 ST_GeomFromText('POINT(120.2567 30.1678)', 4326),
 '["两室两厅", "三室两厅", "四室两厅"]',
 '2024年11月', '["亚运村", "国际化", "配套完善", "交通枢纽"]',
 4.4, '绿地集团', '绿地物业', '88-148㎡', 2.6, 38.0, '1:1.6',
 '萧山区第一实验小学、萧山中学区',
 '杭州亚运会主场馆所在地，国际化程度高。项目享受亚运红利，配套设施一流，交通便利。是体验国际化生活的理想选择。',
 '["地铁7号线奥体中心站", "杭州奥体中心", "萧山区第一实验小学", "浙江大学医学院附属第二医院萧山院区", "钱江世纪公园"]',
 '["亚运场馆配套", "国际化社区", "交通便利", "配套完善", "升值潜力大"]',
 '["新区配套仍在完善", "周边噪音较大"]',
 '[{"type": "两室两厅", "area": "88㎡", "price": "320万", "layout": "双卫设计，南北通透"}, {"type": "三室两厅", "area": "118㎡", "price": "420万", "layout": "主卧套房，观景阳台"}, {"type": "四室两厅", "area": "148㎡", "price": "550万", "layout": "豪华户型，三面采光"}]',
 '{"sales_phone": "0571-82888888", "sales_address": "萧山区市心中路888号售楼处", "open_time": "9:00-18:30", "discount": "亚运纪念版优惠套餐"}',
 'available', 1320, NOW() - INTERVAL '3 days');

-- 插入新闻数据
INSERT INTO news (
    id, title, summary, content, cover_image, category, tags, author, source, 
    view_count, is_featured, status, published_at, created_at
) VALUES
('770e8400-e29b-41d4-a716-446655440001', '杭州保障房政策最新解读',
 '2024年杭州保障房申请条件和流程详细说明，涵盖公租房、经济适用房等多种类型',
 '根据杭州市住房和城乡建设局最新发布的政策文件，2024年杭州市保障房申请条件进一步放宽，申请流程更加便民。\n\n一、申请条件\n1. 具有杭州市区常住户口3年以上，或持有杭州市区居住证3年以上\n2. 家庭人均月收入低于3500元\n3. 家庭人均住房建筑面积低于17平方米\n4. 家庭总资产低于规定标准\n\n二、申请流程\n1. 网上预申请：登录杭州市住房保障管理系统\n2. 材料准备：收入证明、户籍证明、住房情况证明等\n3. 现场申请：到户籍所在地街道办事处提交材料\n4. 审核公示：15个工作日内完成审核并公示\n5. 摇号配租：通过审核后参与摇号\n\n三、保障房类型\n- 公租房：租金为市场价的60-80%\n- 经济适用房：价格为市场价的70-80%\n- 人才专项租赁住房：面向高层次人才\n\n政策的调整体现了杭州市对住房保障工作的重视，为更多住房困难家庭提供了保障。',
 'https://img.ljcdn.com/beike/news/policy-2024-001.jpg',
 '政策解读', '["保障房", "政策解读", "申请条件", "杭州"]',
 '政策研究室', '杭州住建局', 2580, true, 'published', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('770e8400-e29b-41d4-a716-446655440002', '西湖区新增保障房项目开工建设',
 '西湖区计划新建3000套保障房，预计2025年交付使用，将有效缓解区域住房供需矛盾',
 '12月15日上午，西湖区保障房建设项目集中开工仪式在文三路地块举行。本次开工的项目总投资约15亿元，规划建设保障房3000套，包括公租房2000套、经济适用房1000套。\n\n项目特点：\n1. 地理位置优越：位于西湖区核心区域，交通便利\n2. 配套设施完善：规划建设幼儿园、社区服务中心、商业配套\n3. 绿色建筑标准：采用绿色建筑技术，节能环保\n4. 智慧社区管理：配备智能化管理系统\n\n建设进度：\n- 2024年12月：项目开工\n- 2025年6月：主体结构封顶\n- 2025年10月：装修完成\n- 2025年12月：交付使用\n\n申请方式：\n项目建成后将通过杭州市住房保障管理系统进行申请，符合条件的家庭可提前关注相关信息。\n\n区住建局表示，这批保障房的建成将有效缓解西湖区住房供需矛盾，为更多家庭提供安居保障。',
 'https://img.ljcdn.com/beike/news/project-2024-001.jpg',
 '项目动态', '["西湖区", "保障房", "新建项目", "开工"]',
 '记者张明', '杭州日报', 1890, true, 'published', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('770e8400-e29b-41d4-a716-446655440003', '钱江新城人才公寓申请指南',
 '面向高层次人才的专项租赁住房，享受优惠租金和便民服务',
 '钱江新城作为杭州市CBD核心区域，为吸引和留住人才，推出了人才公寓专项政策。\n\n申请对象：\n1. A类人才：国家级领军人才\n2. B类人才：省级领军人才\n3. C类人才：市级领军人才\n4. D类人才：区县级领军人才\n5. E类人才：其他高层次人才\n\n优惠政策：\n- A类人才：免租金3年\n- B类人才：租金减免80%\n- C类人才：租金减免60%\n- D类人才：租金减免40%\n- E类人才：租金减免20%\n\n房源特点：\n- 精装修交付，拎包入住\n- 配套设施完善，生活便利\n- 物业服务优质，管理规范\n- 交通便利，地铁直达\n\n申请流程：\n1. 人才认定：先进行人才等级认定\n2. 在线申请：登录杭州人才网提交申请\n3. 材料审核：提交相关证明材料\n4. 现场看房：预约看房选择房源\n5. 签约入住：签订租赁合同\n\n咨询电话：0571-12345',
 'https://img.ljcdn.com/beike/news/talent-2024-001.jpg',
 '人才政策', '["人才公寓", "钱江新城", "申请指南", "优惠政策"]',
 '人才服务中心', '杭州人才网', 3200, false, 'published', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),

('770e8400-e29b-41d4-a716-446655440004', '滨江区保障房摇号结果公示',
 '本期共有1200户家庭参与摇号，500套房源全部配租完成',
 '12月20日，滨江区2024年第四季度保障房摇号活动圆满结束。本次摇号共有1200户符合条件的家庭参与，500套房源全部配租完成。\n\n摇号情况：\n- 参与家庭：1200户\n- 房源数量：500套\n- 中签率：41.7%\n- 房源类型：公租房400套，经济适用房100套\n\n房源分布：\n1. 滨江科技城项目：200套\n2. 白马湖项目：150套\n3. 长河项目：100套\n4. 浦沿项目：50套\n\n中签家庭须知：\n1. 签约时间：12月25日-12月30日\n2. 签约地点：滨江区住房保障服务中心\n3. 携带材料：身份证、户口本、收入证明等\n4. 逾期未签约视为自动放弃\n\n未中签家庭：\n- 自动进入下期摇号池\n- 可关注其他区域房源信息\n- 继续享受轮候优先权\n\n区住建局提醒，中签家庭应按时签约，未中签家庭不要灰心，后续还会有更多房源推出。',
 'https://img.ljcdn.com/beike/news/lottery-2024-001.jpg',
 '摇号公示', '["滨江区", "保障房", "摇号", "结果公示"]',
 '住保中心', '滨江区住建局', 1650, false, 'published', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),

('770e8400-e29b-41d4-a716-446655440005', '杭州住房租赁市场年度报告',
 '2024年杭州住房租赁市场运行平稳，租金水平保持合理区间',
 '根据杭州市住房租赁管理服务中心发布的年度报告，2024年杭州住房租赁市场整体运行平稳，租金水平保持在合理区间。\n\n市场概况：\n- 租赁房源总量：约50万套\n- 年租赁成交量：约15万套\n- 平均租金：45元/㎡/月\n- 同比增长：3.2%\n\n区域分析：\n1. 西湖区：平均租金52元/㎡/月，需求旺盛\n2. 上城区：平均租金48元/㎡/月，供需平衡\n3. 滨江区：平均租金46元/㎡/月，科技人才聚集\n4. 余杭区：平均租金38元/㎡/月，性价比较高\n5. 萧山区：平均租金35元/㎡/月，发展潜力大\n\n租赁特点：\n- 长租需求增加，平均租期延长至14个月\n- 品质化需求提升，精装房源受欢迎\n- 年轻租客占比70%，以25-35岁为主\n- 合租比例下降，整租需求上升\n\n政策支持：\n- 租购同权政策逐步落实\n- 租赁补贴标准适度提高\n- 租赁平台监管不断完善\n- 租赁纠纷调解机制健全\n\n展望2025年，预计租赁市场将继续保持平稳发展态势。',
 'https://img.ljcdn.com/beike/news/report-2024-001.jpg',
 '市场分析', '["租赁市场", "年度报告", "租金水平", "市场分析"]',
 '市场研究部', '杭州住房租赁中心', 2100, true, 'published', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours');

-- 插入收藏数据
INSERT INTO collections (user_id, house_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '6 hours');

-- 插入浏览历史数据
INSERT INTO browse_history (user_id, house_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- 插入咨询记录数据
INSERT INTO consultations (
    user_id, house_id, type, title, content, contact_phone, contact_name, 
    status, reply_content, replied_at, created_at
) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 
 '房源咨询', '关于西湖印象花园的户型问题', 
 '您好，我想了解一下西湖印象花园的三室两厅户型，具体的布局是怎样的？朝向如何？', 
 '13800138001', '张明', 'replied', 
 '您好！西湖印象花园三室两厅户型面积108㎡，南北通透设计，客厅和主卧朝南，采光充足。具体布局图可以到售楼处查看，欢迎预约看房。', 
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 
 '价格咨询', '钱江新城公寓首付和贷款政策', 
 '请问钱江新城公寓的首付比例是多少？可以申请公积金贷款吗？', 
 '13800138002', '李红', 'replied', 
 '钱江新城公寓首付比例为30%，支持公积金贷款和商业贷款组合。公积金贷款额度根据您的缴存情况确定，建议您到售楼处详细咨询。', 
 NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 day'),

('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 
 '配套咨询', '滨江科技城周边配套设施', 
 '想了解滨江科技城周边的教育和医疗配套情况，孩子上学方便吗？', 
 '13800138003', '王华', 'pending', 
 NULL, NULL, NOW() - INTERVAL '6 hours'),

('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 
 '交通咨询', '运河天地交通出行问题', 
 '运河天地到市中心的交通方便吗？有地铁吗？', 
 '13800138004', '陈美', 'replied', 
 '运河天地交通便利，距离地铁2号线大关站步行约8分钟，到市中心约20分钟车程。周边公交线路丰富，出行很方便。', 
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '8 hours');

-- 插入预约看房数据
INSERT INTO viewing_appointments (
    user_id, house_id, appointment_date, appointment_time, contact_name, 
    contact_phone, visitor_count, special_requirements, status, created_at
) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 
 CURRENT_DATE + INTERVAL '2 days', '14:00:00', '张明', '13800138001', 2, 
 '希望看三室两厅户型，重点了解采光情况', 'confirmed', NOW() - INTERVAL '1 day'),

('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 
 CURRENT_DATE + INTERVAL '1 day', '10:30:00', '李红', '13800138002', 1, 
 '想看江景房，了解具体价格', 'confirmed', NOW() - INTERVAL '2 hours'),

('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', 
 CURRENT_DATE + INTERVAL '3 days', '16:00:00', '王华', '13800138003', 3, 
 '全家看房，需要了解学区情况', 'pending', NOW() - INTERVAL '30 minutes'),

('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 
 CURRENT_DATE + INTERVAL '1 day', '09:00:00', '陈美', '13800138004', 2, 
 '首次购房，需要详细介绍', 'confirmed', NOW() - INTERVAL '4 hours'),

('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', 
 CURRENT_DATE + INTERVAL '4 days', '15:30:00', '刘强', '13800138005', 1, 
 '投资购房，关注升值潜力', 'pending', NOW() - INTERVAL '1 hour');

-- 插入反馈数据
INSERT INTO feedback (
    user_id, type, title, content, contact_info, images, status, 
    reply_content, replied_at, created_at
) VALUES
('550e8400-e29b-41d4-a716-446655440001', '功能建议', '希望增加VR看房功能', 
 '建议在小程序中增加VR看房功能，这样可以更直观地了解房源情况，特别是对于外地客户很有帮助。', 
 '13800138001', '[]', 'replied', 
 '感谢您的建议！我们正在开发VR看房功能，预计下个版本会上线，敬请期待。', 
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days'),

('550e8400-e29b-41d4-a716-446655440002', '问题反馈', '地图定位不准确', 
 '在查看房源位置时，地图定位有偏差，希望能够修复这个问题。', 
 '13800138002', '[]', 'processing', 
 NULL, NULL, NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655440003', '服务评价', '客服响应及时，服务态度好', 
 '咨询房源信息时，客服回复很及时，态度也很好，给个好评！', 
 'wanghua@email.com', '[]', 'closed', 
 '谢谢您的好评！我们会继续努力提供更好的服务。', 
 NOW() - INTERVAL '6 hours', NOW() - INTERVAL '1 day'),

('550e8400-e29b-41d4-a716-446655440004', 'bug反馈', '收藏功能异常', 
 '在收藏房源时偶尔会出现失败的情况，刷新后又正常了。', 
 '13800138004', '[]', 'pending', 
 NULL, NULL, NOW() - INTERVAL '4 hours');

-- 插入2025年杭州最新保障房数据
INSERT INTO houses (
    id, name, cover_image, images, price, price_unit, area, address, location, 
    house_types, delivery_time, tags, rating, developer, property_company, 
    building_area, plot_ratio, green_rate, parking_ratio, school_district, 
    description, nearby_facilities, pros, cons, floor_plans, sales_info, 
    status, view_count, created_at
) VALUES
-- 笕桥保障房项目
('770e8400-e29b-41d4-a716-446655440001', '笕桥生态公园保障房',
 'https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg',
 '["https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg", "https://cdn.pixabay.com/photo/2017/03/28/12/10/chairs-2181947_1280.jpg"]',
 16500.00, '元/㎡', '江干区', '杭州市江干区笕桥生态公园单元JG0701-R21-02地块',
 ST_GeomFromText('POINT(120.2456 30.3123)', 4326),
 '["75㎡三房", "95㎡三房", "125㎡四房"]',
 '2024年10月', '["保障房", "人才房", "配售型", "生态公园"]',
 4.2, '杭州市住保房管局', '绿城物业', '75-125㎡', 2.8, 40.0, '1:1.0',
 '笕桥小学、笕桥中学',
 '笕桥生态公园保障性住房项目，面向杭州市户籍无房家庭和各类人才。项目位于笕桥生态公园旁，环境优美，配套完善。售价约为同地段商品房50%，是刚需家庭的理想选择。首开9幢620套房源。',
 '["笕桥生态公园", "地铁1号线延伸段", "笕桥小学", "笕桥中学", "笕桥农贸市场"]',
 '["保障房政策", "价格优惠", "环境优美", "配套完善", "人才优先"]',
 '["申请条件严格", "房源有限"]',
 '[{"type": "75㎡三房", "area": "75㎡", "price": "123.75万", "layout": "三室一厅一卫", "count": 360}, {"type": "95㎡三房", "area": "95㎡", "price": "156.75万", "layout": "三室两厅一卫", "count": 234}, {"type": "125㎡四房", "area": "125㎡", "price": "206.25万", "layout": "四室两厅两卫", "count": 26}]',
 '{"sales_phone": "0571-87654321", "sales_address": "江干区笕桥生态公园售楼处", "open_time": "9:00-17:00", "application_condition": "杭州户籍无房家庭或各类人才"}',
 'available', 890, NOW() - INTERVAL '5 days'),

-- 桃源保障房项目
('770e8400-e29b-41d4-a716-446655440002', '桃源保障房项目',
 'https://cdn.pixabay.com/photo/2016/11/29/03/53/house-1867187_1280.jpg',
 '["https://cdn.pixabay.com/photo/2016/11/29/03/53/house-1867187_1280.jpg", "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg", "https://cdn.pixabay.com/photo/2016/12/30/07/59/kitchen-1940174_1280.jpg"]',
 18000.00, '元/㎡', '拱墅区', '杭州市拱墅区桃源街道保障房项目',
 ST_GeomFromText('POINT(120.1234 30.3456)', 4326),
 '["70㎡两房", "90㎡三房", "120㎡四房"]',
 '2025年3月', '["保障房", "人才房", "地铁沟通", "配套完善"]',
 4.1, '杭州市住保房管局', '绿城物业', '70-120㎡', 2.5, 35.0, '1:1.2',
 '卖鱼桥小学、桃源中学',
 '桃源保障房项目位于拱墅区核心区域，地铁4号线约500米，三纵两横高架快速路网。周边配套完善，教育资源丰富，是人才安居的理想选择。',
 '["地铁4号线", "城北万象城", "拱墅宝龙广场", "卖鱼桥小学", "桃源中学", "西湖大学附属杭州市第一人民医院城北院区"]',
 '["地铁便利", "配套完善", "教育资源丰富", "医疗便民", "人才优先"]',
 '["竞争激烈", "申请周期长"]',
 '[{"type": "70㎡两房", "area": "70㎡", "price": "126万", "layout": "两室一厅一卫", "count": 200}, {"type": "90㎡三房", "area": "90㎡", "price": "162万", "layout": "三室两厅一卫", "count": 300}, {"type": "120㎡四房", "area": "120㎡", "price": "216万", "layout": "四室两厅两卫", "count": 100}]',
 '{"sales_phone": "0571-87654322", "sales_address": "拱墅区桃源街道售楼处", "open_time": "9:00-17:00", "application_condition": "杭州户籍无房家庭或ABCDEF类人才"}',
 'available', 756, NOW() - INTERVAL '3 days'),

-- 临平保障房项目
('770e8400-e29b-41d4-a716-446655440003', '临平人才保障房',
 'https://cdn.pixabay.com/photo/2017/03/19/01/43/living-room-2155376_1280.jpg',
 '["https://cdn.pixabay.com/photo/2017/03/19/01/43/living-room-2155376_1280.jpg", "https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg", "https://cdn.pixabay.com/photo/2017/08/27/10/16/interior-2685521_1280.jpg"]',
 14000.00, '元/㎡', '临平区', '杭州市临平区人才保障房项目',
 ST_GeomFromText('POINT(120.2987 30.4123)', 4326),
 '["75㎡两房", "90㎡三房", "110㎡四房"]',
 '2025年6月', '["保障房", "人才房", "新城区", "配套齐全"]',
 4.0, '杭州市住保房管局', '万科物业', '75-110㎡', 2.2, 38.0, '1:1.3',
 '临平一小、临平中学',
 '临平人才保障房项目位于临平新城核心区域，面向各类人才提供优质住房保障。项目周边配套完善，交通便利，是人才安居乐业的理想选择。',
 '["地铁1号线临平站", "临平新天地", "临平一小", "临平中学", "临平人民医院"]',
 '["价格实惠", "人才专享", "新城配套", "交通便利", "环境优美"]',
 '["距离市中心较远", "周边商业待完善"]',
 '[{"type": "75㎡两房", "area": "75㎡", "price": "105万", "layout": "两室一厅一卫", "count": 150}, {"type": "90㎡三房", "area": "90㎡", "price": "126万", "layout": "三室两厅一卫", "count": 250}, {"type": "110㎡四房", "area": "110㎡", "price": "154万", "layout": "四室两厅两卫", "count": 100}]',
 '{"sales_phone": "0571-87654323", "sales_address": "临平区人才服务中心", "open_time": "9:00-17:00", "application_condition": "ABCDEF类人才，连续缴纳6个月社保"}',
 'available', 623, NOW() - INTERVAL '7 days');

-- 更新房源浏览量（模拟真实浏览数据）
UPDATE houses SET view_count = view_count + FLOOR(RANDOM() * 100) + 50;

-- 提交事务
COMMIT;