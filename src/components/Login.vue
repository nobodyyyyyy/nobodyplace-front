<template>
  <!-- ❕ 登录功能目前用不到 ❕ 只是一个demo而已 ❕-->
  <body id="poster">
  <el-form class="login-container" label-position="left"
           label-width="0px">
    <h3 class="login_title">登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      responseResult: []
    }
  },
  methods: {
    login() {
      const _this = this;
      // console.log(this.$store.state)
      this.$axios
        .post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(resp => {
          if (resp.data.code === 0) {
            _this.$store.commit('login', _this.loginForm);
            const data = resp.data.data
            localStorage.setItem("id", data.id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.userName);
            this.$notify({
              title: '成功',
              message: '登录成功，欢迎光临，' + localStorage.getItem("name"),
              type: 'success'
            });
            const path = this.$route.query.redirect;
            this.$router.replace({path: path === '/' || path === undefined ? '/Main' : path})
          } else {
            this.$notify({
              title: '密码错误',
              message: '请重新输入密码',
              type: 'warning'
            });
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(failResponse => {
          this.$notify({
            title: '错误',
            message: failResponse,
            type: 'warning'
          });
        })
    }
  }
}
</script>

<style>

#poster {
  background: url("../../public/backgrounds/default_background_1.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
