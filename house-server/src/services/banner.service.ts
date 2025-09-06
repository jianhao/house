import { FastifyInstance } from 'fastify';
import { Banner } from '../types/index';

export class BannerService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * 获取轮播图列表
   */
  async getBannerList(): Promise<Banner[]> {
    try {
      // 模拟轮播图数据
      const banners: Banner[] = [
        {
          id: 1,
          title: '杭州保障房信息网',
          subtitle: '为您提供最新、最全面的保障房信息服务',
          image: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/house-1867187_1280.jpg',
          link: '/houses',
          order: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: '安居乐业',
          subtitle: '让每个家庭都有温暖的家',
          image: 'https://cdn.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg',
          link: '/houses',
          order: 2,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          title: '品质生活',
          subtitle: '优质保障房，美好新生活',
          image: 'https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg',
          link: '/houses',
          order: 3,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // 只返回激活状态的轮播图，按order排序
      return banners.filter(banner => banner.status === 'active').sort((a, b) => a.order - b.order);
    } catch (error) {
      this.fastify.log.error('获取轮播图列表失败:', error as any);
      throw error;
    }
  }
}