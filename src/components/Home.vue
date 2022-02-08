<template>
    <div>
        <!--    <img id="background" :class="{'onFocus': onFocus}" src="../../public/backgrounds/default_background_1.jpg" alt=""/>-->
        <!--    防止组件拖动-->
        <div class="cover" id="cover" style="" :class="{'onFocus': onFocus}"></div>
        <!--    TODO src 放后端 -->
        <video id="background" :class="{'onFocus': onFocus}" autoplay loop muted>
            <source src="../../public/backgrounds/background_mountain.mp4" type="video/mp4"/>
        </video>

        <entry-box/>
        <count-down-panel id="countDownPanel"/>

        <div id="content">
            <h1 id="clock">
                {{time.month}}月{{time.day}}日
                {{time.hour}}:{{time.minute}}:{{time.second}}
            </h1>

            <div id="inputWrapper">
                <input class="searchInput" :class="{onFocus : onFocus}" type="search" autocomplete="off"
                       spellcheck="false" role="combobox"
                       aria-live="polite" :placeholder="onFocus ? '输入关键词，或者输入一个网站' : '搜索'"
                       v-model="userInput" @keyup.enter="submit"
                       v-on:focusin="onFocus = true"
                       v-on:focusout="onFocus = false"
                       v-on:input="getSuggestions"
                       @compositionstart="inputLock = true"
                       @compositionend="inputLock = false">
                <img id="searchIcon" src="../../public/icons/search_icon.png" alt="search"/>
            </div>

            <div id="suggestionsWrapper"
                 ref="suggestionsWrapper"
                 v-on:mouseenter="onSuggestionBoxFocus = true"
                 v-on:mouseleave="onSuggestionBoxFocus = false"
                 v-if="onSuggestionBoxFocus || onFocus">
                <div v-for="(suggestion, index) in suggestions"
                     :key="index"
                     :id="'suggestion_' + index"
                     :ref="'suggestion_' + index"
                     @click="openSuggestionSite(index)">
                    {{suggestion}}
                </div>
            </div>
        </div>

        <footer>
            © 2022 nobody ｜ All rights reserved
        </footer>
    </div>
</template>

<script>
import EntryBox from "@/components/HomeEntries/EntryBox";
import CountDownPanel from "@/components/CountDown/CountDownPanel";

const KEYCODE_ARROW_UP = 38;
const KEYCODE_ARROW_DOWN = 40;
const WEB_URL_PREFIXES = ['https://', 'http://'];

const SEARCH_ENGINE_BING = 'search_engine_bing';
const SEARCH_ENGINE_GOOGLE = 'search_engine_google';
const SEARCH_ENGINE_BAIDU = 'search_engine_baidu';

