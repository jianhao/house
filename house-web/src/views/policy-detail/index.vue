<template>
  <div class="policy-detail">
    <div class="container">
      <!-- 面包屑导航 -->
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item>
          <router-link to="/home">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/news">资讯中心</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>政策详情</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- 政策详情内容 -->
      <div v-if="loading" class="loading-container">
        <a-skeleton active :paragraph="{ rows: 8 }" />
      </div>

      <div v-else-if="policyDetail" class="policy-content">
        <!-- 政策标题 -->
        <div class="policy-header">
          <h1 class="policy-title">{{ policyDetail.title }}</h1>
          <div class="policy-meta">
            <span class="meta-item">
              <CalendarOutlined />
              发布时间：{{ formatDate(policyDetail.publishTime) }}
            </span>
            <span class="meta-item">
              <UserOutlined />
              发布机构：{{ policyDetail.publisher }}
            </span>
            <span class="meta-item">
              <EyeOutlined />
              浏览次数：{{ policyDetail.views }}
            </span>
          </div>
          <div v-if="policyDetail.tags?.length" class="policy-tags">
            <a-tag v-for="tag in policyDetail.tags" :key="tag" color="blue">
              {{ tag }}
            </a-tag>
          </div>
        </div>

        <!-- 政策摘要 -->
        <div v-if="policyDetail.summary" class="policy-summary">
          <h3>政策摘要</h3>
          <p>{{ policyDetail.summary }}</p>
        </div>

        <!-- 政策正文 -->
        <div class="policy-body">
          <div v-html="policyDetail.content"></div>
        </div>

        <!-- 相关文件 -->
        <div v-if="policyDetail.attachments?.length" class="policy-attachments">
          <h3>相关文件</h3>
          <div class="attachment-list">
            <div v-for="file in policyDetail.attachments" :key="file.id" class="attachment-item">
              <FileOutlined />
              <a :href="file.url" target="_blank">{{ file.name }}</a>
              <span class="file-size">({{ file.size }})</span>
            </div>
          </div>
        </div>

        <!-- 政策解读 -->
        <div v-if="policyDetail.interpretation" class="policy-interpretation">
          <h3>政策解读</h3>
          <div v-html="policyDetail.interpretation"></div>
        </div>

        <!-- 常见问题 -->
        <div v-if="policyDetail.faq?.length" class="policy-faq">
          <h3>常见问题</h3>
          <a-collapse v-model:activeKey="activeKeys" ghost>
            <a-collapse-panel
              v-for="(item, index) in policyDetail.faq"
              :key="index"
              :header="item.question"
            >
              <p>{{ item.answer }}</p>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <div v-else class="error-state">
        <a-result
          status="404"
          title="政策不存在"
          sub-title="抱歉，您访问的政策页面不存在或已被删除。"
        >
          <template #extra>
            <a-button type="primary" @click="$router.push('/news')"> 返回资讯中心 </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarOutlined, EyeOutlined, FileOutlined, UserOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// 政策详情数据类型
interface PolicyDetail {
  id: string
  title: string
  summary?: string
  content: string
  publisher: string
  publishTime: string
  views: number
  tags?: string[]
  attachments?: {
    id: string
    name: string
    url: string
    size: string
  }[]
  interpretation?: string
  faq?: {
    question: string
    answer: string
  }[]
}

const route = useRoute()
const loading = ref(false)
const policyDetail = ref<PolicyDetail | null>(null)
const activeKeys = ref<string[]>([])

// 格式化日期
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY年MM月DD日')
}

