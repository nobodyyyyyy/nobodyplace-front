<template>
    <el-dialog :visible.sync="onActive" top="0"
               :before-close="notifyParent" :show-close="false"
               :modal="false">
        <el-container>
<!--            <el-tabs tab-position="left"  v-model="selectSection" type="card" @tab-click="handleClick">-->
<!--                <el-tab-pane label="总览" name="overall">总览</el-tab-pane>-->
<!--                <el-tab-pane label="当前持有" name="currentlyHeld">当前持有</el-tab-pane>-->
<!--                <el-tab-pane label="添加持有" name="addHeld">添加持有</el-tab-pane>-->
<!--                <el-tab-pane label="租赁管理" name="rentalManage">租赁管理</el-tab-pane>-->
<!--            </el-tabs>-->
        </el-container>
    </el-dialog>
</template>

<script>
export default {
    name: "PiggyPanel",
    props: ['piggyPanelOpened'],
    data() {
        return {
            onActive: this.piggyPanelOpened,
            selectSection: ''
        }
    },
    watch: {
        piggyPanelOpened(val) {
            this.onActive = val
        },
    },
    methods: {
        notifyParent() {
            this.onActive = false;
            this.$emit('handleChange')
        },
    },
}
</script>

<style lang="less" scoped>

/deep/ .el-dialog__wrapper {
    z-index: 40;
    cursor: auto;
    transition-duration: 0.3s;
}

/deep/ .el-dialog {
    width: 800px;
    height: 600px;
    position: absolute;
    left: calc(~"50% - 400px");
    top: calc(~"50% - 300px");
    overflow: auto;
    border-radius: 25px;

    //background-color: rgba(232, 232, 232, 0.9);
    //backdrop-filter: blur(5px);
    box-shadow: 0 12px 32px rgba(147, 145, 145, 0.48);

    transition: .1s;
    z-index: 100;
}

/deep/ .el-dialog__body {
    padding: 0;
}

/deep/ .el-dialog__header {
    padding: 0;
}

</style>
