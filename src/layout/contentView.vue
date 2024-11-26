/*
* @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
* @Date: 2024-10-09 12:43:06
* @LastEditors: OOPXiaowu WeChat: OOPXiaowu
* @LastEditTime: 2024-10-23 11:32:14
* @FilePath: \web-deploy\src\layout\contentView.vue
* @Description:
*
* Copyright © 2024 by OOPXiaowu All rights reserved.
*/
<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<script setup>
</script>