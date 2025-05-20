//自动注册 Element Plus 图标组件
import * as components from "@element-plus/icons-vue";
export default {
    install: (app) => {
        for (const key in components) {
            const componentConfig =
                components[key];

            app.component(componentConfig.name,
                componentConfig);
        }
    },
};