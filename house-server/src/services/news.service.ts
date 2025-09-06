import { FastifyInstance } from 'fastify';

export interface NewsCategory {
  id: string;
  name: string;
  code: string;
  sort: number;
}

export interface NewsInfo {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: NewsCategory;
  author: string;
  publishTime: string;
  readCount: number;
  isTop: boolean;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsSearchParams {
  keyword?: string;
  categoryId?: string;
  isTop?: boolean;
  page?: number;
  pageSize?: number;
}

export class NewsService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 获取资讯分类
   */
  async getCategories(): Promise<NewsCategory[]> {
    // 返回模拟数据，实际项目中应该从数据库获取
    return [
      { id: '1', name: '政策解读', code: 'policy', sort: 1 },
      { id: '2', name: '楼市动态', code: 'market', sort: 2 },
      { id: '3', name: '购房指南', code: 'guide', sort: 3 },
      { id: '4', name: '保障房资讯', code: 'affordable', sort: 4 },
      { id: '5', name: '通知公告', code: 'notice', sort: 5 }
    ];
  }

  /**
   * 获取资讯列表
   */
  async getNewsList(params: NewsSearchParams) {
    const { page = 1, pageSize = 10, keyword, categoryId, isTop } = params;

    // 模拟数据，实际项目中应该从数据库查询
    const mockNews: NewsInfo[] = [
      {
        id: '1',
        title: '杭州市2024年保障房申请政策解读',
        summary: '详细解读杭州市最新保障房申请条件、流程及注意事项',
        content: '杭州市住房保障和房产管理局发布最新保障房申请政策...',
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
        category: { id: '1', name: '政策解读', code: 'policy', sort: 1 },
        author: '杭州住保房管局',
        publishTime: '2024-01-15 10:00:00',
        readCount: 1250,
        isTop: true,
        status: 'published',
        tags: ['保障房', '政策', '申请'],
        createdAt: '2024-01-15 10:00:00',
        updatedAt: '2024-01-15 10:00:00'
      },
      {
        id: '2',
        title: '滨江区新增保障房项目开工建设',
        summary: '滨江区今年将新增3个保障房项目，预计提供房源2000套',
        content: '记者从滨江区住建局获悉，今年滨江区将新增3个保障房项目...',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
        category: { id: '4', name: '保障房资讯', code: 'affordable', sort: 4 },
        author: '杭州日报',
        publishTime: '2024-01-14 14:30:00',
        readCount: 890,
        isTop: false,
        status: 'published',
        tags: ['滨江区', '保障房', '新项目'],
        createdAt: '2024-01-14 14:30:00',
        updatedAt: '2024-01-14 14:30:00'
      },
      {
        id: '3',
        title: '购房指南：如何选择适合的保障房',
        summary: '专业指导如何根据自身需求选择合适的保障房类型和位置',
        content: '选择保障房时需要考虑多个因素，包括地理位置、交通便利性...',
        coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        category: { id: '3', name: '购房指南', code: 'guide', sort: 3 },
        author: '房产专家',
        publishTime: '2024-01-13 16:20:00',
        readCount: 650,
        isTop: false,
        status: 'published',
        tags: ['购房指南', '选房技巧'],
        createdAt: '2024-01-13 16:20:00',
        updatedAt: '2024-01-13 16:20:00'
      },
      {
        id: '4',
        title: '杭州楼市2024年第一季度报告',
        summary: '分析杭州楼市第一季度成交数据及市场趋势',
        content: '2024年第一季度，杭州楼市整体表现平稳...',
        coverImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400',
        category: { id: '2', name: '楼市动态', code: 'market', sort: 2 },
        author: '市场分析师',
        publishTime: '2024-01-12 09:15:00',
        readCount: 1100,
        isTop: true,
        status: 'published',
        tags: ['楼市', '数据分析', '趋势'],
        createdAt: '2024-01-12 09:15:00',
        updatedAt: '2024-01-12 09:15:00'
      },
      {
        id: '5',
        title: '关于开展2024年保障房申请审核工作的通知',
        summary: '市住保房管局发布2024年保障房申请审核工作安排',
        content: '为做好2024年保障房申请审核工作，现将有关事项通知如下...',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        category: { id: '5', name: '通知公告', code: 'notice', sort: 5 },
        author: '杭州住保房管局',
        publishTime: '2024-01-11 08:00:00',
        readCount: 2100,
        isTop: true,
        status: 'published',
        tags: ['通知', '申请审核', '2024年'],
        createdAt: '2024-01-11 08:00:00',
        updatedAt: '2024-01-11 08:00:00'
      }
    ];

    // 简单的筛选逻辑
    let filteredNews = mockNews;

    if (keyword && keyword.trim() !== '') {
      filteredNews = filteredNews.filter(news => news.title.includes(keyword) || news.summary.includes(keyword));
    }

    if (categoryId && categoryId !== 'undefined' && categoryId.trim() !== '') {
      filteredNews = filteredNews.filter(news => news.category.id === categoryId);
    }

    if (isTop !== undefined) {
      filteredNews = filteredNews.filter(news => news.isTop === isTop);
    }

    // 分页
    const total = filteredNews.length;
    const offset = (page - 1) * pageSize;
    const list = filteredNews.slice(offset, offset + pageSize);

    return {
      list,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    };
  }

