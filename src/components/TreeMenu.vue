<template>
    <template v-for="menu in userMenu">
        <el-sub-menu v-if="menu.children &&
            menu.children.length > 0 &&
            menu.children[0].menuType == 1" :key="menu._id" :index="menu.path">
            
            <template #title>
                <!-- 安全使用图标方案 -->
                <el-icon v-if="menu.icon">
                    <component :is="menu.icon" />
                </el-icon>
                <i v-else class="el-icon-menu"></i>
                <span>{{ menu.menuName }}</span>
            </template>
            <TreeMenu :userMenu="menu.children" />
        </el-sub-menu>

        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">
            {{ menu.menuName }}
        </el-menu-item>
    </template>
</template>

<script>
export default {
    name: "TreeMenu",

    props: {
        userMenu: {
            type: Array,
            default() {
                return []
            }
        }
    }

};
</script>

<style scoped>
/* 局部样式 */
</style>