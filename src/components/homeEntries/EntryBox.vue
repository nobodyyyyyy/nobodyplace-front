<template>
    <div>

        <div id="settingCover" :class="{'onFocus': settingPanelOpened}"
             style="opacity: 1;" v-on:click="settingPanelOpened = false"/>

<!--        TODO setting、blog 合二为一，垃圾代码才写两份一样的-->
        <div id="entries">
            <div class="entry" id="setting">
                <transition name="fade">
                    <span class="entryText" id="settingText" v-if="hoverOnSetting">
                        设置
                    </span>
                </transition>

                <img class="entryIcon" src="../../../public/icons/setting_icon.svg" alt="setting"
                     :class="{'settingHovering': hoverOnSetting}"
                     v-on:mouseenter="hoverOnSetting = true"
                     v-on:mouseleave="hoverOnSetting = false"
                     v-on:click="settingPanelOpened = true">
            </div>


            <div class="entry" id="blog">
                <transition name="fade">
                    <span class="entryText" id="blogText" v-if="hoverOnBlog">
                        博客
                    </span>
                </transition>
                <img class="entryIcon" src="../../../public/icons/blog_icon.svg" alt="blog"
                     :class="{'blogHovering': hoverOnBlog}"
                     v-on:mouseenter="hoverOnBlog = true"
                     v-on:mouseleave="hoverOnBlog = false"
                     v-on:click="1+1">
            </div>
        </div>

        <setting-panel :settingPanelOpened="settingPanelOpened" @handleChange="onSettingPanelStatusChanged"/>

    </div>
</template>

<script>
import SettingPanel from "@/components/homeEntries/SettingPanel";
export default {
    name: "EntryBox",
    components: {SettingPanel},
    data() {
        return {
            settingPanelOpened: false,
            hoverOnSetting: false,
            hoverOnBlog: false,
        }
    },
    methods: {
        onSettingPanelStatusChanged() {
            this.settingPanelOpened = false;
        }
    },
}
</script>

<style lang="less" scoped>
#settingCover {
    background: rgba(203, 201, 201, 0.07) no-repeat center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    overflow: hidden;
    z-index: -50;
    object-fit: cover;
    transition: opacity 1s, transform .25s, backdrop-filter .25s;
    /*-webkit-transition: opacity 1s, transform .25s, backdrop-filter .25s;*/
    backface-visibility: hidden;
    display: block;
}

#settingCover.onFocus {
    z-index: 50;
    background-position: center;
    transform: scale(1.1);
    backdrop-filter: blur(5px);
    position: fixed;
    background-repeat: no-repeat;
}

/*一系列入口，设置、博客等*/
#entries {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;

    height: 130px;
    width: 100px;
    position: fixed;
    bottom: 80px;
    right: -70px;
}

.entry {
    display: block;
    position: relative;
    height: 150px;
    width: 140px;
}

.entryIcon {
    z-index: -2;
    width: 30px;
    height: 30px;

    cursor: pointer;
    transition: 0.25s;
}

.settingHovering {
    margin-right: 30px;
}

.blogHovering {
    margin-right: 30px;
}

.entryText {
    position: absolute;
    color: #d0cece;
    user-select: none;
    left: -8px;
    top: 23px;
    margin-right: 10px;
    margin-top: -20px;
    margin-bottom: 20px;

    transition: 0.25s;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

section {
    overflow: hidden;
}


</style>
