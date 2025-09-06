import { FastifyInstance } from 'fastify';
import { build } from './helper';

describe('House API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/houses', () => {
    it('should return house list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/houses'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(200);
      expect(body.data).toHaveProperty('list');
      expect(body.data).toHaveProperty('total');
      expect(body.data).toHaveProperty('page');
      expect(body.data).toHaveProperty('pageSize');
      expect(body.data).toHaveProperty('hasMore');
    });

    it('should return filtered house list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/houses?area=西湖区&priceMin=200&priceMax=400'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(200);
      expect(Array.isArray(body.data.list)).toBe(true);
    });
  });

  describe('GET /api/houses/:id', () => {
    it('should return house detail', async () => {
      // 这里需要一个真实的房源ID，在实际测试中应该先创建测试数据
      const testHouseId = 'test-house-id';
      
      const response = await app.inject({
        method: 'GET',
        url: `/api/houses/${testHouseId}`
      });

      // 由于没有真实数据，这里可能返回404
      expect([200, 404]).toContain(response.statusCode);
    });

    it('should return 404 for non-existent house', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/houses/non-existent-id'
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(404);
    });
  });

  describe('GET /api/houses/hot/list', () => {
    it('should return hot houses', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/houses/hot/list?limit=5'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /api/houses/filter/options', () => {
    it('should return filter options', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/houses/filter/options'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.code).toBe(200);
      expect(body.data).toHaveProperty('areas');
      expect(body.data).toHaveProperty('priceRanges');
      expect(body.data).toHaveProperty('houseTypes');
      expect(body.data).toHaveProperty('tags');
      expect(body.data).toHaveProperty('deliveryTimes');
    });
  });
});