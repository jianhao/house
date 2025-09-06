<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>杭州保障房信息网致力于为市民提供最新、最全面的保障房信息服务。</p>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>电话：0571-12345678</p>
          <p>邮箱：info@hzhouse.gov.cn</p>
        </div>
        <div class="footer-section">
          <h4>友情链接</h4>
          <p>
            <a href="#">杭州市政府</a>
            <a href="#">住建局</a>
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 杭州保障房信息网. 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 底部组件无需额外逻辑
</script>

<style lang="scss" scoped>
.app-footer {
  margin-top: auto;
  background: #f5f5f5;
  border-top: 1px solid #e8e8e8;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px 20px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 32px;
    margin-bottom: 32px;
  }

  .footer-section {
    h4 {
      margin-bottom: 16px;
      color: #333;
      font-weight: 600;
      font-size: 16px;
    }

    p {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }

    a {
      margin-right: 16px;
      color: #1890ff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .footer-bottom {
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid #e8e8e8;

    p {
      margin: 0;
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