// 获取政策内容
const getPolicyContent = (policyId: string): string => {
  const contentMap: Record<string, string> = {
    'housing-conditions': `
      <h4>一、基本申请条件</h4>
      <p><strong>1. 户籍条件</strong></p>
      <ul>
        <li>申请人及共同申请人具有本市户籍</li>
        <li>户籍迁入本市满3年（投靠配偶的除外）</li>
        <li>单身申请人年满35周岁</li>
      </ul>
      
      <p><strong>2. 住房条件</strong></p>
      <ul>
        <li>申请人及共同申请人在本市无住房</li>
        <li>未享受过其他住房保障政策</li>
        <li>5年内未转让过住房</li>
      </ul>
      
      <p><strong>3. 收入财产条件</strong></p>
      <ul>
        <li>家庭人均月收入不超过3500元</li>
        <li>家庭总资产不超过50万元</li>
        <li>无商业性房产投资</li>
      </ul>
      
      <h4>二、特殊情况说明</h4>
      <p>对于特殊困难家庭，可适当放宽条件要求，具体标准由各区住建部门制定。</p>
    `,
    'application-guide': `
      <h4>第一步：准备申请材料</h4>
      <p><strong>必备材料清单：</strong></p>
      <ul>
        <li>身份证、户口本原件及复印件</li>
        <li>婚姻状况证明（结婚证或单身证明）</li>
        <li>收入证明（工资单、税单等）</li>
        <li>财产证明（银行存款、股票等）</li>
        <li>住房情况证明</li>
      </ul>
      
      <h4>第二步：提交申请</h4>
      <p>携带完整材料到户籍所在地街道办事处或社区服务中心提交申请。</p>
      
      <h4>第三步：审核流程</h4>
      <ol>
        <li><strong>初审（15个工作日）</strong>：街道办事处进行材料审核和入户调查</li>
        <li><strong>复审（15个工作日）</strong>：区住建部门进行资格复审</li>
        <li><strong>终审（15个工作日）</strong>：市住建部门进行最终审核</li>
        <li><strong>公示（7个工作日）</strong>：审核通过后进行公示</li>
      </ol>
      
      <h4>第四步：配租配售</h4>
      <p>通过审核的家庭将纳入轮候库，按照轮候顺序进行房源配租配售。</p>
    `,
    'rent-subsidy': `
      <h4>一、补贴标准</h4>
      <p><strong>按家庭人口确定补贴标准：</strong></p>
      <ul>
        <li>1人户：每月最高补贴800元</li>
        <li>2人户：每月最高补贴1200元</li>
        <li>3人户：每月最高补贴1600元</li>
        <li>4人及以上：每月最高补贴2000元</li>
      </ul>
      
      <h4>二、申请条件</h4>
      <ul>
        <li>符合保障房申请条件但暂未获得实物配租的家庭</li>
        <li>已承租市场租赁住房</li>
        <li>租赁合同合法有效</li>
      </ul>
      
      <h4>三、申请流程</h4>
      <ol>
        <li>提交租金补贴申请及相关材料</li>
        <li>街道办事处初审</li>
        <li>区住建部门复审</li>
        <li>审核通过后按月发放补贴</li>
      </ol>
      
      <h4>四、发放方式</h4>
      <p>补贴资金通过银行转账方式按月发放到申请人指定账户。</p>
    `,
    faq: `
      <h4>申请相关问题</h4>
      <p><strong>Q：申请保障房需要什么条件？</strong></p>
      <p>A：需要同时满足户籍、住房、收入财产三个方面的条件要求。</p>
      
      <p><strong>Q：申请需要多长时间？</strong></p>
      <p>A：从提交申请到审核结果，一般需要45-60个工作日。</p>
      
      <h4>材料相关问题</h4>
      <p><strong>Q：收入证明怎么开？</strong></p>
      <p>A：在职人员由单位开具，个体户提供税务证明，无业人员由社区开具。</p>
      
      <p><strong>Q：材料不全可以先申请吗？</strong></p>
      <p>A：不可以，必须材料齐全才能受理申请。</p>
      
      <h4>轮候相关问题</h4>
      <p><strong>Q：轮候顺序如何确定？</strong></p>
      <p>A：按照申请时间先后顺序，同时考虑家庭困难程度。</p>
      
      <p><strong>Q：可以选择房源吗？</strong></p>
      <p>A：可以在可选范围内选择，但需要在规定时间内确认。</p>
    `
  }

  return contentMap[policyId] || contentMap['housing-conditions']
}

// 获取政策FAQ
const getPolicyFAQ = (policyId: string) => {
  const faqMap: Record<string, Array<{ question: string; answer: string }>> = {
    'housing-conditions': [
      {
        question: '单身人员可以申请保障房吗？',
        answer: '可以，但需要年满35周岁且符合其他申请条件。'
      },
      {
        question: '收入标准是按税前还是税后计算？',
        answer: '按税后实际收入计算，包括工资、奖金、补贴等各项收入。'
      },
      {
        question: '有车可以申请保障房吗？',
        answer: '拥有机动车不影响申请，但车辆价值会计入家庭财产总额。'
      }
    ],
    'application-guide': [
      {
        question: '在哪里提交申请？',
        answer: '到户籍所在地的街道办事处或社区服务中心提交申请。'
      },
      {
        question: '申请被拒绝了怎么办？',
        answer: '可以在收到通知后15日内提出复议申请，或者在条件改善后重新申请。'
      },
      {
        question: '申请期间搬家了怎么办？',
        answer: '需要及时到新的户籍地街道办事处办理申请转移手续。'
      }
    ],
    'rent-subsidy': [
      {
        question: '租金补贴可以领多久？',
        answer: '最长可领取3年，期间如获得实物配租则停止发放补贴。'
      },
      {
        question: '租房合同有什么要求？',
        answer: '必须是正式的房屋租赁合同，租期不少于1年，且房屋符合居住标准。'
      },
      {
        question: '补贴标准会调整吗？',
        answer: '会根据市场租金水平和政策要求适时调整，调整后按新标准执行。'
      }
    ],
    faq: [
      {
        question: '保障房可以买卖吗？',
        answer: '保障房有一定的产权限制，一般需要居住满5年后才能上市交易。'
      },
      {
        question: '保障房的租金是多少？',
        answer: '租金标准按照市场租金的60%-80%确定，具体以公布标准为准。'
      },
      {
        question: '可以同时申请多种保障方式吗？',
        answer: '不可以，每个家庭只能选择一种住房保障方式。'
      }
    ]
  }

  return faqMap[policyId] || faqMap['housing-conditions']
}

