<!--
* @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
* @Date: 2024-10-09 12:43:06
* @LastEditors: OOPXiaowu WeChat: OOPXiaowu
* @LastEditTime: 2024-10-23 11:32:14
* @FilePath: \web-deploy\src\layout\index.vue
* @Description:
*
* Copyright © 2024 by OOPXiaowu All rights reserved.
-->

<template>
    <a-layout class="layout">
      <a-layout-header>
        <headerView />
      </a-layout-header>
      <a-layout style="height: 100%">
        <a-layout-sider>
          <siderView />
        </a-layout-sider>
        <a-layout-content>
          <contentView />
        </a-layout-content>
      </a-layout>
      <a-layout-footer>
        <footerView />
      </a-layout-footer>
    </a-layout>
</template>

<script setup>
import headerView from './headerView.vue';
import contentView from './contentView.vue';
import siderView from './siderView.vue';
import footerView from './footerView.vue';

</script>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  padding: 0 12px;
  background-image: linear-gradient(to right, #eef3fd, #edeefd);
}

:where(.css-dev-only-do-not-override-17yhhjv).ant-layout {
  background-color: transparent !important;
}

:deep(.ant-layout-header) {
  //border-radius: 8px;
    padding: 0 12px;
    //margin-top: 0;
  background-color: transparent !important;
}

:deep(.ant-layout-sider) {
  margin-right: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #d9e6f7 !important;
}

:deep(.ant-layout-content) {
  border-radius: 8px;
  height: 100%;
  //background-color: #fff !important;
}

:deep(.ant-layout-footer) {
  padding: 10px;
  background-color: transparent;
}

</style>
