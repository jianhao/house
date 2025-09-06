-- 创建政策表
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 申请条件、申请流程、租金补贴、常见问题等
    cover_image TEXT,
    tags JSONB DEFAULT '[]',
    author VARCHAR(100),
    source VARCHAR(100),
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_policies_category ON policies(category);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_published_at ON policies(published_at);

-- 插入政策数据
INSERT INTO policies (
    title, summary, content, category, author, source, is_featured, published_at
) VALUES 
(
    '杭州市保障房申请条件详解',
    '2024年最新杭州市保障房申请条件，包括户籍、收入、住房等要求',
    '根据《杭州市保障性住房配售管理办法（试行）》，申请保障性住房需满足以下条件：\n\n一、基本条件\n1. 主申请人具有杭州市区户籍3年以上，或持有杭州市区居住证3年以上\n2. 申请家庭3年内在杭州市区无房\n3. 家庭人均月收入低于3500元（单身申请人月收入低于4200元）\n4. 家庭总资产低于规定标准\n\n二、户籍条件\n- 主申请人及共同申请人应具有杭州市区常住户口3年以上\n- 或持有杭州市区居住证3年以上，且在杭州市区连续缴纳社会保险或个人所得税3年以上\n\n三、住房条件\n- 申请家庭在杭州市区范围内无自有住房\n- 未享受过其他住房保障政策\n- 家庭人均住房建筑面积低于17平方米\n\n四、收入条件\n- 家庭人均月收入低于杭州市上年度城镇居民人均可支配收入的60%\n- 单身申请人月收入标准可适当放宽\n\n五、资产条件\n- 家庭总资产低于规定标准\n- 不得拥有机动车（残疾人功能性补偿代步机动车除外）\n\n六、特殊情况\n- 新就业大学生、外来务工人员等群体可适当放宽条件\n- 人才引进对象按相关政策执行',
    '申请条件',
    '杭州市住保房管局',
    '杭州市人民政府',
    true,
    NOW()
),
(
    '保障房申请流程指南',
    '详细介绍杭州市保障房申请的完整流程，从准备材料到最终入住',
    '杭州市保障房申请流程如下：\n\n第一步：准备申请材料\n1. 《杭州市保障性住房申请表》\n2. 申请人及家庭成员身份证、户口簿\n3. 婚姻状况证明\n4. 收入证明（工资单、税单等）\n5. 住房情况证明\n6. 其他相关证明材料\n\n第二步：网上预申请\n1. 登录杭州市住房保障管理系统\n2. 填写基本信息\n3. 上传相关材料\n4. 提交预申请\n\n第三步：现场申请\n1. 携带原件到户籍所在地街道办事处\n2. 工作人员审核材料\n3. 签字确认申请信息\n4. 领取受理回执\n\n第四步：审核公示\n1. 街道初审（5个工作日）\n2. 区级复审（10个工作日）\n3. 公示审核结果（7个工作日）\n4. 异议处理\n\n第五步：摇号配租\n1. 通过审核后进入摇号库\n2. 参与定期摇号\n3. 中签后选房\n4. 签订租赁合同\n\n第六步：入住管理\n1. 办理入住手续\n2. 缴纳租金和押金\n3. 定期复核资格\n4. 遵守管理规定\n\n注意事项：\n- 申请材料必须真实有效\n- 及时关注审核进度\n- 保持联系方式畅通\n- 如有变化及时更新信息',
    '申请流程',
    '杭州市住保房管局',
    '杭州市人民政府',
    true,
    NOW()
),
(
    '租金补贴政策说明',
    '杭州市保障房租金补贴标准、申请条件和发放方式详细说明',
    '杭州市保障房租金补贴政策：\n\n一、补贴标准\n1. 一人户：每月补贴800元\n2. 二人户：每月补贴1000元\n3. 三人户：每月补贴1200元\n4. 四人及以上户：每月补贴1400元\n\n二、申请条件\n1. 符合保障房申请基本条件\n2. 选择货币化保障方式\n3. 在市场上租赁住房\n4. 签订正式租赁合同\n\n三、申请材料\n1. 租金补贴申请表\n2. 房屋租赁合同\n3. 租金缴费凭证\n4. 银行账户信息\n\n四、发放方式\n1. 按季度发放\n2. 直接转入申请人银行账户\n3. 发放期限最长5年\n\n五、管理要求\n1. 定期核查租赁情况\n2. 如实报告家庭变化\n3. 不得转租或空置\n4. 违规将停发补贴',
    '租金补贴',
    '杭州市住保房管局',
    '杭州市人民政府',
    false,
    NOW()
),
(
    '保障房常见问题解答',
    '汇总整理杭州市保障房申请和管理过程中的常见问题及解答',
    '杭州市保障房常见问题解答：\n\nQ1：申请保障房需要什么条件？\nA1：需要满足户籍、收入、住房、资产等多项条件，具体请参考申请条件详解。\n\nQ2：申请流程需要多长时间？\nA2：从提交申请到审核完成一般需要20个工作日，摇号配租时间根据房源情况而定。\n\nQ3：可以同时申请多种保障房吗？\nA3：不可以，每个家庭只能选择一种保障方式。\n\nQ4：租金如何计算？\nA4：公租房租金为市场价的60-80%，具体根据地段和房型确定。\n\nQ5：保障房可以买卖吗？\nA5：公租房只租不售，经济适用房有限制条件下可以上市交易。\n\nQ6：家庭情况发生变化怎么办？\nA6：应及时向管理部门报告，根据新情况调整保障方式。\n\nQ7：如何查询申请进度？\nA7：可通过杭州市住房保障管理系统或电话查询。\n\nQ8：对审核结果有异议怎么办？\nA8：可在公示期内向相关部门提出异议申请。\n\nQ9：保障房可以装修吗？\nA9：可以进行简单装修，但不得改变房屋结构。\n\nQ10：违规使用保障房有什么后果？\nA10：将被取消保障资格，收回住房，并记入诚信档案。',
    '常见问题',
    '杭州市住保房管局',
    '杭州市人民政府',
    false,
    NOW()
);

-- 创建更新时间戳触发器
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();