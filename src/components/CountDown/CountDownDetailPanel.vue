<template>
<div id="countDownDetailPanel">
    <transition name="fade">
        <div class="roundBtnWrapper" v-if="onActive && !onEditingActive && this.countDownList.length > 0">
            <div class="roundBtnInner">
                <img id="addCountDownBtn"
                     src="../../../public/icons/add_icon.svg" alt=""
                     v-on:click="onAddCountDownBtnClicked"/>
            </div>
        </div>
    </transition>

<!--    不能和上面合并，不是同级的按钮，逻辑不能简化-->
    <transition name="fade">
        <div class="roundBtnWrapper" v-if="onActive && onEditingActive && !isNew">
            <div class="roundBtnInner">
                <img id="deleteCountDownBtn"
                     src="../../../public/icons/delete_icon.svg" alt=""
                     v-on:click="onDeleteCountDownBtnClicked"/>
            </div>
        </div>
    </transition>

<!--    note: el-dialog z-index 会从2000开始自增，无语子-->
    <el-dialog :visible.sync="onActive" top="0"
               :before-close="notifyParent" :show-close="false"
               :modal="false">
            <div class="countDownPanelContent" v-if="countDownList.length !== 0 && !onEditingActive">
                <div class="item countDownItem"
                     v-for="(event, index) in countDownList" :key="'countDownItem_' + index"
                     @click="onCountDownItemClicked(index)">
                    <div v-for="(value, key) in event" :key="'countDownItem_' + index + '_' + key">
                        <div :class="getClassNameForCountDownItem(key)" >
                            {{value}}
                        </div>
                    </div>
                </div>
                <!--            todo: 翻页 -->
                <!--                <span class="countDownEvent"-->
                <!--                      ref="eventName_1"-->
                <!--                      :class="{ scrollItem: nameScroll }">-->
                <!--                    超长的一个文本信息xx-->
                <!--                -->
                <!--                <span class="countDownEvent">-->
                <!--                <marquee scrollamount="2">一二三四五六七八九十</marquee>-->
                <!--                </span>-->
            </div>
            <div class="countDownPanelContent" v-else-if="countDownList.length === 0 && !onEditingActive">
                <div class="item createItem" v-on:click="onAddCountDownBtnClicked">
                    点击以添加第一个倒数日
                </div>
            </div>
            <span v-else/>
    </el-dialog>

    <el-dialog :visible.sync="onEditingActive" top="0"
               :before-close="notifyParent" :show-close="false"
               :modal="false">
        <div class="countDownPanelContent editing">
            <div class="item editingItem">
                <img class="iconBeforeInput" src="../../../public/icons/event_icon.svg" alt=""/>
                <input class="editingInput" placeholder="请输入事件名称" v-model="onEditingEventName"/>
            </div>
            <div class="item editingItem">
                <img class="iconBeforeInput clockIcon" src="../../../public/icons/clock_icon.svg" alt=""/>
                <el-date-picker
                    class="datePicker" v-model="onEditingExpirationTimeSelect"
                    align="right" type="date" placeholder="请选择日期" format="yyyy-MM-dd"
                    popper-class="popperClass" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <div class="item hintItem">
                按「enter」键以
                <span v-if="isNew">创建</span>
                <span v-else>修改</span>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
const KEYCODE_ENTER = 13;

const ACTION_CREATE = 0;
const ACTION_EDIT = 1;

const API_FOR_CREATE_COUNTDOWN = '/countdown/add';
const API_FOR_EDIT_COUNTDOWN = '/countdown/update';

