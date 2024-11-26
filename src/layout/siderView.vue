<!--
* @Author: OOPXiaowu WeChat: OOPXiaowu
* @Date: 2024-10-09 12:43:06
* @LastEditors: OOPXiaowu WeChat: OOPXiaowu
* @LastEditTime: 2024-10-23 11:32:14
* @FilePath: \web-deploy\src\layout\siderView.vue
* @Description:
*
* Copyright © 2024 OOPXiaowu All rights reserved.
-->

<template>
    <a-card title="主机信息" :bordered="false" size="small" style="margin-bottom: 12px">
        <p>主机名称：{{ systemInfo.hostname || '' }}</p>
        <p>操作系统：{{ systemInfo.platform || '' }} {{ systemInfo.arch || '' }}</p>
        <p>系统版本：{{ systemInfo.release || '' }}</p>
        <p>IP 地 址：{{ systemInfo.ip || '' }}</p>
        <p>运行时长：{{ Math.ceil(systemInfo.uptime / 60) || '' }}分钟</p>
    </a-card>
    <a-card title="操作指南" :bordered="false" size="small">
        <p><a-button type="link" @click='openBrowser'>1.Nginx官网安装</a-button></p>
        <p>2.创建项目</p>
        <p>3.运行服务</p>
        <p><a-button type="link" @click='open=true'>4.建议反馈</a-button></p>
    </a-card>

    <a-modal v-model:open="open" title="联系作者" :width='500' cancelText='取消' okText="知道了" @ok="handleOk">
        <a-flex justify="center" align="space-around">
            <a-image :width="220" :src="goodAuthor" />
            <a-image :width="220" :src="author" />
        </a-flex>
    </a-modal>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useSystemStore } from "@/stores/module/useSystem";
import author from "@/assets/author.jpg";
import goodAuthor from "@/assets/good.jpg";

const { proxy } = getCurrentInstance();
const useSystem = useSystemStore();
let systemInfo = ref({});
const open = ref(false);
// let author = '@/assets/author.jpg';

onMounted( () => {
  systemInfo.value = window.systemApi;
  let ipAddresses = getIPAddresses();
  systemInfo.value.ip = ipAddresses['以太网'] || ipAddresses['WLAN'];
  useSystem.systemInfo = systemInfo.value;
});

/** 获取主机信息*/
const getIPAddresses = () => {
    const interfaces =  window.systemApi.interfaces;
    return Object.keys(interfaces).reduce((result, iface) => {
        interfaces[iface].forEach(function(info) {
            if (info.family === 'IPv4' || info.family === 'IPv6') {
                result[iface] = info.address;
            }
        });
        return result;
    }, {});
};

/** 打开浏览器*/
const openBrowser = () => {
    proxy.$ipcRenderer.openLinks('https://nginx.org/en/download.html').then(() => {
        console.log('open links')
    }).catch((err) => {
        proxy.$message.success(err);
    })
};

const handleOk = () => open.value = false;
</script>

<style scoped lang='less'>
.ant-btn {
    padding: 0;
    height: 0;
}
</style>
