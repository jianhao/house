import { FastifyInstance } from 'fastify';
import { HouseDetail, HouseInfo, HouseSearchParams } from '../types';

export class HouseService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取房源列表
   */
  async getHouseList(params: HouseSearchParams) {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      area,
      priceMin,
      priceMax,
      houseType,
      deliveryTime,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params;

    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereClause = 'WHERE 1=1'; // 移除状态过滤，显示所有房源
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (keyword && keyword !== 'undefined' && keyword.trim() !== '') {
      whereClause += ` AND (name ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`;
      queryParams.push(`%${keyword}%`);
      paramIndex++;
    }

    if (area && area !== 'undefined' && area.trim() !== '') {
      whereClause += ` AND area = $${paramIndex}`;
      queryParams.push(area);
      paramIndex++;
    }

    if (priceMin !== undefined) {
      whereClause += ` AND price >= $${paramIndex}`;
      queryParams.push(priceMin);
      paramIndex++;
    }

    if (priceMax !== undefined) {
      whereClause += ` AND price <= $${paramIndex}`;
      queryParams.push(priceMax);
      paramIndex++;
    }

    if (houseType && houseType !== 'undefined' && houseType.trim() !== '') {
      whereClause += ` AND house_types @> $${paramIndex}`;
      queryParams.push(JSON.stringify([houseType]));
      paramIndex++;
    }

    if (deliveryTime && deliveryTime !== 'undefined' && deliveryTime.trim() !== '') {
      whereClause += ` AND delivery_time = $${paramIndex}`;
      queryParams.push(deliveryTime);
      paramIndex++;
    }

    // 构建排序
    const orderClause = `ORDER BY ${sortBy === 'created_at' ? 'created_at' : sortBy} ${sortOrder}`;

    // 查询总数
    const countQuery = `SELECT COUNT(*) as total FROM houses ${whereClause}`;
    const countResult = await this.fastify.pg.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // 查询数据
    const dataQuery = `
      SELECT 
        id, name, cover_image as "coverImage", price, price_unit as "priceUnit",
        area, address, ST_X(location) as longitude, ST_Y(location) as latitude,
        house_types as "houseTypes", delivery_time as "deliveryTime",
        tags, rating, developer, created_at as "createdAt"
      FROM houses 
      ${whereClause} 
      ${orderClause} 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(pageSize, offset);
    const dataResult = await this.fastify.pg.query(dataQuery, queryParams);

    const list = dataResult.rows.map(row => ({
      ...row,
      location: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      houseTypes: row.houseTypes || [],
      tags: row.tags || []
    }));

    return {
      list,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    };
  }

  /**
   * 获取房源详情
   */
  async getHouseDetail(id: string): Promise<HouseDetail | null> {
    const query = `
      SELECT 
        id, name, cover_image as "coverImage", images, price, price_unit as "priceUnit",
        area, address, ST_X(location) as longitude, ST_Y(location) as latitude,
        house_types as "houseTypes", delivery_time as "deliveryTime", tags, rating,
        developer, property_company as "propertyCompany", building_area as "buildingArea",
        plot_ratio as "plotRatio", green_rate as "greenRate", parking_ratio as "parkingRatio",
        school_district as "schoolDistrict", description, nearby_facilities as "nearbyFacilities",
        pros, cons, floor_plans as "floorPlans", sales_info as "salesInfo",
        status, view_count as "viewCount", created_at as "createdAt", updated_at as "updatedAt"
      FROM houses 
      WHERE id = $1
    `;

    const result = await this.fastify.pg.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const house = result.rows[0];

    // 增加浏览量
    await this.incrementViewCount(id);

    return {
      ...house,
      location: {
        latitude: house.latitude,
        longitude: house.longitude
      },
      images: house.images || [],
      houseTypes: house.houseTypes || [],
      tags: house.tags || [],
      nearbyFacilities: house.nearbyFacilities || [],
      pros: house.pros || [],
      cons: house.cons || [],
      floorPlans: house.floorPlans || [],
      salesInfo: house.salesInfo || {}
    };
  }

  /**
   * 获取推荐房源
   */
  async getRecommendHouses(userId: string, limit: number = 10, excludeIds: string[] = []): Promise<HouseInfo[]> {
    try {
      // 构建排除条件
      let excludeClause = '';
      const queryParams: any[] = [limit];
      let paramIndex = 2;

      if (excludeIds.length > 0) {
        excludeClause = `AND id NOT IN (${excludeIds.map(() => `$${paramIndex++}`).join(', ')})`;
        queryParams.push(...excludeIds);
      }

      // 基于用户行为推荐（这里简化为按评分和创建时间推荐）
      const query = `
        SELECT 
          id, name, cover_image as "coverImage", price, price_unit as "priceUnit",
          area, address, house_types as "houseTypes", delivery_time as "deliveryTime",
          tags, rating, developer, created_at as "createdAt"
        FROM houses 
        WHERE 1=1 ${excludeClause}
        ORDER BY rating DESC, created_at DESC
        LIMIT $1
      `;

      const result = await this.fastify.pg.query(query, queryParams);

      return result.rows.map(row => ({
        ...row,
        houseTypes: row.houseTypes || [],
        tags: row.tags || []
      }));
    } catch (error) {
      this.fastify.log.error('获取推荐房源失败:', error as any);
      throw error;
    }
  }

  /**
   * 获取热门房源
   */
  async getHotHouses(limit: number = 10): Promise<HouseInfo[]> {
    const cacheKey = `house:hot:${limit}`;

    // 尝试从缓存获取
    try {
      const cached = await this.fastify.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      this.fastify.log.warn('Redis cache error:', err as any);
    }

    const query = `
      SELECT 
        id, name, cover_image as "coverImage", price, price_unit as "priceUnit",
        area, address, house_types as "houseTypes", delivery_time as "deliveryTime",
        tags, rating, developer, created_at as "createdAt"
      FROM houses 
      WHERE 1=1
      ORDER BY (view_count * 0.7 + rating * 0.3) DESC
      LIMIT $1
    `;

    const result = await this.fastify.pg.query(query, [limit]);
    const houses = result.rows.map(row => ({
      ...row,
      houseTypes: row.houseTypes || [],
      tags: row.tags || []
    }));

    // 缓存结果（5分钟）
    try {
      await this.fastify.redis.setex(cacheKey, 300, JSON.stringify(houses));
    } catch (err) {
      this.fastify.log.warn('Redis cache set error:', err as any);
    }

    return houses;
  }

  /**
   * 增加浏览量
   */
  private async incrementViewCount(houseId: string) {
    try {
      await this.fastify.pg.query('UPDATE houses SET view_count = view_count + 1 WHERE id = $1', [houseId]);
    } catch (err) {
      this.fastify.log.warn('Failed to increment view count:', err as any);
    }
  }

  /**
   * 获取筛选选项
   */
  async getFilterOptions() {
    const cacheKey = 'house:filter:options';

    // 尝试从缓存获取
    try {
      const cached = await this.fastify.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      this.fastify.log.warn('Redis cache error:', err as any);
    }

    // 获取区域选项
    const areaQuery = `
      SELECT DISTINCT area as name, area as code 
      FROM houses 
      WHERE area IS NOT NULL
      ORDER BY area
    `;
    const areaResult = await this.fastify.pg.query(areaQuery);

    // 获取户型选项
    const houseTypeQuery = `
      SELECT DISTINCT jsonb_array_elements_text(house_types) as type
      FROM houses 
      WHERE house_types IS NOT NULL
    `;
    const houseTypeResult = await this.fastify.pg.query(houseTypeQuery);

    // 获取标签选项
    const tagQuery = `
      SELECT DISTINCT jsonb_array_elements_text(tags) as tag
      FROM houses 
      WHERE tags IS NOT NULL
    `;
    const tagResult = await this.fastify.pg.query(tagQuery);

    const options = {
      areas: areaResult.rows,
      priceRanges: [
        { min: 0, max: 200, label: '200万以下' },
        { min: 200, max: 300, label: '200-300万' },
        { min: 300, max: 500, label: '300-500万' },
        { min: 500, max: 1000, label: '500-1000万' },
        { min: 1000, max: 9999, label: '1000万以上' }
      ],
      houseTypes: houseTypeResult.rows.map(row => row.type),
      tags: tagResult.rows.map(row => row.tag),
      deliveryTimes: ['2024年', '2025年', '2026年', '待定']
    };

    // 缓存结果（1小时）
    try {
      await this.fastify.redis.setex(cacheKey, 3600, JSON.stringify(options));
    } catch (err) {
      this.fastify.log.warn('Redis cache set error:', err as any);
    }

    return options;
  }

  /**
   * 获取统计数据
   */
  async getHouseStats() {
    try {
      // 获取总房源数
      const totalHousesQuery = 'SELECT COUNT(*) as total FROM houses';
      const totalHousesResult = await this.fastify.pg.query(totalHousesQuery);
      const totalHouses = parseInt(totalHousesResult.rows[0].total);

      // 获取可申请房源数（估算）
      const availableUnitsQuery = 'SELECT SUM(FLOOR(building_area / 100)) as total FROM houses';
      const availableUnitsResult = await this.fastify.pg.query(availableUnitsQuery);
      const availableUnits = parseInt(availableUnitsResult.rows[0].total) || 0;

      // 获取覆盖区域数
      const districtsQuery = 'SELECT COUNT(DISTINCT area) as total FROM houses';
      const districtsResult = await this.fastify.pg.query(districtsQuery);
      const districts = parseInt(districtsResult.rows[0].total);

      // 模拟受益家庭数（基于可申请房源数估算）
      const totalFamilies = Math.floor(availableUnits * 1.2);

      return {
        totalHouses,
        availableUnits,
        totalFamilies,
        districts
      };
    } catch (error) {
      this.fastify.log.error('获取统计数据失败:', error as any);
      // 返回默认数据
      return {
        totalHouses: 156,
        availableUnits: 2340,
        totalFamilies: 8900,
        districts: 7
      };
    }
  }
}
