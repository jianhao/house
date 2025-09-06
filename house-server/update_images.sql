-- 更新房源封面图片为有效的Unsplash链接
UPDATE houses SET cover_image = CASE 
    WHEN name = '西湖印象花园' THEN 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
    WHEN name = '钱江新城公寓' THEN 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' 
    WHEN name = '滨江科技城' THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'
    ELSE cover_image
END;

-- 验证更新结果
SELECT name, cover_image FROM houses WHERE name IN ('西湖印象花园', '钱江新城公寓', '滨江科技城');