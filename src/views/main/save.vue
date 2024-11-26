<!--
* @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
* @Date: 2024-10-09 12:43:06
* @LastEditors: OOPXiaowu WeChat: OOPXiaowu
* @LastEditTime: 2024-10-23 11:36:49
* @FilePath: \web-deploy\src\views\main\save.vue
* @Description:
*
* Copyright © 2024 by OOPXiaowu All rights reserved.
-->

<template>
	<a-form ref="formRef" :model="formState" :rules="rules" :label-col="5" :wrapper-col="13" :disabled='formState.disabled'>
		<a-form-item ref="name" label="项目名称" name="name">
			<a-input v-model:value="formState.name" placeholder="请输入项目名称"/>
		</a-form-item>
		<a-form-item ref="projectPath" label="资源地址" name="projectPath">
			<a-row :gutter="8">
				<a-col :span="18"><a-input v-model:value="formState.projectPath" disabled placeholder="请选择资源地址"/></a-col>
				<a-col :span="6"><a-button type="primary" block @click="handleSelectResPath">选择资源地址</a-button></a-col>
			</a-row>
		</a-form-item>
		<a-form-item ref="port" label="指定端口" name="port">
			<a-input v-model:value="formState.port" placeholder="请输入指定端口"/>
		</a-form-item>
		<a-space v-for="(server, index) in formState.servers" :key="server.id" style="display: flex; width: 100%" align="baseline">
			<a-form-item :label="'服务地址' + (index+1)" :name="['servers', index, 'api']" :rules="{required: true,message: '请输入服务地址',}">
				<a-input v-model:value="server.api" placeholder="请输入服务地址" />
			</a-form-item>
			<a-form-item :label="'匹配规则' + (index+1)" :name="['servers', index, 'rule']" :rules="{required: true, message: '请输入地址匹配规则' }">
				<a-input v-model:value="server.rule" placeholder="请输入匹配规则" />
			</a-form-item>
			<MinusCircleOutlined style="color: #ff4d4f" v-if='!formState.disabled' @click="removeServer(server)" />
		</a-space>
		<a-form-item>
			<a-button type="dashed" block @click="addServer"><PlusOutlined />新增服务地址规则</a-button>
		</a-form-item>
	</a-form>
</template>
<script setup>
import { ref, defineEmits, getCurrentInstance } from 'vue';

const $emit = defineEmits(['saveFormState']);
const { proxy } = getCurrentInstance();


const formRef = ref();
/** 表单form*/
const formState = ref({
	name: '',
	projectPath: '',
	port: '',
	servers: [
		{
			api: '',
			rule: '',
			id: Date.now(),
		}
	],
});
/** 表单规则*/
const rules = {
	name: [
		{
			required: true,
			message: '请输入项目名称',
			trigger: 'blur',
		},
	],
	projectPath: [
		{
			required: true,
			message: '请输入资源地址',
			trigger: 'blur',
		}
	],
	port: [
		{
			required: true,
			message: '请输入指定端口',
			trigger: 'blur',
		}
	],
	serveUrl: [
		{
			required: true,
			message: '请输入服务地址',
			trigger: 'blur',
		}
	]
};


/** 表单重置*/
const resetForm = () => {
    formRef.value.resetFields();
    formState.value = {
        name: '',
        projectPath: '',
        port: '',
        servers: [
            {
                api: '',
                rule: '',
                id: '',
            }
        ],
    };
};

/** 删除服务地址&规则*/
const removeServer = item => {
	const index = formState.value.servers.indexOf(item);
	if (index !== -1) formState.value.servers.splice(index, 1);
};

/** 新增服务地址&规则*/
const addServer = () => {
    resetForm();
	formState.value.servers.push({
		api: '',
		rule: '',
		id: Date.now(),
	});
};

/** 选择资源地址 */
const handleSelectResPath = async () => {
    try {
        const res = await proxy.$ipcRenderer.getFilePath();
        formState.value.projectPath = proxy.$tool.convertPath(res);
    } catch (err) {
        console.error('获取目录失败:', err.message || err.msg);
    }
};

/** 提交数据*/
const onSubmit = () => {
	formRef.value.validate().then(() => {
		$emit('saveFormState', formState.value);
	}).catch(error => {
		console.log('error', error);
	});
};

defineExpose({
	onSubmit,
	resetForm,
    formState
})
</script>

<style lang="less" scoped>
:deep(.ant-space) {
    .ant-space-item:nth-child(1) {
       width: 48% !important;
    }
    .ant-space-item:nth-child(2) {
       width: 48% !important;
    }
}
</style>
