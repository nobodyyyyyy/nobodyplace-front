<template>
  <div>
<!--    <img id="background" :class="{'onFocus': onFocus}" src="../../public/backgrounds/default_background_1.jpg" alt=""/>-->

    <video id="background" autoplay loop muted :class="{'onFocus': onFocus}">
      <source src="../../public/backgrounds/background_seaside.mp4" type="video/mp4"  />
    </video>

<!--    防止组件拖动-->
    <div class="cover" id="cover" style="opacity: 1;"></div>
    <div id="content">
      <h1 id="clock">
        {{time.month}}月{{time.day}}日
        {{time.hour}}:{{time.minute}}:{{time.second}}
      </h1>
<!--      <flipping-number :value="102346"  :time="2"/>-->

      <div id="inputWrapper">
        <input id="searchInput" type="search" autocomplete="off"
               spellcheck="false" role="combobox"
               aria-live="polite" placeholder="在 Google 上搜索，或者输入一个网址"
               v-model="search_box_input" @keyup.enter="submit"
               v-on:focusin="onFocus = true"
               v-on:focusout="onFocus = false"
               v-on:input="getSuggestions"
               @compositionstart="input_lock = true"
               @compositionend="input_lock = false">

        <img id="searchIcon" src="../../public/icons/search_icon.png" alt="search"/>
      </div>

<!--      <div id="suggestionsWrapper" v-if="onFocus">-->
      <div id="suggestionsWrapper">
          <div v-for="(suggestion, index) in suggestions"
               :key="index"
               @click="openSuggestionSite(index)">
            {{suggestion}}
          </div>
      </div>
    </div>
  </div>
</template>

<script>
// import FlippingNumber from "@/components/common/flippingNumber";
export default {
  name: "Home",
  created() {
    setInterval(this.getTimesInterval, 1000);
  },
  data() {
    return {
      search_box_input: '',
      input_lock: false,
      onFocus: false,
      web_prefix: 'https://www.google.com/search?q=',
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
    getSuggestions() {
      if (this.input_lock) {
        // 正在用输入法，别理会……
        return;
      }

      const _this = this;
      _this.suggestions = [];
      if (_this.search_box_input === '') {
        return;
      }

      console.log("sending request for input: ", _this.search_box_input)
      this.$axios
          .get("/get_search_suggestions", {
            params: {
              input: this.search_box_input
            },
            timeout: 1000,
          })
          .then(resp => {
            if (resp.data.code === 200 && resp.data.data.input === _this.search_box_input) {
              _this.suggestions = resp.data.data.suggestions;
            }
            console.log('search suggestions are: ', _this.suggestions)
          })
          // eslint-disable-next-line no-unused-vars
          .catch(failResp => {
            console.log(failResp)
          })
    },
    submit() {
      window.open(this.web_prefix + this.search_box_input,'_blank')
    },
    openSuggestionSite(index) {
      let suggestion = this.suggestions[index]
      window.open(this.web_prefix + suggestion,'_blank')
    },
    getTimesInterval() {
      let _this = this;
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
      _this.time.month = month;
      _this.time.day = day;
      _this.time.hour = hours;
      _this.time.minute = minutes;
      _this.time.second = seconds;
    }
  }
}
</script>

<style>
@import '../css/common.css';

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
  filter: blur(3px);
  position: fixed;
  background-repeat: no-repeat;
}

/*蒙层，禁止背景拖动*/
#cover {
  z-index: -1;
  opacity: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: .25s;
  -webkit-transition: .25s;
  background-image: radial-gradient(rgba(220, 220, 220, 0.1), rgba(239, 182, 189, 0.3));
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
  font-weight: inherit;
  text-shadow: 0 0 20px rgb(0 0 0 / 35%);
  transition: .25s;
  -webkit-transition: .25s;
  line-height: 20px;
  animation-delay: 0s;
  margin-top: 180px;
  user-select: none;

  /*transform: rotateX(360deg);*/
  /*-webkit-transform: rotateX(360deg); !* Safari 与 Chrome *!*/
  /*transition-duration: 0.25s;*/
}

#inputWrapper {
  margin-top: 5px;
  position: relative;
}

#searchInput {
  border: 1px solid transparent;
  border-radius: 25px;
  box-shadow: rgb(255, 192, 203) 0 0 3px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  width: 200px;
  height: 35px;
  outline: none;
  padding-inline-end: 44px;
  padding-inline-start: 52px;
  position: relative;

  transition: .25s;
  -webkit-transition: .25s;
}

#searchInput:hover {
  background: rgba(255, 255, 255, 0.6);
  width: 500px;
}

#searchInput:focus {
  background: rgba(255, 255, 255, 0.9);
  width: 500px;
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
  height: 100%;
  width: 500px;
  background: red;
  border-radius: 20px;
  box-shadow: rgb(255, 192, 203) 0 0 3px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  /*transition-property: text-indent;*/
}

#suggestionsWrapper div:hover {
  text-indent: 30px;
  border-radius: 20px;
  background: rgba(245, 241, 241, 0.7);
}

/*搜索建议显示动画*/
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>

