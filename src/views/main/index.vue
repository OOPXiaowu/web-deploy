<!--
* @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
* @Date: 2024-10-09 12:43:06
* @LastEditors: OOPXiaowu WeChat: OOPXiaowu
* @LastEditTime: 2024-11-01 23:17:47
* @FilePath: \web-deploy\src\views\main\index.vue
* @Description:
*
* Copyright © 2024 OOPXiaowu All rights reserved.
-->

<template>
	<a-card style="margin-bottom: 8px">
	  <div style="display: flex; justify-content: space-between; align-items: center;">
		  <a-input v-model:value="fileUrl" placeholder="请选择Nginx安装目录" style="margin-right: 10px" :disabled="true"/>
		  <a-button type="primary" @click="handleBeforeUpload">选择Nginx安装目录</a-button>
	  </div>
	</a-card>
	<a-card title="项目列表" style="height: 86%;">
	  <template #extra>
          <a-space wrap>
              <a-button type="primary" @click="() => open = true">创建项目</a-button>
              <a-button type="primary" @click="writeFileNginxConf">运行服务</a-button>
          </a-space>
	  </template>
	  <a-table :columns="columns" :data-source="projectList" :scroll="{ x: 0, y: 330 }" :pagination="{position: ['bottomLeft']}">
          <template #bodyCell="{ column, text, record }">
              <template v-if='column.dataIndex === "visitPath"'>
                  <div style='cursor: pointer' @click='openBrowser(text)'>{{ text }} <CopyTwoTone v-copy='text' /></div>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                  <a-button type='text' @click='handleDetails(record)'>
                      <template #icon>
                          <FileTextTwoTone />
                      </template>
                  </a-button>
                  <a-button type='text' @click='handleEdit(record)'>
                      <template #icon>
                          <EditTwoTone />
                      </template>
                  </a-button>
                  <a-button type='text' danger @click='handleDelete(record)'>
                      <template #icon>
                          <DeleteOutlined />
                      </template>
                  </a-button>
              </template>
          </template>
      </a-table>
    </a-card>

  <!-- 新增弹出框 -->
	<a-modal v-model:open="open" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定" :width="620">
	  <saveView ref="save" @saveFormState="getFormState"></saveView>
	</a-modal>
</template>

<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, nextTick } from 'vue'
import { Modal } from 'ant-design-vue';

import { getCurrentInstance, ref } from 'vue';
import { useSystemStore } from "@/stores/module/useSystem";
import saveView from './save.vue';
import { generateNginxConfig } from '@/utils/createNginx';

const { proxy } = getCurrentInstance();
const useSystem = useSystemStore();

const columns = [
    {
        title: '序号',
        customRender: ({index}) => `${index + 1}`,
        width: 60,
    },
    {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        ellipsis: true,
    },
    {
        title: '指定端口',
        dataIndex: 'port',
        key: 'port',
        width: 100,
    },
    {
        title: '访问地址',
        dataIndex: 'visitPath',
        key: 'visitPath',
    },
    {
        title: '资源地址',
        dataIndex: 'projectPath',
        key: 'projectPath',
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 130
    },
];
const projectList = ref([]);
let fileUrl = ref("");
const open = ref(false);
const confirmLoading = ref(false);
const title = ref('创建项目');

/** 获取存储配置*/
const getProjectList = async () => {
    try {
        const res = await proxy.$ipcRenderer.readFile('projectList.json');
        const data = JSON.parse(res);
        projectList.value = data.projectList;
        fileUrl.value = data.nginxDir;
    } catch (err) {
        proxy.$message.error(err.message || '读取项目列表文件时发生错误');
    }
};

/** 获取nginx安装目录*/
const handleBeforeUpload = async () => {
    try {
        const filePath = await proxy.$ipcRenderer.getFilePath();
        await isNginx(proxy.$tool.convertPath(filePath));
    } catch (err) {
        proxy.$message.error(err.message || '未知错误');
    }
};

/** 是否符合Nginx环境 */
const isNginx = async (path) => {
    try {
        const res = await proxy.$ipcRenderer.getFileDir(path);
        const is_nginx = proxy.$tool.verificationNginxDir(res);
        if (is_nginx) {
            fileUrl.value = path;
            await saveListFile({ projectList: projectList.value, nginxDir: path });
            await getProjectList();
            return true;
        } else {
            proxy.$message.error('当前路径下未检测到Nginx运行环境，请重新选择！');
            return false;
        }
    } catch (err) {
        proxy.$message.error(err.message || '检测Nginx环境时发生错误');
        return false;
    }
};

