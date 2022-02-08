<template>
    <div slot="title" id="closeBtn">
        <span title="关闭"
              v-on:mouseenter="hoverOnClose = true"
              v-on:mouseleave="hoverOnClose = false">
            <span v-if="hoverOnClose">x</span>
        </span>
    </div>
</template>

<script>
export default {
    name: "CloseBtn"
}
</script>

<style lang="less" scoped>
#closeBtn {
    top: 10px;
    left: 20px;
}

#closeBtn span {
    line-height: 12px;
    font-size: 12px;
    color: #333;
    display: block;
    width: 12px;
    height: 12px;
    background-color: #ff5f56;
    border-radius: 50%;
    margin-right: 8px;
    float: left;
    user-select: none;
    cursor: pointer;
}
</style>
