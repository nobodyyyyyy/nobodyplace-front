<template>
  <div>
    <img id="background" :class="{'on_focus': on_focus}" src="../../public/backgrounds/default_background_1.jpg" alt=""/>

<!--    防止组件拖动-->
    <div class="cover" id="cover" style="opacity: 1;"></div>

    <el-input id="web-search-input" v-model="search_box_input" placeholder="搜索"
              @keyup.enter.native="submit"
              v-on:focusin.native="focusOnInput"
              v-on:focusout.native="focusOutInput"
    />

  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      search_box_input: '',
      on_focus: false,
      web_prefix: 'https://www.google.com/search?q=',
    }
  },
  methods: {
    submit() {
      window.open(this.web_prefix + this.search_box_input,'_blank')
    },
    focusOnInput() {
      this.on_focus = true
    },
    focusOutInput() {
      this.on_focus = false
    },
  }
}
</script>

<style>
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
  backface-visibility: hidden;
  display: block;
}

#background.on_focus {
  /* on_focus is used, IDE is so silly*/
  background-position: center;
  transform: scale(1.1);
  filter: blur(5px);
  position: fixed;
  background-repeat: no-repeat;
}

#cover {
  z-index: -1;
  opacity: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: .25s;
  background-image: radial-gradient(rgba(220, 220, 220, 0.1), rgba(239, 182, 189, 0.3));
}

#web-search-input {
  width: 500px;
  height: auto;
  margin: 300px auto auto;
  border: 1px solid transparent;
  border-radius: 25px;
  box-shadow: rgb(255, 192, 203) 0 0 3px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);

}

</style>

