import { message } from 'ant-design-vue';

export default {
    mounted (el, { value }) {
        el.$value = value;
        el.handler = async () => {
            if (!el.$value) {
                message.warning('没有要复制的内容');
                return;
            }
            try {
                // 直接使用 Clipboard API 复制
                await navigator.clipboard.writeText(el.$value);
                message.success('复制成功');
            } catch (err) {
                message.error('复制失败', err);
            }
        };
        // 监听点击事件
        el.addEventListener('click', el.handler);
    },
    updated (el, { value }) {
        el.$value = value;
    },
    unmounted (el) {
        el.removeEventListener('click', el.handler);
    }
};
