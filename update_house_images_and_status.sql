-- 更新房源图片和状态信息 - 使用稳定的公共图床链接
BEGIN;

-- 定义楼盘阶段状态：
-- 'planning' - 规划中
-- 'design' - 设计中  
-- 'construction' - 建设中
-- 'pre_sale' - 待开盘
-- 'selling' - 销售中
-- 'delivered' - 已交付
-- 'sold_out' - 已售罄

-- 更新房源图片为稳定可访问的Unsplash图片链接，并设置楼盘阶段状态
UPDATE houses SET 
    cover_image = CASE 
        WHEN id = '660e8400-e29b-41d4-a716-446655440001' THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440002' THEN 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440003' THEN 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440004' THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440005' THEN 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440006' THEN 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440007' THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440008' THEN 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440009' THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440010' THEN 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440011' THEN 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440012' THEN 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440013' THEN 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440014' THEN 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440015' THEN 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440016' THEN 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440017' THEN 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440018' THEN 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440019' THEN 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
        WHEN id = '660e8400-e29b-41d4-a716-446655440020' THEN 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
        ELSE cover_image
    END,
    images = CASE 
        WHEN id = '660e8400-e29b-41d4-a716-446655440001' THEN '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440002' THEN '["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440003' THEN '["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440004' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/768c0fba0b44ee409d416d6d40f62106/spectrum/1040g34o31cn04krlgc0g5o02dvd08b23e82iiso!nd_dft_wlteh_webp_3", "https://sns-webpic-qc.xhscdn.com/202508311422/82bf5c5959a8689b5a7c6fe214d80507/spectrum/1040g34o31clu6slb0c805o02dvd08b23nqf5g68!nd_dft_wlteh_webp_3", "https://sns-webpic-qc.xhscdn.com/202508311422/c9e602baa46952588c325f7140d07f36/spectrum/1040g34o31clu6slb0c8g5o02dvd08b23q0id40g!nd_dft_wlteh_webp_3"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440005' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/5ce2e3b1fea81d12f9336a49faa2f574/spectrum/1040g34o31clu6slb0c6g5o02dvd08b23cj218cg!nd_dft_wlteh_webp_3", "https://sns-webpic-qc.xhscdn.com/202508311422/4ebb718c5f0a0d199ca8d7840360e13b/spectrum/1040g34o31clu6slb0c905o02dvd08b23d9v7mb8!nd_dft_wlteh_webp_3", "https://sns-webpic-qc.xhscdn.com/202508311422/71c1ba4d5308c20e758cc21404089ab5/spectrum/1040g34o31clu6slb0c9g5o02dvd08b231dda3v8!nd_dft_wlteh_webp_3"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440006' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/e32c0b6bc6fc0c1d3c2572a01d9fea27/spectrum/1040g34o31clu6slb0c705o02dvd08b23rj8efvg!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440007' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/4f6d8bc21436aca1d473f633feb06ee1/spectrum/1040g34o31clu6slb0c7g5o02dvd08b2342fusbo!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440008' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/82bf5c5959a8689b5a7c6fe214d80507/spectrum/1040g34o31clu6slb0c805o02dvd08b23nqf5g68!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80", "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440009' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/c9e602baa46952588c325f7140d07f36/spectrum/1040g34o31clu6slb0c8g5o02dvd08b23q0id40g!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440010' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/4ebb718c5f0a0d199ca8d7840360e13b/spectrum/1040g34o31clu6slb0c905o02dvd08b23d9v7mb8!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440011' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/71c1ba4d5308c20e758cc21404089ab5/spectrum/1040g34o31clu6slb0c9g5o02dvd08b231dda3v8!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"]'
        WHEN id = '660e8400-e29b-41d4-a716-446655440012' THEN '["https://sns-webpic-qc.xhscdn.com/202508311422/39d97fc691cdb399b3b848ff64a19852/spectrum/1040g34o31clu6slb0ca05o02dvd08b231okban8!nd_dft_wlteh_webp_3", "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&q=80", "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80"]'
        ELSE images
    END,
    status = CASE 
        WHEN name LIKE '%施工中%' OR description LIKE '%施工中%' THEN 'construction'
        WHEN name LIKE '%开工%' OR description LIKE '%开工%' THEN 'construction'
        WHEN name LIKE '%招标%' OR description LIKE '%招标%' THEN 'design'
        WHEN name LIKE '%设计%' OR description LIKE '%设计%' THEN 'design'
        WHEN delivery_time LIKE '%月%' AND delivery_time NOT LIKE '%年%' THEN 'pre_sale'
        WHEN delivery_time > '2025-12-31' THEN 'construction'
        ELSE 'selling'
    END
WHERE id IN (
    '660e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440007',
    '660e8400-e29b-41d4-a716-446655440008',
    '660e8400-e29b-41d4-a716-446655440009',
    '660e8400-e29b-41d4-a716-446655440010',
    '660e8400-e29b-41d4-a716-446655440011',
    '660e8400-e29b-41d4-a716-446655440012',
    '660e8400-e29b-41d4-a716-446655440013',
    '660e8400-e29b-41d4-a716-446655440014',
    '660e8400-e29b-41d4-a716-446655440015',
    '660e8400-e29b-41d4-a716-446655440016',
    '660e8400-e29b-41d4-a716-446655440017',
    '660e8400-e29b-41d4-a716-446655440018',
    '660e8400-e29b-41d4-a716-446655440019',
    '660e8400-e29b-41d4-a716-446655440020'
);

-- 验证更新结果
SELECT name, cover_image, status FROM houses LIMIT 10;

COMMIT;