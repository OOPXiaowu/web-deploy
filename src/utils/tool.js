/*
 * @Author: OOPXiaowu WeChat: OOPXiaowu email: oopxiaowu@qq.com
 * @Date: 2024-10-09 12:43:06
 * @LastEditors: OOPXiaowu WeChat: OOPXiaowu
 * @LastEditTime: 2024-10-23 11:20:31
 * @FilePath: \web-deploy\src\utils\tool.js
 * @Description: 工具集函数
 *
 * Copyright © 2024 by OOPXiaowu All rights reserved.
 */

export default {
	/**返回指定日期格式 */
	formatTime: function(time, pattern) {
		if (arguments.length === 0 || !time) return null;
		const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
		let date;
		if (typeof time === 'object') {
			date = time;
		} else {
			if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
				time = parseInt(time);
			} else if (typeof time === 'string') {
				time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
			}
			if ((typeof time === 'number') && (time.toString().length === 10)) {
				time = time * 1000;
			}
			date = new Date(time);
		}
		const formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			a: date.getDay()
		}
		return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
			let value = formatObj[key]
			if (key === 'a') { return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][value] }
			if (result.length > 0 && value < 10) {
				value = '0' + value
			}
			return value || 0
		})
	},

	/** 转换路径地址*/
	convertPath: (path) => {
        return path.replace(/\\/g, '/');
    },

	/** 验证是否为nginx目录*/
	verificationNginxDir: (array, elements = [ "conf", "contrib", "docs", "html", "logs", "nginx.exe", "temp" ]) => {
		return elements.every(element => array.includes(element));
	}
}