/** 保存数据*/
const handleOk = () => proxy.$refs.save.onSubmit();

/** 取消保存*/
const handleCancel = () => proxy.$refs.save.resetForm();

/** 获取表单数据并存储 */
const getFormState = async (formState) => {
    if (formState.disabled) return;
    confirmLoading.value = true;
    try {
        let data = JSON.parse(JSON.stringify(projectList.value));
        if (formState.id) {
            data = data.map(item => {
                if (item.id === formState.id) return { ...item, ...formState };
                return item;
            });
        } else {
            const project = { ...formState };
            project.createTime = proxy.$tool.formatTime(new Date());
            project.visitPath = "http://" + useSystem.systemInfo.ip + ":" + project.port;
            project.projectPath = proxy.$tool.convertPath(project.projectPath);
            project.id = data.length + 1;
            data.push(project);
            await createInboundRules(project.name, project.port);
        }
        await saveListFile({ projectList: data, nginxDir: fileUrl.value });
        await new Promise(resolve => setTimeout(resolve, 1200));
        proxy.$message.success("数据存储成功");
    } catch (e) {
        proxy.$message.error("数据存储失败：" + e.message);
    } finally {
        confirmLoading.value = false;
        confirmLoading.value = false;
    }
};

/** 列表数据存储 */
const saveListFile = async (fileData) => {
    try {
        await proxy.$ipcRenderer.writeFile('projectList.json', JSON.stringify(fileData));
        confirmLoading.value = false;
        if (open.value) proxy.$refs.save.resetForm();
        open.value = false;
        await getProjectList();
        proxy.$message.success('数据存储成功');
    } catch (err) {
        proxy.$message.error('数据存储错误: ' + (err.message || err.msg));
    }
};

/** 编辑数据*/
const handleEdit = (row) => {
    title.value = "编辑项目";
    open.value = true;
    nextTick(() => {
        proxy.$refs.save.formState = JSON.parse(JSON.stringify(row));
    })
};

/** 详情*/
const handleDetails = (row) => {
    title.value = "项目详情";
    open.value = true;
    nextTick(() => {
        proxy.$refs.save.formState = {...row, disabled: true};
    })
};

/** 删除数据*/
const handleDelete = (row) => {
    Modal.confirm({
        title: '删除项目会导致资源部不可达，请谨慎操作',
        icon: createVNode(ExclamationCircleOutlined),
        content: `您确定要删除项目 ${row.name} 吗?`,
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
            try {
                let data = JSON.parse(JSON.stringify(projectList.value));
                data = data.filter(item => item.id !== row.id);
                await saveListFile({ projectList: data, nginxDir: fileUrl.value });
                proxy.$message.success('删除成功！');
            } catch (err) {
                proxy.$message.error('删除失败: ' + (err.message || err.msg));
            }
        },
        onCancel: () => {
            // 用户取消操作时的处理
        },
    });
};

/** 列表数据写入 */
const writeFileNginxConf = async () => {
    if (!fileUrl.value) return proxy.$message.error('请选择Nginx安装目录！');
    try {
        const conf = generateNginxConfig(projectList.value, fileUrl.value);
        const filePath = `${fileUrl.value}/conf/nginx.conf`;
        await proxy.$ipcRenderer.writeFile(filePath, conf);
        proxy.$message.success('配置写入成功!');
        runServer();
    } catch (err) {
        proxy.$message.error('配置写入错误: ' + (err.message || err.msg));
    }
};

/** 配置入站规则*/
const createInboundRules = async (name, port) => {
    try {
        await proxy.$ipcRenderer.configureInboundRules(name, port);
        proxy.$message.success('入站规则配置成功');
    } catch (err) {
        proxy.$message.error('入站规则配置错误: ' + (err.message || err.msg));
    }
};

/** 启动服务*/
const runServer = async () => {
    try {
        await proxy.$ipcRenderer.startNginxServer(fileUrl.value);
        proxy.$message.success('Nginx服务运行成功!');
    } catch (err) {
        proxy.$message.error('Nginx服务运行失败，可尝试手动运行: ' + (err.message || err.msg));
    }
};

/** 打开浏览器*/
const openBrowser = async (url) => {
    try {
        await proxy.$ipcRenderer.openLinks(url);
    } catch (err) {
        proxy.$message.success(err);
    }
}
getProjectList();
</script>