// 政策数据映射
const policyDataMap: Record<string, Partial<PolicyDetail>> = {
  'housing-conditions': {
    title: '杭州市保障性住房申请条件详解',
    summary:
      '详细介绍杭州市保障性住房申请的各项条件要求，包括户籍、年龄、收入、财产等方面的具体标准。',
    tags: ['申请条件', '户籍要求', '收入标准', '财产限制']
  },
  'application-guide': {
    title: '保障性住房申请流程指南',
    summary: '从申请准备到最终配租配售的完整流程指导，帮助申请人顺利完成保障房申请。',
    tags: ['申请流程', '材料准备', '审核程序', '配租配售']
  },
  'rent-subsidy': {
    title: '杭州市租金补贴政策实施细则',
    summary: '针对符合条件的家庭提供租金补贴，减轻住房负担，详细说明补贴标准和申请方式。',
    tags: ['租金补贴', '补贴标准', '申请方式', '发放流程']
  },
  faq: {
    title: '保障性住房常见问题解答',
    summary: '汇总整理保障房申请过程中的常见问题和解答，为申请人提供便民服务。',
    tags: ['常见问题', '政策解读', '申请答疑', '便民服务']
  }
}

// 获取政策详情
const fetchPolicyDetail = async () => {
  try {
    loading.value = true
    const policyId = route.params.id as string

    // 获取基础政策信息
    const basePolicy = policyDataMap[policyId] || policyDataMap['housing-conditions']

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    policyDetail.value = {
      id: policyId,
      title: basePolicy.title || '杭州市保障性住房申请管理办法（2024年修订版）',
      summary:
        basePolicy.summary ||
        '为进一步规范杭州市保障性住房申请、审核、配租配售等工作，保障符合条件家庭的住房需求，根据国家和省市相关法规，制定本办法。',
      content: getPolicyContent(policyId),
      publisher: '杭州市住房和城乡建设局',
      publishTime: '2024-01-15T10:00:00Z',
      views: Math.floor(Math.random() * 2000) + 500,
      tags: basePolicy.tags || ['保障房', '申请条件', '管理办法', '住房政策'],
      attachments: [
        {
          id: '1',
          name: '杭州市保障性住房申请表.pdf',
          url: '#',
          size: '2.5MB'
        },
        {
          id: '2',
          name: '收入证明模板.doc',
          url: '#',
          size: '156KB'
        }
      ],
      interpretation: `
        <p>本次修订主要针对以下几个方面：</p>
        <ul>
          <li>1. 优化申请条件，降低申请门槛</li>
          <li>2. 简化申请流程，提高办事效率</li>
          <li>3. 完善监管机制，确保公平公正</li>
          <li>4. 加强后续管理，规范使用行为</li>
        </ul>
      `,
      faq: getPolicyFAQ(policyId)
    }
  } catch (error) {
    console.error('获取政策详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPolicyDetail()
})
</script>

<style lang="scss" scoped>
.policy-detail {
  min-height: calc(100vh - 64px);
  padding: 24px 0;
  background: #f5f5f5;

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 24px;
  }
}

.breadcrumb {
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.loading-container {
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.policy-content {
  overflow: hidden;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

.policy-header {
  padding: 32px 32px 24px;
  border-bottom: 1px solid #f0f0f0;

  .policy-title {
    margin-bottom: 16px;
    color: #333;
    font-weight: 600;
    font-size: 28px;
    line-height: 1.4;
  }

  .policy-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 16px;

    .meta-item {
      display: flex;
      gap: 6px;
      align-items: center;
      color: #666;
      font-size: 14px;

      .anticon {
        color: #1890ff;
      }
    }
  }

  .policy-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.policy-summary {
  padding: 24px 32px;
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    margin-bottom: 12px;
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.6;
  }
}

.policy-body {
  padding: 32px;

  :deep(h4) {
    margin: 24px 0 16px;
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }

  :deep(p) {
    margin-bottom: 16px;
    color: #666;
    line-height: 1.8;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 16px;
    padding-left: 24px;

    li {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }
  }
}

.policy-attachments,
.policy-interpretation,
.policy-faq {
  padding: 24px 32px;
  border-top: 1px solid #f0f0f0;

  h3 {
    margin-bottom: 16px;
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }
}

.attachment-list {
  .attachment-item {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 6px;
    transition: background-color 0.3s;

    &:hover {
      background: #e9ecef;
    }

    .anticon {
      color: #1890ff;
    }

    a {
      flex: 1;
      color: #1890ff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .file-size {
      color: #999;
      font-size: 12px;
    }
  }
}

.policy-interpretation {
  :deep(p) {
    margin-bottom: 12px;
    color: #666;
    line-height: 1.6;
  }

  :deep(ul) {
    margin-bottom: 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }
  }
}

.error-state {
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
}

@media (width <= 768px) {
  .policy-detail {
    padding: 16px 0;

    .container {
      padding: 0 16px;
    }
  }

  .breadcrumb,
  .policy-header,
  .policy-summary,
  .policy-body,
  .policy-attachments,
  .policy-interpretation,
  .policy-faq {
    padding-right: 20px;
    padding-left: 20px;
  }

  .policy-header {
    .policy-title {
      font-size: 24px;
    }

    .policy-meta {
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>
