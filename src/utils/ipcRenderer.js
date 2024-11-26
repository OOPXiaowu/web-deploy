/*
 * @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
 * @Date: 2024-10-09 12:43:06
 * @LastEditors: OOPXiaowu WeChat: OOPXiaowu
 * @LastEditTime: 2024-10-23 11:31:14
 * @FilePath: \web-deploy\src\utils\ipcRenderer.js
 * @Description: 进程间通信渲染器,读写文件数据，获取文件路径
 *
 * Copyright © 2024 by OOPXiaowu All rights reserved.
 */
const { ipcRenderer } = require("electron");

export default {
	/** 获取存储配置*/
	readFile: (filePath) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('read-file', filePath);
			ipcRenderer.on('read-file-response', (event, response) => {
				if (response.success) {
					resolve(response.content)
				} else {
					reject(response)
				}
			});
		})
	},

	/** 存储配置*/
	writeFile: (filePath, content) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('write-file', filePath, content);
            ipcRenderer.on('write-file-response', (event, response) => {
                if (response.success) {
                    resolve(response)
                } else {
                    reject(response)
                }
            });
        })
    },

	/** 获取文件路径*/
	getFilePath: () => {
        return new Promise( async (resolve, reject) => {
			const result = await ipcRenderer.invoke('select-file');
			if (!result.canceled) {
				resolve(result.filePaths[0])
			} else {
				reject({ msg: 'Failed to obtain the file path' })
			}
        })
    },

	/** 获取文件夹目录名称*/
	getFileDir: (filePath) => {
		return new Promise(async (resolve, reject) => {
			ipcRenderer.send('get-directory', filePath);
			ipcRenderer.on('get-directory-response', (event, response) => {
				if (response.success) {
					resolve(response.content)
				} else {
					reject(response)
				}
			});
		})
	},

	/** 配置入站规则*/
	configureInboundRules: (name, port) => {
		return new Promise(async (resolve, reject) => {
			ipcRenderer.send('inbound-rules', name, port);
			ipcRenderer.on('inbound-rules-response', (event, response) => {
				if (response.success) {
					resolve(response)
				} else {
					reject(response)
				}
			});
		})
	},

	/** 启动nginx服务*/
	startNginxServer: (filePath) => {
		return new Promise(async (resolve, reject) => {
			ipcRenderer.send('start-nginx', filePath);
			ipcRenderer.on('start-nginx-response', (event, response) => {
				if (response.success) {
					resolve(response)
				} else {
					reject(response)
				}
			});
		})
	},

	/** 打开链接*/
	openLinks: (url) => {
		return new Promise(async (resolve, reject) => {
			ipcRenderer.send('click-link', url);
			ipcRenderer.on('click-link-response', (event, response) => {
				if (response.success) {
					resolve(response)
				} else {
					reject(response)
				}
			});
		})
	}
}
