<template>
  <div id="app">
    <div class="wrapper">
      <div class="background">
<!--        <img :src="backgroundImg" width="100%" height="100%" alt="" />-->
      </div>
      <div class="content">
<!--        <img class="title-img" :src="titleImg" alt=""/>-->
      </div>
      <el-button v-on:click="click"/>
      <el-button v-on:click="testsend"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  components: {},
  data () {
    return {
      socket: null
      // backgroundImg: require('../assets/login.jpg'),
      // titleImg: require('../assets/title.png')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    click() {
      // this.callAsync()
      this.init();
    },

    testsend() {
      const _this = this;
      _this.$axios
        .get('/send', {

        }).then(resp => {
        if (resp.status === 200) {
          console.log('ok')
        } else {
          console.log('err')
        }
      })
        .catch(failResponse => {
          // this.$message({
          //   message: failResponse,
          //   type: 'warning'
          // });
        })
    },

    callAsync() {
      const _this = this;
      _this.$axios
        .get('/asyncFuture', {

        }).then(resp => {
        if (resp.data.code === 0) {
          this.$message({
            message: '登录成功，欢迎光临，' + localStorage.getItem("name"),
            type: 'success'
          });
        } else {
          console.log(resp.data)
          this.$message({
            message: resp.data.msg,
            type: 'warning'
          });
        }
      })
        .catch(failResponse => {
          this.$message({
            message: failResponse,
            type: 'warning'
          });
        })
    },

    // 初始化方法
    init() {

      //1、websocket接口的url
      let ws = "ws://localhost:8080/notice/" + localStorage.getItem("id");

      // 实例化socket
      this.socket = new WebSocket(ws);
      // 监听socket连接
      this.socket.onopen = this.socketOpen;
      // 监听socket错误信息
      this.socket.onerror = this.error;
      // 监听socket消息
      this.socket.onmessage = this.getMessage;
      // 监听socket断开连接的消息
      this.socket.close = this.close;
    },

// 连接成功方法
    socketOpen() {
      console.log("socket连接成功");
    },
// 连接错误
    error() {
      console.log("连接错误");
    },
// 接受信息接口
    getMessage(message) {
      console.log("收到消息");
      this.$notify({
        title: "消息通知",
        type: "success",
        message: message.data,
      });
    },
// 关闭处理
    close() {
      console.log("连接关闭");
    }
  }
}
</script>

<style scoped>
.background {
  //background-color: red;
  width:85%;
  height:90%;  /**宽高100%是为了图片铺满屏幕 **/
  position: absolute;
  z-index:-1;
  opacity: 0.75;
}

.content {
  width:70%;
  height:70%;  /**宽高100%是为了图片铺满屏幕 **/
  position: absolute;
  z-index:-1;
}

.entry {
//height: 20%;
//width: 34%;
//background: rgba(253, 247, 247, 0.24);
//margin-top: 400px;
//margin-left: 100px;
  border-radius: 20px;
//text-align: left;
}

.entry-btn {
  width: 300px;
//height: 60px;
  font-size: 25px;
  border: 0;
  background: rgba(253, 252, 252, 0.8);
}

.title-img{
  margin-top: 70px;
  width: 60%;
  height: 20%;
}

.el-aside {
  background-color: rgba(243, 241, 241, 0.5);
  color: #333;
//text-align: center;
//line-height: 100px;
  height: 100%;
}

.el-main {
//background-color: #E9EEF3;
  color: #333;
  text-align: center;
//line-height: 160px;
  height: 100%;
}

.title {
  color:black;
  text-align: left;
  font-size: 20px;
  margin-top: 250px;
  z-index: 1;
}

</style>
