// 房源列表查询 Schema
export const houseListSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      keyword: { type: 'string' },
      area: { type: 'string' },
      priceMin: { type: 'number', minimum: 0 },
      priceMax: { type: 'number', minimum: 0 },
      houseType: { type: 'string' },
      deliveryTime: { type: 'string' },
      sortBy: { type: 'string', enum: ['price', 'rating', 'created_at'] },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  coverImage: { type: 'string' },
                  price: { type: 'number' },
                  priceUnit: { type: 'string' },
                  area: { type: 'string' },
                  address: { type: 'string' },
                  houseTypes: { type: 'array', items: { type: 'string' } },
                  deliveryTime: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  rating: { type: 'number' },
                  developer: { type: 'string' }
                }
              }
            },
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
            hasMore: { type: 'boolean' }
          }
        },
        timestamp: { type: 'number' }
      }
    }
  }
};

// 房源详情 Schema
export const houseDetailSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            coverImage: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            price: { type: 'number' },
            priceUnit: { type: 'string' },
            area: { type: 'string' },
            address: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' }
              }
            },
            houseTypes: { type: 'array', items: { type: 'string' } },
            deliveryTime: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number' },
            description: { type: 'string' },
            developer: { type: 'string' },
            propertyCompany: { type: 'string' },
            buildingArea: { type: 'string' },
            plotRatio: { type: 'number' },
            greenRate: { type: 'number' },
            parkingRatio: { type: 'string' },
            schoolDistrict: { type: 'string' },
            nearbyFacilities: { type: 'array', items: { type: 'string' } },
            pros: { type: 'array', items: { type: 'string' } },
            cons: { type: 'array', items: { type: 'string' } },
            floorPlans: { type: 'array', items: { type: 'string' } },
            salesInfo: { type: 'object' },
            status: { type: 'string' },
            viewCount: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        },
        timestamp: { type: 'number' }
      }
    },
    404: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' }
      }
    }
  }
};

// 收藏房源 Schema
export const collectHouseSchema = {
  body: {
    type: 'object',
    required: ['houseId'],
    properties: {
      houseId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' }
      }
    }
  }
};

// 房源收藏相关 Schema
export const houseCollectionSchema = {
  params: {
    type: 'object',
    required: ['houseId'],
    properties: {
      houseId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            isCollected: { type: 'boolean' }
          }
        }
      }
    }
  }
};