  /**
   * 获取资讯详情
   */
  async getNewsDetail(id: string): Promise<NewsInfo | null> {
    // 模拟数据，实际项目中应该从数据库查询
    const mockNewsDetails: { [key: string]: NewsInfo } = {
      '1': {
        id: '1',
        title: '杭州市2024年保障房申请政策解读',
        summary: '详细解读杭州市最新保障房申请条件、流程及注意事项',
        content: `
          <div style="line-height: 1.8; color: #333;">
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">申请条件</h2>
            <p style="margin: 15px 0; text-indent: 2em;">1. 具有杭州市区常住户口满3年，且在杭州市区连续缴纳社会保险或个人所得税满1年。</p>
            <p style="margin: 15px 0; text-indent: 2em;">2. 家庭人均年收入低于上年度城镇居民人均可支配收入的80%，单身申请人年收入不超过上年度城镇居民人均可支配收入。</p>
            <p style="margin: 15px 0; text-indent: 2em;">3. 家庭人均住房建筑面积低于15平方米，且在杭州市区无房产。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">申请流程</h2>
            <p style="margin: 15px 0; text-indent: 2em;">1. 申请人向户籍所在地或居住地社区提交申请材料</p>
            <p style="margin: 15px 0; text-indent: 2em;">2. 社区受理并进行初步审核，公示7个工作日</p>
            <p style="margin: 15px 0; text-indent: 2em;">3. 街道办事处进行复审，核实申请人资格</p>
            <p style="margin: 15px 0; text-indent: 2em;">4. 区住房保障部门进行终审，符合条件的纳入保障范围</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">所需材料</h2>
            <p style="margin: 15px 0; text-indent: 2em;">• 身份证、户口簿原件及复印件</p>
            <p style="margin: 15px 0; text-indent: 2em;">• 收入证明（工资流水、纳税证明等）</p>
            <p style="margin: 15px 0; text-indent: 2em;">• 房产证明（无房证明或现有房产证明）</p>
            <p style="margin: 15px 0; text-indent: 2em;">• 婚姻状况证明</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">注意事项</h2>
            <p style="margin: 15px 0; text-indent: 2em;">申请人需如实填写申请表，提供真实有效的证明材料。如发现弄虚作假，将取消申请资格并记入诚信档案。</p>
            <p style="margin: 15px 0; text-indent: 2em;">申请审核期间，申请人家庭情况发生变化的，应及时向审核部门报告。</p>
          </div>
        `,
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        category: { id: '1', name: '政策解读', code: 'policy', sort: 1 },
        author: '杭州住保房管局',
        publishTime: '2024-01-15 10:00:00',
        readCount: 1250,
        isTop: true,
        status: 'published' as const,
        tags: ['保障房', '政策', '申请'],
        createdAt: '2024-01-15 10:00:00',
        updatedAt: '2024-01-15 10:00:00'
      },
      '2': {
        id: '2',
        title: '滨江区新增保障房项目开工建设',
        summary: '滨江区今年将新增3个保障房项目，预计提供房源2000套',
        content: `
          <div style="line-height: 1.8; color: #333;">
            <p style="margin: 15px 0; text-indent: 2em;">记者从滨江区住建局获悉，今年滨江区将新增3个保障房项目，总建筑面积约15万平方米，预计提供保障房源2000套。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">项目概况</h2>
            <p style="margin: 15px 0; text-indent: 2em;">三个项目分别位于滨江区长河街道、西兴街道和浦沿街道，均为高层住宅建筑，配套设施完善。</p>
            <p style="margin: 15px 0; text-indent: 2em;">项目建成后将有效缓解滨江区保障房供需矛盾，为更多符合条件的家庭提供住房保障。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">建设进度</h2>
            <p style="margin: 15px 0; text-indent: 2em;">目前三个项目均已完成前期准备工作，预计2024年底前全部开工建设，2026年底前竣工交付。</p>
          </div>
        `,
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        category: { id: '4', name: '保障房资讯', code: 'affordable', sort: 4 },
        author: '杭州日报',
        publishTime: '2024-01-14 14:30:00',
        readCount: 890,
        isTop: false,
        status: 'published' as const,
        tags: ['滨江区', '保障房', '新项目'],
        createdAt: '2024-01-14 14:30:00',
        updatedAt: '2024-01-14 14:30:00'
      },
      '3': {
        id: '3',
        title: '如何选择适合的保障房户型？',
        summary: '专家详解保障房户型选择要点，帮助申请人做出最佳选择',
        content: `
          <div style="line-height: 1.8; color: #333;">
            <p style="margin: 15px 0; text-indent: 2em;">保障房户型选择是申请人关心的重要问题。本文将从多个角度为您详细解析如何选择适合的保障房户型。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">考虑因素</h2>
            <p style="margin: 15px 0; text-indent: 2em;">1. 家庭人口数量：根据家庭成员数量选择合适的房间数</p>
            <p style="margin: 15px 0; text-indent: 2em;">2. 居住需求：考虑老人、儿童等特殊群体的居住需求</p>
            <p style="margin: 15px 0; text-indent: 2em;">3. 经济承受能力：结合家庭收入选择合适的户型面积</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">户型推荐</h2>
            <p style="margin: 15px 0; text-indent: 2em;">• 1-2人家庭：建议选择一室一厅或两室一厅</p>
            <p style="margin: 15px 0; text-indent: 2em;">• 3-4人家庭：建议选择两室一厅或三室一厅</p>
            <p style="margin: 15px 0; text-indent: 2em;">• 5人以上家庭：建议选择三室两厅或更大户型</p>
          </div>
        `,
        coverImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        category: { id: '3', name: '申请指南', code: 'guide', sort: 3 },
        author: '住房专家',
        publishTime: '2024-01-13 16:20:00',
        readCount: 650,
        isTop: false,
        status: 'published' as const,
        tags: ['购房指南', '选房技巧'],
        createdAt: '2024-01-13 16:20:00',
        updatedAt: '2024-01-13 16:20:00'
      },
      '4': {
        id: '4',
        title: '杭州楼市2024年第一季度报告',
        summary: '分析杭州楼市第一季度成交数据及市场趋势',
        content: `
          <div style="line-height: 1.8; color: #333;">
            <p style="margin: 15px 0; text-indent: 2em;">2024年第一季度，杭州楼市整体表现平稳，成交量较去年同期有所回升。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">成交数据</h2>
            <p style="margin: 15px 0; text-indent: 2em;">第一季度杭州市区新建商品房成交12000套，同比增长15%。</p>
            <p style="margin: 15px 0; text-indent: 2em;">成交均价为每平方米28000元，环比基本持平。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">市场趋势</h2>
            <p style="margin: 15px 0; text-indent: 2em;">预计2024年杭州楼市将继续保持平稳发展态势，价格波动幅度有限。</p>
          </div>
        `,
        coverImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800',
        category: { id: '2', name: '楼市动态', code: 'market', sort: 2 },
        author: '市场分析师',
        publishTime: '2024-01-12 09:15:00',
        readCount: 1100,
        isTop: true,
        status: 'published' as const,
        tags: ['楼市', '数据分析', '趋势'],
        createdAt: '2024-01-12 09:15:00',
        updatedAt: '2024-01-12 09:15:00'
      },
      '5': {
        id: '5',
        title: '关于开展2024年保障房申请审核工作的通知',
        summary: '市住保房管局发布2024年保障房申请审核工作安排',
        content: `
          <div style="line-height: 1.8; color: #333;">
            <p style="margin: 15px 0; text-indent: 2em;">为做好2024年保障房申请审核工作，现将有关事项通知如下：</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">审核时间</h2>
            <p style="margin: 15px 0; text-indent: 2em;">2024年保障房申请审核工作自2024年2月1日起开始受理。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">审核流程</h2>
            <p style="margin: 15px 0; text-indent: 2em;">严格按照"三级审核、两次公示"的程序进行。</p>
            
            <h2 style="color: #1a8cff; margin: 30px 0 20px 0; font-size: 18px; font-weight: 600;">工作要求</h2>
            <p style="margin: 15px 0; text-indent: 2em;">各审核部门要严格按照政策标准，确保审核工作公平、公正、公开。</p>
          </div>
        `,
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: { id: '5', name: '通知公告', code: 'notice', sort: 5 },
        author: '杭州住保房管局',
        publishTime: '2024-01-11 08:00:00',
        readCount: 2100,
        isTop: true,
        status: 'published' as const,
        tags: ['通知', '申请审核', '2024年'],
        createdAt: '2024-01-11 08:00:00',
        updatedAt: '2024-01-11 08:00:00'
      }
    };

    return mockNewsDetails[id] || null;
  }

  /**
   * 获取热门资讯
   */
  async getHotNews(limit: number = 5): Promise<NewsInfo[]> {
    const allNews = await this.getNewsList({ page: 1, pageSize: 100 });
    return allNews.list.sort((a, b) => b.readCount - a.readCount).slice(0, limit);
  }

  /**
   * 增加阅读量
   */
  async incrementReadCount(id: string): Promise<void> {
    // 实际项目中应该更新数据库
    this.fastify.log.info(`增加资讯 ${id} 的阅读量`);
  }
}
