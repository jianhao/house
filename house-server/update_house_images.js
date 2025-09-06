const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 数据库配置
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'house_db',
  user: 'postgres',
  password: 'password'
});

async function updateHouseImages() {
  try {
    await client.connect();
    console.log('已连接到数据库');

    // 更新房源封面图片
    const updateQuery = `
      UPDATE houses SET cover_image = CASE 
        WHEN name = '西湖印象花园' THEN 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
        WHEN name = '钱江新城公寓' THEN 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' 
        WHEN name = '滨江科技城' THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'
        ELSE cover_image
      END
      WHERE name IN ('西湖印象花园', '钱江新城公寓', '滨江科技城');
    `;

    const result = await client.query(updateQuery);
    console.log(`已更新 ${result.rowCount} 条房源记录`);

    // 验证更新结果
    const selectQuery = `
      SELECT name, cover_image FROM houses 
      WHERE name IN ('西湖印象花园', '钱江新城公寓', '滨江科技城')
      ORDER BY name;
    `;

    const selectResult = await client.query(selectQuery);
    console.log('\n更新后的房源信息:');
    selectResult.rows.forEach(row => {
      console.log(`${row.name}: ${row.cover_image}`);
    });

  } catch (error) {
    console.error('更新失败:', error);
  } finally {
    await client.end();
    console.log('\n数据库连接已关闭');
  }
}

// 执行更新
updateHouseImages();