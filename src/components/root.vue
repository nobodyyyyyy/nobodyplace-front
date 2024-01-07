<template>
  <div id="app">
    <el-container id="app">
      <el-header class="header-view">
        <div style="float: left;  left: 2%;">
          <img :src="iconImg" style="padding-top: 5px; padding-right: 6px; height: 40px; width: 40px" alt="">
          <span style="position: absolute; line-height: 55px; font-size: 23px; font-weight: bold; color: white">
            nobodyplace
          </span>

          <span style="position: absolute; line-height: 55px; font-size: 15px; color: white; right:20px">
            欢迎，{{username}}
          </span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <nav-menu></nav-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import NavMenu from "@/components/Common/NavMenu.vue";

export default {
  name: 'Home',
  components: {NavMenu},
  mounted: function() {
    this.$nextTick(() => {
      this.username = localStorage.getItem("name")
    });
  },
  data () {
    return {
      iconImg: require('../assets/pig.gif'),
      username: ""
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
//line-height: 60px;
}

.header-view {
  height: 50px !important;
  background: rgb(65, 112, 157);
}

.el-aside {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 200px;
//border: 412px #B3C0D1;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
//line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}


</style>