export default {
    name: "Home",
    components: {
        CountDownPanel,
        EntryBox,
    },
    created() {
        this.getCurrentTime();
        this.loadCountDowns();
        setInterval(this.getCurrentTime, 1000);
    },
    mounted() {
        addEventListener('keyup', this.keyup)
    },
    data() {
        return {
            userInput: '',
            inputLock: false,
            onFocus: false,

            // 搜索建议相关
            seq: -1,
            suggestionCurSelectIdx: -1,
            onSuggestionBoxFocus: false,

            time: {
                month: "",
                day: "",
                hour: "",
                minute: "",
                second: ""
            },
            suggestions: []
        }
    },
    methods: {
        /**
         * 获取搜索建议
         */
        getSuggestions() {
            if (this.inputLock) {
                // 正在用输入法，别理会……
                return;
            }

            const that = this;
            that.suggestions = [];
            if (that.userInput === '') {
                return;
            }

            that.seq = new Date().getTime()
            this.$axios
                .get("/get_search_suggestions", {
                    params: {
                        engine: that.$store.state.suggestionEngine,
                        seq: that.seq,
                        input: this.userInput
                    },
                    timeout: 1000,
                })
                .then(resp => {
                    if (resp.data.code === 0 && resp.data.data.seq === that.seq) {
                        that.suggestions = resp.data.data.suggestions;
                        that.suggestionCurSelectIdx = -1;
                        console.log('search suggestions are: ', that.suggestions)
                    } else {
                        console.log('resp code unexpected or resp seq didn\'t match')
                    }
                })
                // eslint-disable-next-line no-unused-vars
                .catch(failResp => {
                    console.log(failResp)
                })
        },

        /**
         * 回车查询
         */
        submit() {
            if (this.inputLock) {
                return;
            }
            for (let i = 0; i < WEB_URL_PREFIXES.length; ++i) {
                if (this.userInput.startsWith(WEB_URL_PREFIXES[i])) {
                    location.href = this.userInput;
                    return;
                }
            }
            let engine = this.$store.state.searchEngine;
            location.href = this.getEnginePrefix(engine) + this.userInput
            // window.open(this.webPrefix + this.userInput,'_blank')  // 新窗口打开
        },

        getEnginePrefix(engine) {
            if (engine === SEARCH_ENGINE_GOOGLE) {
                return 'https://www.google.com/search?q=';
            } else if (engine === SEARCH_ENGINE_BAIDU) {
                return 'https://www.baidu.com/s?ie=utf-8&word=';
            } else if (engine === SEARCH_ENGINE_BING) {
                return 'https://cn.bing.com/search?q=';
            }
        },

        /**
         * 搜索建议点击事件
         * @param index 所选建议 idx
         */
        openSuggestionSite(index) {
            this.onSuggestionBoxFocus = false;
            let suggestion = this.suggestions[index]
            let engine = this.$store.state.searchEngine;
            location.href = this.getEnginePrefix(engine) + suggestion
            // window.open(this.webPrefix + suggestion,'_blank')  // 新窗口打开
        },

        /**
         * 键盘事件监听处理，主要用于处理搜索建议键盘选择
         * @param e
         */
        keyup(e) {
            let that = this;
            let suggestionsLength = that.suggestions.length;
            let lastSelectIdx = that.suggestionCurSelectIdx;
            let curSelectIdx;

            // 针对搜索建议支持「上下」选择
            if (suggestionsLength === 0 || !that.onFocus) {
                // 没结果或者不在输入就不处理
                return;
            }
            let keyCode = e.keyCode

            // 搜索建议选择
            if (keyCode === KEYCODE_ARROW_DOWN || keyCode === KEYCODE_ARROW_UP) {
                if (keyCode === KEYCODE_ARROW_DOWN) {
                    curSelectIdx = (lastSelectIdx + 1) % suggestionsLength;
                } else {
                    curSelectIdx = (lastSelectIdx === 0) ? suggestionsLength - 1 : lastSelectIdx - 1;
                }
                // update
                that.suggestionCurSelectIdx = curSelectIdx;

                // 样式更变、输入框内容变化
                that.$refs[`suggestion_${curSelectIdx}`][0].style = 'text-indent: 30px;' +
                    'border-radius: 20px; background: rgba(245, 241, 241, 0.7);';
                if (lastSelectIdx >= 0)  {
                    this.$refs[`suggestion_${lastSelectIdx}`][0].style = ''
                }
                that.userInput = that.suggestions[curSelectIdx]
            } else {
                // TODO enter 输入法问题
                // tbd
            }
        },

        getCurrentTime() {
            let that = this;
            let date = new Date()
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            that.time.month = month;
            that.time.day = day;
            that.time.hour = hours;
            that.time.minute = minutes;
            that.time.second = seconds;
        },
        loadCountDowns() {
            console.log('loading countdowns for the first time >>>')
            let that = this;
            that.$axios
                .get("/countdown/get_all")
                .then(resp => {
                    if (resp.data.code === 0) {
                        let countDowns = resp.data.data['countDowns'];
                        this.$store.commit('initCountDownEvents', [countDowns, false]);
                        // for (let i = 0; i < countDowns.length; ++i) {
                            // this.$store.commit('updateCountDownEvents', {
                            //     id: countDowns[i]['id'],
                            //     name: countDowns[i]['eventName'],
                            //     remainingTime: 20,
                            //     expirationTime: countDowns[i]['expirationDate'],
                            //     measurement: 'd'
                            // });
                        // }
                    } else {
                        this.$store.commit('initCountDownEvents', [[], true]);
                        this.$message({
                            message: '当前无法获取倒数日信息，请稍后再试',
                            type: 'warning'
                        });
                    }
                })
                // eslint-disable-next-line no-unused-vars
                .catch(failResp => {
                    console.log(failResp)
                    this.$store.commit('initCountDownEvents', [[], true]);
                    this.$message({
                        message: '后端没开',
                        type: 'warning'
                    });
                })
        },
    }
}
</script>

