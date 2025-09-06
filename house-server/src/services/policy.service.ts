import { FastifyInstance } from 'fastify';

export interface PolicyListQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  keyword?: string;
}

export interface PolicyInfo {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  coverImage: string;
  tags: string[];
  author: string;
  source: string;
  viewCount: number;
  isFeatured: boolean;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyCategory {
  category: string;
  name: string;
  count: number;
}

export class PolicyService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * 获取政策列表
   */
  async getPolicyList(query: PolicyListQuery) {
    const { page = 1, pageSize = 10, category, keyword } = query;
    const offset = (page - 1) * pageSize;

    let whereClause = "WHERE status = 'published'";
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (keyword) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR summary ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${keyword}%`);
      paramIndex++;
    }

    // 获取总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM policies
      ${whereClause}
    `;
    const countResult = await this.fastify.pg.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // 获取列表数据
    const listQuery = `
      SELECT 
        id, title, summary, category, cover_image as "coverImage",
        tags, author, source, view_count as "viewCount",
        is_featured as "isFeatured", published_at as "publishedAt",
        created_at as "createdAt"
      FROM policies
      ${whereClause}
      ORDER BY is_featured DESC, published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(pageSize, offset);

    const listResult = await this.fastify.pg.query(listQuery, params);
    const list = listResult.rows.map(row => ({
      ...row,
      tags: Array.isArray(row.tags) ? row.tags : []
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
   * 获取政策详情
   */
  async getPolicyDetail(id: string): Promise<PolicyInfo | null> {
    const query = `
      SELECT 
        id, title, summary, content, category, cover_image as "coverImage",
        tags, author, source, view_count as "viewCount",
        is_featured as "isFeatured", status,
        published_at as "publishedAt", created_at as "createdAt",
        updated_at as "updatedAt"
      FROM policies
      WHERE id = $1 AND status = 'published'
    `;

    const result = await this.fastify.pg.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const policy = result.rows[0];

    // 增加浏览量
    await this.incrementViewCount(id);

    return {
      ...policy,
      tags: Array.isArray(policy.tags) ? policy.tags : []
    };
  }

  /**
   * 获取政策分类统计
   */
  async getPolicyCategories(): Promise<PolicyCategory[]> {
    const query = `
      SELECT 
        category,
        COUNT(*) as count
      FROM policies
      WHERE status = 'published'
      GROUP BY category
      ORDER BY count DESC
    `;

    const result = await this.fastify.pg.query(query);

    // 分类名称映射
    const categoryNames: Record<string, string> = {
      application: '申请指南',
      subsidy: '补贴政策',
      management: '管理办法',
      faq: '常见问题'
    };

    return result.rows.map(row => ({
      category: row.category,
      name: categoryNames[row.category] || row.category,
      count: parseInt(row.count)
    }));
  }

  /**
   * 增加浏览量
   */
  private async incrementViewCount(id: string): Promise<void> {
    const query = `
      UPDATE policies
      SET view_count = view_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    await this.fastify.pg.query(query, [id]);
  }

  /**
   * 获取推荐政策（精选政策）
   */
  async getFeaturedPolicies(limit: number = 5): Promise<PolicyInfo[]> {
    const query = `
      SELECT 
        id, title, summary, category, cover_image as "coverImage",
        tags, author, source, view_count as "viewCount",
        is_featured as "isFeatured", published_at as "publishedAt",
        created_at as "createdAt"
      FROM policies
      WHERE status = 'published' AND is_featured = true
      ORDER BY published_at DESC
      LIMIT $1
    `;

    const result = await this.fastify.pg.query(query, [limit]);

    return result.rows.map(row => ({
      ...row,
      tags: Array.isArray(row.tags) ? row.tags : []
    }));
  }
}