export default {
    name: "CountDownDetailPanel",
    props: ['panelShown'],
    mounted() {
        // this.scrollEventName();
        // fixme 注册了两个 listener，只要一个
        addEventListener('keyup', this.keyUpListener)
    },
    data() {
        return {
            onActive: this.panelShown,
            onEditingActive: false,
            isNew: false, // 新创建
            onEditingID: '',
            hoverOnAddBtn: false,
            countDownList: this.$store.getters.getCountDownEvents,

            onEditingExpirationTimeSelect: '',
            onEditingEventName: '',
        }
    },
    watch: {
        panelShown(val) {
            this.onActive = val
        },
    },
    methods: {
        notifyParent() {
            this.onEditingActive = false;
            this.onActive = false;
            this.onEditingEventName = '';
            this.onEditingID = -1;
            this.onEditingExpirationTimeSelect = '';
            this.$emit('handleClose')
        },
        onAddCountDownBtnClicked() {
            let that = this;
            that.onEditingID = '';
            that.isNew = true;
            that.onEditingActive = true;
        },
        onDeleteCountDownBtnClicked() {
            let that = this;
            that.$store.commit('deleteCountDownEvent', that.onEditingID);

            // let data = new FormData();
            // data.append('id', that.onEditingID);
            that.$axios.post('/countdown/delete', that.onEditingID).then(resp => {
                // eslint-disable-next-line no-empty
                if (resp.data.code === 200) {
                } else {
                    this.$message({
                        message: '目前暂无法删除倒数日，请稍后再试',
                        type: 'warning'
                    });
                }
            }).catch(failResp => {
                console.log(failResp)
                this.$message({
                    message: '目前暂无法删除倒数日，后端没启动',
                    type: 'warning'
                });
            })
            that.onEditingID = -1;
            that.onEditingEventName = '';
            that.onEditingExpirationTimeSelect = '';
            that.onEditingActive = false;
        },
        onCountDownItemClicked(index) {
            let that = this;
            that.isNew = false;
            that.onEditingActive = true;
            that.onEditingID = that.countDownList[index].id;
            that.onEditingEventName = that.countDownList[index].name;
            that.onEditingExpirationTimeSelect = that.countDownList[index].expirationTime.replace('/:/g', '-');
        },
        getClassNameForCountDownItem(key) {
            if (key === 'name') {
                return 'countDownEvent';
            } else if (key === 'expirationTime') {
                return 'countDownExpiration';
            } else if (key === 'remainingTime') {
                return 'countDownRemainingTime';
            } else if (key === 'measurement') {
                return 'countDownRemainingMeasurement';
            } else {
                return key;
            }
        },
        /**
         * 创建/修改倒数日。
         * 约定：端上收到请求后，先存一份进浏览器缓存，再存 DB。每次页面启动的时候，读 DB 更新缓存。
         * 数据以 DB 里的为基准：
         *   - 读 DB 时机：进入主页；
         *   - 写 DB 时机：每次创建/修改操作；
         * 缓存只是为了防止后端挂了让前端展示上次获取的数据而已。
         * todo 缓存
         */
        createCountDown() {
            this.innerUpdateCountDown(ACTION_CREATE);
        },
        editCountDown() {
            this.innerUpdateCountDown(ACTION_EDIT);
        },
        innerUpdateCountDown(action) {
            let that = this;
            let endTime = new Date(that.onEditingExpirationTimeSelect.replace('/-/g', ':'));
            let days = Math.ceil((endTime - (new Date()).getTime()) / (24 * 3600 * 1000));
            let api = '';
            let id;
            if (action === ACTION_EDIT) {
                api = API_FOR_EDIT_COUNTDOWN;
                id = that.onEditingID
            } else if (action === ACTION_CREATE) {
                api = API_FOR_CREATE_COUNTDOWN;
                id = (new Date()).valueOf();
            } else {
                return;
            }
            that.$store.commit('updateCountDownEvent',
                {
                    action: action,
                    id: id,
                    name: that.onEditingEventName,
                    remainingTime: days,
                    expirationTime: that.onEditingExpirationTimeSelect,
                    measurement: 'd'
                });
            that.$axios.post(api, {
                id: id,
                eventName: that.onEditingEventName,
                expirationDate: that.onEditingExpirationTimeSelect
            }).then(resp => {
                // eslint-disable-next-line no-empty
                if (resp.data.code === 200) {
                } else {
                    this.$message({
                        message: '目前暂无法' + (action === ACTION_CREATE ? '创建' : '修改') + '倒数日，请稍后再试',
                        type: 'warning'
                    });
                }
            }).catch(failResp => {
                console.log(failResp)
                this.$message({
                    message: '目前暂无法' + (action === ACTION_CREATE ? '创建' : '修改') + '倒数日，后端没启动',
                    type: 'warning'
                });
            })
            that.onEditingID = -1;
            that.onEditingEventName = '';
            that.onEditingExpirationTimeSelect = '';
            that.onEditingActive = false;
        },
        keyUpListener(e) {
            let that = this;
            let keycode = e.keyCode;
            if (that.onEditingActive) {
                if (keycode === KEYCODE_ENTER) {
                    if (that.isNew) {
                        that.createCountDown();
                    } else {
                        that.editCountDown();
                    }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>

.roundBtnWrapper {
    width: 40px;
    height: 40px;
    position: fixed;
    right: 295px;
    bottom: 90px;
    border-radius: 50px;
    background-color: #eceaea;
    backdrop-filter: blur(5px);
    box-shadow: 0 12px 32px rgba(108, 107, 107, 0.48);
    // fixme 解决dialog z-index 自增问题
    z-index: 10000;
    pointer-events: auto;
}

.roundBtnInner {
    margin-left: 4px;
    margin-top: 5px;
    width: 30px;
    height: 30px;
    border-radius: 50px;
    transition: 0.25s;
}

.roundBtnInner:hover {
    box-shadow: 0 0 12px rgba(108, 107, 107, 0.48);
}

#addCountDownBtn, #deleteCountDownBtn{
    margin-top: 3px;
    width: 23px;
    height: 23px;
    z-index: 10000;
    pointer-events: auto;
}

/deep/ .el-dialog__wrapper {
    z-index: 40;
    cursor: auto;
    transition-duration: 0.3s;
}

/deep/ .el-dialog {
    width: 250px;
    max-height: 370px;
    position: absolute;
    //left: calc(~"50% - 400px");
    //top: calc(~"50% - 300px");
    right: 30px;
    bottom: 35px;
    overflow: auto;
    border-radius: 25px;

    background-color: rgba(232, 232, 232, 0.9);
    backdrop-filter: blur(5px);
    box-shadow: 0 12px 32px rgba(147, 145, 145, 0.48);

    transition: .1s;
    z-index: 100;
}

/deep/ .el-dialog__body {
    padding: 0;
}

// 不要小红点了
/deep/ .el-dialog__header {
    padding: 0;
}

.countDownPanelContent {
    max-height: 360px;
    width: 245px;
    margin-top: 4px;
    margin-bottom: 4px;
    margin-left: 2px;
    overflow-y: auto;
    background-color: rgba(255, 254, 254, 0.7);
    border-radius: 20px;
}

.item {
    position: relative;
    width: 230px;
    margin-top: 5px;
    margin-left: 7px;
    margin-bottom: 5px;
    border-radius: 25px;
    text-align: left;
    user-select: none;
    font-family: "Microsoft Yahei", sans-serif;
    color: black;
    z-index: 100;
    cursor: pointer;
    transition: 0.5s;
}

.item:hover {
    box-shadow: 0 0 12px rgba(108, 107, 107, 0.48);
    //background-color: rgb(239, 246, 233);
}

.countDownItem {
    height: 50px;
}

.createItem {
    margin-bottom: -5px;
    text-align: center;
    color: #9fa0a1;
    font-size: 16px;
    font-weight: 400;
    height: 30px;
}

.createItem:hover {
    color: #37393a;
}

.hintItem {
    text-align: center;
    color: #9fa0a1;
    margin-top: -5px;
    font-size: 10px;
    font-weight: 400;
    height: 3px;
    cursor: auto;
}

.hintItem:hover {
    box-shadow: none;
}

.addItem:hover {
    box-shadow: 0 0 1px rgba(108, 107, 107, 0.48);
}

.editingItem {
    height: 40px;
}

.editingItem:hover {
    box-shadow: 0 0 3px rgba(133, 131, 131, 0.48);
}

.blocker {
    position: absolute;
    z-index: 1000;
    background-color: rgb(241, 240, 240);
    width: 31px;
    height: 22px;
    left: -10px;
    top: 0;
}

marquee {
    position: absolute;
    width: 150px;
    height: 12px;
}

.scrollItem {
    animation: 3s wordsLoop linear alternate infinite;
}

@keyframes wordsLoop {
    0% {
        transform: translateX(0px);
    }
    25% {
        transform: translateX(0px);
    }
    75% {
        transform: translateX(-60px);
    }
    100% {
        transform: translateX(-60px);
    }
}

//.scrollItem {
//    animation: scroll linear 4s alternate infinite;
//    float: left;
//}
//
//@keyframes scroll {
//    0% {
//        margin-left: 0;
//        transform: translateX(0);
//    }
//
//    10% {
//        margin-left: 0;
//        transform: translateX(0);
//    }
//
//    90% {
//        margin-left: 100%;
//        transform: translateX(-100%);
//    }
//
//    100% {
//        margin-left: 100%;
//        transform: translateX(-100%);
//    }
//}

.id {
    width: 0;
    height: 0;
    display: none;
}

.countDownEvent {
    width: 135px;
    height: 25px;
    position: absolute;
    margin-left: 12px;
    margin-top: 2px;
    font-size: 17px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    //display: inline-block;
    vertical-align: top;
    z-index: 10;
    background-color: inherit;
}

.countDownExpiration {
    position: absolute;
    margin-left: 12px;
    margin-top: 28px;
}

.countDownRemainingTime {
    width: 55px;
    z-index: 1000;
    position: absolute;
    margin-left: 160px;
    margin-top: 3px;
    font-size: 30px;
    font-weight: 800;
    text-align: right;
    overflow-y: visible;
    background-color: inherit;
}

.countDownRemainingMeasurement {
    position: absolute;
    padding-left: 216px;
    padding-top: 23px;
}

// ---- editing related starts ----

.editing {
    padding: 5px;
    text-align: left;
    height: 100px;
}

.editingText {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: black;
}

.countDownTitleText {

}

.iconBeforeInput {
    position: absolute;
    width: 35px;
    height: 35px;
}

.clockIcon {
    margin-top: 3px;
    margin-left: 2px;
    width: 30px;
    height: 30px;
}

.editingInput {
    font: inherit;
    font-size: 15px;
    width: 75%;
    height: 23px;
    margin-left: 40px;
    margin-top: 5px;
    background: transparent;
    border: none;
    border-radius: 30px;
    cursor: inherit;
}

.editingInput:focus {
    outline: none;
}

.editingInput::placeholder {
    color: #c6cacc;
}

// datetime picker related

/deep/ .el-input__prefix {
    display: none;
}

/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-left: 40px;
    width: 75%;
}

/deep/ .el-input--prefix .el-input__inner {
    padding-left: 3px;
    background: transparent;
    border: none;
    cursor: inherit;
}

/deep/ .popperClass.el-popper {
    border-radius: 30px;
}


// ---- editing related ends ----

// ---- animation related starts ----

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

/deep/ .dialog-fade-enter-active{
    animation: none !important;
}
/deep/ .dialog-fade-leave-active {
    transition-duration: 0.15s !important;
    animation: none !important;
}

/deep/ .dialog-fade-enter-active .el-dialog,
.dialog-fade-leave-active .el-dialog{
    animation-fill-mode: forwards;
}

/deep/ .dialog-fade-enter-active .el-dialog{
    animation-duration: 0.3s;
    animation-name: anim-open;
    animation-timing-function: cubic-bezier(0.6,0,0.4,1);
}

/deep/ .dialog-fade-leave-active .el-dialog{
    animation-duration: 0.3s;
    animation-name: anim-close;
}

@keyframes anim-open {
    0% { opacity: 0;  transform: scale3d(0, 0, 1); }
    100% { opacity: 1; transform: scale3d(1, 1, 1); }
}

@keyframes anim-close {
    0% { opacity: 1; }
    100% { opacity: 0; transform: scale3d(0.5, 0.5, 1); }
}

// ---- animation related ends ----

</style>
