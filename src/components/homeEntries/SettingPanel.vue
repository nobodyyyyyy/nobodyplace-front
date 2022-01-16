<template>
    <el-drawer :visible.sync="onActive" direction="rtl" class="settingDrawer" :before-close="notifyParent"
               :with-header="false" :modal="false"  size="400px" style="overflow: hidden;">
        <div class="settingTitle">
            <span class="titleText">
                    设置
            </span>
        </div>
        <div class="settingContent" style="height: calc(100vh - 50px);">
            <div class="settingEntries" >
                <el-collapse v-model="activeName" style="text-align: left" accordion>
                    <el-collapse-item title="引擎" name="searchEngineSetting">
                        <el-divider class="subTitle" content-position="left">搜索引擎</el-divider>
                        <el-radio-group class="selectList" v-model="searchEngineSelect" @change="searchEngineChange">
                            <el-radio-button label="search_engine_google">谷歌 &nbsp;&nbsp; https://www.google.com/search?q=</el-radio-button>
                            <el-radio-button label="search_engine_baidu">百度 &nbsp;&nbsp; https://www.baidu.com/s?word=</el-radio-button>
                            <el-radio-button label="search_engine_bing">必应 &nbsp;&nbsp; https://cn.bing.com/search?q=</el-radio-button>
                        </el-radio-group>
                        <el-divider class="subTitle" content-position="left">联想建议引擎</el-divider>
                        <span class="hint">「联想建议」指在搜索框中输入文字后，出现的关键词联想列表。</span>
                        <el-radio-group class="selectList" v-model="suggestionsEngineSelect" @change="suggestionEngineChange">
                            <el-radio-button label="suggestion_engine_google">谷歌 &nbsp;&nbsp;  suggestqueries.google.com</el-radio-button>
                            <el-radio-button label="suggestion_engine_baidu">百度 &nbsp;&nbsp;  suggestion.baidu.com</el-radio-button>
                            <el-radio-button label="suggestion_engine_bing">必应  &nbsp;&nbsp; api.bing.com</el-radio-button>
                        </el-radio-group>

                    </el-collapse-item>

                    <el-collapse-item title="占位" name="1">

                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </el-drawer>
</template>

<script>
export default {
    name: "settingPanel",
    props: ['settingPanelOpened'],
    data() {
        return {
            onActive: this.settingPanelOpened,
            searchEngineSelect: this.$store.state.searchEngine,
            suggestionsEngineSelect: this.$store.state.suggestionEngine,
            activeName: '0'
        }
    },
    watch: {
        settingPanelOpened(val) {
            this.onActive = val
        },
    },
    methods: {
        notifyParent() {
            this.onActive = false;
            this.$emit('handleChange')
        },
        searchEngineChange(engine) {
            this.$store.commit('searchEngineChange', engine)
            this.searchEngineSelect = engine;
        },
        suggestionEngineChange(engine) {
            this.$store.commit('suggestionEngineChange', engine)
            this.suggestionsEngineSelect = engine;
        }
    },
}
</script>

<style scoped lang="less">
::v-deep.el-drawer {
    overflow: hidden;
}

.settingTitle {
    padding-top: 12px;
    box-shadow: 0 5px 5px #0000000d;
    position: relative;
    alignment: top;
    width: auto;;
    height: 50px;
    z-index: 10;
    text-align: left;
    background: white;
}

.titleText {
    width: auto;
    height: auto;
    margin-left: 25px;
    font-size: 20px;
    font-family: "Microsoft Yahei", sans-serif;
    font-weight: 750;
    user-select: none;
}

.settingContent {
    backdrop-filter: blur(5px);
    background-color: rgba(245, 245, 245, 0.52);;
    background-color: rgb(245,245,245);
    z-index: 0;
    position: relative;
    padding: 14px;
    overflow-x: hidden;
    overflow-y: auto;
}

.settingEntries {
    padding-left: 5px;
    padding-right: 5px;
    overflow-x: hidden;
    overflow-y: auto;
}

.subTitle {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 13px;
    font-weight: 600;
    user-select: none;
}

.hint {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 10px;
    font-weight: 350;
    user-select: none;
    padding-bottom: 5px;
}

.selectList {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}

/deep/.el-radio {
    margin-bottom: 13px;
}

/deep/.el-drawer__open .el-drawer.rtl {
    border-radius: 2% 0 0 2%
}

.el-collapse-item {
    padding: 0 20px;
    background-color: white;
    transition: .2s;
    border-radius: 3px;
}

.el-collapse-item.is-active {
    margin: 20px 0;
    box-shadow: 0 0 30px #0000001a;
    border-radius: 20px;
}

.el-collapse-item:first-child {
    border-radius: 10px 10px 0 0;
}

.el-collapse-item:first-child.is-active {
    border-radius: 20px
}

.el-collapse-item:last-child {
    border-radius: 0 0 10px 10px;
}

.el-collapse-item:last-child.is-active {
    border-radius: 20px
}

/deep/.el-collapse-item__header {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 15px;
    font-weight: 700;
    user-select: none;
}

/deep/.el-collapse-item__wrap {
    margin-top: -10px;
}

/deep/.el-divider__text.is-left {
    left: 0;
    padding-left: 0;
    padding-right: 20px;
}

/deep/ .el-radio-button__inner {
    user-select: none;
    border: none;
    width: 100%;
    text-align: left;
    color: #414040;
}

/deep/ .el-radio-button__inner:hover {
    color: #414040;
    background-color: rgba(233, 255, 214, 0.45);
    border-radius: 20px;
    box-shadow: none;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
    border: none;
}

/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: rgb(233, 255, 214);
    color: #414040;
    border-radius: 20px;
    box-shadow: none;
}

//
///deep/ .el-radio__inner{
//    border: none;
//}
//
///deep/ .el-radio__input.is-checked .el-radio__inner {
//    //background-color: white;
//    //width: 100%;
//    //height: 100%;
//    background: url("../../../public/icons/check_icon.svg") no-repeat 100% 100%;
//}

</style>
