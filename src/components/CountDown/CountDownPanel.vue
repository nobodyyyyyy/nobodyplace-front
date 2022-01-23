<template>
    <div>
        <transition name="fade">
            <div id="wrapper" v-if="isShown" v-on:click="onDetailPanelOpened">
                <div class="text" v-if="eventList.length === 0">
                    还没有倒数日
                </div>
                <div class="text" v-else>
                    距离 {{this.eventList[this.curEventIdx].name}}
                    还有 {{this.eventList[this.curEventIdx].remainingTime}}
                    {{this.eventList[this.curEventIdx].measurement}}
                </div>
            </div>
        </transition>

        <count-down-detail-panel id="countDownDetailPanel"
                                 :panelShown="detailPanelShown"
                                 @handleClose="onDetailPanelClosed"/>
    </div>
</template>

<script>
import CountDownDetailPanel from "@/components/CountDown/CountDownDetailPanel";
export default {
    name: "CountDownPanel",
    components: {CountDownDetailPanel},
    created() {
    },
    mounted() {
        this.changeDisplayEvent();
        setInterval(this.changeDisplayEvent, 5000);
    },
    data() {
        return {
            isShown: true,
            detailPanelShown: false,
            curEventIdx: 0,
            eventList: this.$store.getters.getCountDownEvents
        }
    },
    methods: {
        changeDisplayEvent() {
            // TODO 如果用 this 就改不了 isShown，要学习一下为什么啊
            let that = this;
            let len = that.eventList.length
            if (len < 2) {
                return;
            }
            this.isShown = false;
            this.curEventIdx = (that.curEventIdx + 1) % len;
            setTimeout(function (){that.isShown = true;}, 1000);
        },
        onDetailPanelOpened() {
            let that = this;
            that.detailPanelShown = true;
        },
        onDetailPanelClosed() {
            this.detailPanelShown = false;
        }
    }
}
</script>

<style lang="less" scoped>

#wrapper {
    z-index: -2;
    height: 30px;
    width: fit-content;
    width: -moz-fit-content;
    padding-left: 15px;
    padding-right: 15px;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.08);
    border-radius: 30px;
    transition: 0.25s;
}

#wrapper:hover {
    background: rgba(255, 255, 255, 0.16);
    cursor: pointer;
}

.text {
    padding-top: 5px;
    color: #c4c2c2;
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 13px;
    font-weight: 600;
    user-select: none;

    transition: 0.25s;
}

.countDownPanelInvisible {
    z-index: 100;
    position:fixed;
    left: 200px;
    top: 200px;
}

/deep/ .el-dialog {
    position: fixed;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

</style>
