<template>
  <div id="wrapper">
    <el-container class="container" style="height: 100%">
      <el-header class="navi_header">
        <el-row>
          <el-col :span="24">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-wrapper child">
              <el-breadcrumb-item>CSGO</el-breadcrumb-item>
              <el-breadcrumb-item>排行榜</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <el-row class="title-row">
          <!--          CSGO 物品查询、历史价格查询及入库中心-->
          <el-col :span="24"><span class="title-text">CSGO 排行榜</span></el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="search-box">
          <div class="search-row">
            <span class="search-text">
              您目前的排名是 {{userRank}} ！
            </span>
          </div>
        </div>

        <div class="display-box" v-loading="loading" >
          <template>
            <el-table class="result-table" :data="tableData"  max-height="700" style="width: 98%">
              <el-table-column  type="index" align="center" :resizable="false" label="名次" width="250">
                <template slot-scope="scope">
                  <span v-if="scope.$index+1 ===1"><img class="noImg" src="../../assets/gold.png" alt=""/></span>
                  <span v-else-if="scope.$index+1 ===2"><img class="noImg" src="../../assets/silver.png" alt=""/></span>
                  <span v-else-if="scope.$index+1 ===3"><img class="noImg" src="../../assets/copper.png" alt=""/></span>
                  <span v-else class="no">{{scope.$index+1}} </span>
                </template>

              </el-table-column>
              <el-table-column prop="userName" align="center" label="用户名" width="300"></el-table-column>
              <el-table-column prop="ownPrice" align="center" label="持有价格"></el-table-column>
            </el-table>
          </template>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'CSGORank',
  components: {},
  data () {
    return {
      tableData: [{ 'idx': 1, 'userName': 'nobody', 'ownPrice': 2000},
        {'idx': 2,  'userName': 'nobody', 'ownPrice': 2000},{'idx': 2,  'userName': 'nobody', 'ownPrice': 2000},{ 'idx': 3, 'userName': 'nobody', 'ownPrice': 2000}],

      loading: false,
      userRank: 0,
    }
  },
  mounted () {
    this.requestRanking()
  },
  methods: {
    requestRanking() {
      const _this = this;
      _this.loading = true
      _this.$axios
        // .get('/csgo/get_user_items', {
        .get('/csgo/ranking', {
        }).then(resp => {
        if (resp.data.code === 0) {
          _this.tableData = resp.data.data
          _this.userRank = resp.data.msg
          this.loading = false
        } else {
          this.$notify({
            title: '获取排名错误',
            message:  resp.data.msg,
            type: 'warning'
          });
          this.loading = false
        }

      })
        // eslint-disable-next-line no-unused-vars
        .catch(failResponse => {
          this.$notify({
            title: '获取排名错误',
            message: failResponse,
            type: 'warning'
          });
          this.loading = false
        })
    }
  },

}

</script>

<style scoped>
#wrapper {
  height: 95%;
}

.navi_header {
  background-color: white;
  color: #333;
  height: 90px !important;
  border-radius: 10px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: 2000px;
//line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.breadcrumb-wrapper {
  margin-top: 20px;
  width: 100%;
}

.el-col {
  text-align: left;
}

.title-row {
  height: 20px;
  text-align: left;
  margin-top: 8px;
}

.title-text {
  text-align: left;
  margin-right: 12px;
  margin-bottom: 0;
  color: rgba(0,0,0,.85);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hint-text {
  color: rgba(98, 97, 97, 0.63);
  text-overflow: ellipsis;
  font-size: 14px;
}

.latlng-hint-text {
  color: rgba(98, 97, 97, 0.63);
  text-overflow: ellipsis;
  font-size: 14px;
  margin-left: 12px;
  margin-right: 12px;
}

.search-box {
  margin-left: -20px;
  margin-right: -20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  min-height: 20px;
  background-color: white;
  border-radius: 10px;
}

.display-box {
  position: marker;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 20px;
  height: 800px;
  background-color: white;
  border-radius: 10px;
//overflow: auto;
}

.search-row {
  text-align: left;
  padding-top: 20px;
}

.search-text  {
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 15px;
  margin-left: 23px;
  margin-right: 23px;
}

.select-icon {
  margin-left: 20px;
  margin-right: 10px;
}


.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.search-btn {
  width: 150px;
  margin-left: 20px;
  margin-bottom: 20px;
}
.result-table {
  margin-left: 10px;
  margin-bottom: 20px;
  text-align: center;
//padding: 0 0  20px 20px;
}

/deep/ .el-dialog {
  border-radius: 15px;
}


.noImg {
  height: 40px;
  width: 40px;
}
</style>