<style>
@import '../css/common.css';

html,body {
    margin:0;
    padding:0;
    overflow: hidden;
}

#background {
    background: no-repeat center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    overflow: hidden;
    z-index: -100;
    object-fit: cover;
    transition: opacity 1s, transform .25s, filter .25s;
    -webkit-transition: opacity 1s, transform .25s, filter .25s;
    backface-visibility: hidden;
    display: block;
}

#background.onFocus {
    background-position: center;
    transform: scale(1.1);
    position: fixed;
    background-repeat: no-repeat;
}

footer {
    height: 30px;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: -99;
    color: rgb(73, 70, 70);
    font-size: small;
}

/*蒙层，禁止背景拖动*/
.cover {
    background-size: cover;
    z-index: -1;
    position: fixed;
    left: 0;
    top: 0;
    margin-bottom: 10px;
    width: 110%;
    height: 110%;
    transition: .25s;
    -webkit-transition: .25s;
    /*background-image: radial-gradient(rgba(220, 220, 220, 0.1), rgba(239, 182, 189, 0.3));*/
}

.cover.onFocus {
    background-color: rgba(73, 72, 72, 0.07);
    backdrop-filter: blur(5px);
    position: fixed;
    background-repeat: no-repeat;
}

#content {
    align-items: center;
    display: flex;
    flex-direction: column;
    min-width: fit-content;
    z-index: 1;
    font-family: "Microsoft Yahei Light", "Microsoft Yahei", PingFangSC-Regular, Helvetica, sans-serif, 等线;
}

#clock {
    color: #fff;
    font-size: 36px;
    text-align: center;
    font-weight: inherit;
    text-shadow: 0 0 20px rgb(0 0 0 / 35%);
    transition: .25s;
    -webkit-transition: .25s;
    line-height: 20px;
    animation-delay: 0s;
    margin-top: 180px;
    user-select: none;
}

#inputWrapper {
    margin-top: 5px;
    position: relative;
}

.searchInput {
    border: 1px solid transparent;
    border-radius: 25px;
    box-shadow: rgb(255, 192, 203) 0 0 3px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    width: 200px;
    height: 37px;
    outline: none;
    padding-inline-end: 44px;
    padding-inline-start: 52px;
    position: relative;

    transition: .25s;
    -webkit-transition: .25s;
}

.searchInput:hover {
    background: rgba(255, 255, 255, 0.6);
    width: 250px;
}

.searchInput:focus {
    background: rgba(255, 255, 255, 0.9);
    width: 500px;
}

.searchInput::placeholder {
    text-align: center;
}

.searchInput.onFocus::placeholder {
    text-align: left;
}

#searchIcon {
    height: 60%;
    left: 12px;
    margin-top: 6px;
    position: absolute;
    background: rgba(0, 0, 0, 0.02);
    top: 0;
    Opacity: 0.2;
}

#suggestionsWrapper {
    margin-top: 20px;
    height: auto;
    width: 500px;
    border-radius: 20px;
    box-shadow: rgb(255, 192, 203) 0 0 3px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    transition: .25s;
    -webkit-transition: .25s;
}

#suggestionsWrapper div {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /*-webkit-line-clamp: 1;*/
    overflow: hidden;
    text-align: left;
    font-size: 14px;
    clear: both;
    width: 100%;
    height: 32px;
    text-indent: 20px;
    line-height: 30px;
    cursor: pointer;

    color: rgba(51, 41, 41, 0.8);
    transition: .25s;
    transition-property: text-indent;
}

#suggestionsWrapper div:hover {
    text-indent: 30px;
    border-radius: 20px;
    background: rgba(245, 241, 241, 0.7);
}

#countDownPanel {
    /*left: 50%;*/
    /*下面这个虽然呢让其居中，但是会导致子元素不能fixed布局*/
    /*transform: translate(-50%, -50%);*/

    /*能力原因，居右对齐了，呵呵*/
    right: 10px;
    bottom: 30px;

    /*无效*/
    /*alignment: center;*/
    position: fixed;
    z-index: 1;
    cursor: pointer;
}
</style>

