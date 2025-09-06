<template>
  <div class="action-bar">
    <div class="action-buttons">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 通用底部操作栏组件
</script>

<style lang="scss" scoped>
.action-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgb(0 0 0 / 0.1);

  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    width: 100%;
    max-width: 600px;

    :deep(.ant-btn) {
      flex: 1;
      height: 48px;
      font-weight: 600;
      font-size: 16px;
      border: 2px solid #d9d9d9;
      border-radius: 24px;
      transition: all 0.3s ease;

      &:first-child {
        color: #1890ff;
        background: white;
        border-color: #1890ff;

        &:hover {
          background: #f0f9ff;
          border-color: #40a9ff;
          transform: translateY(-2px);
        }
      }

      &.ant-btn-primary {
        background: linear-gradient(135deg, #1890ff, #40a9ff);
        border-color: #1890ff;
        box-shadow: 0 4px 12px rgb(24 144 255 / 0.3);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #40a9ff, #69c0ff);
          box-shadow: 0 6px 16px rgb(24 144 255 / 0.4);
          transform: translateY(-2px);
        }

        &:disabled {
          color: #bfbfbf;
          background: #f5f5f5;
          border-color: #d9d9d9;
          box-shadow: none;
        }
      }
    }
  }
}

@media (width <= 768px) {
  .action-bar {
    padding: 12px 16px;

    .action-buttons {
      gap: 12px;

      :deep(.ant-btn) {
        height: 44px;
        font-size: 15px;
      }
    }
  }
}
</style>
