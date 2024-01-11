<template>
  <div id="wrapper">
    <el-container class="container" style="height: 100%">
      <el-header class="navi_header">
        <el-row>
          <el-col :span="24">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-wrapper child">
              <el-breadcrumb-item>CSGO</el-breadcrumb-item>
              <el-breadcrumb-item>个人仓库</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <el-row class="title-row">
          <!--          CSGO 物品查询、历史价格查询及入库中心-->
          <el-col :span="24"><span class="title-text">CSGO 个人仓库</span></el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="search-box" style="text-align: left" v-loading="statusLoading">
          <div class="search-row">
            <span class="search-text">
              共持有物品 {{ itemCount }} 个，共花费 {{spentTotalPrice}} 元，现在持有价值 {{currentTotalPrice}} 元，
              收益 {{gain}} 元。
            </span>
          </div>
        </div>
        <div class="display-box" v-loading="mainLoading">

          <template>
            <el-table class="result-table" :data="tableData" max-height="700" style="width: 100%">
              <el-table-column fixed prop="itemId" label="编号" width="100"></el-table-column>
              <el-table-column prop="picUrl" label="图片" width="150">
                <template scope="scope">
                    <div class="demo-image__preview">
                      <el-image style="width: 100px; height: 100px; margin-left:10px;"
                             :src=" scope.row.picUrl">
                      </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="nameCn" label="中文名" width="300"></el-table-column>
              <el-table-column prop="boughtPrice" label="购买价格" width="150"></el-table-column>
              <el-table-column prop="currentPrice" label="最新价格" width="150"></el-table-column>
              <el-table-column prop="nameEng" label="英文名" width="300"></el-table-column>
              <el-table-column prop="exterior" label="磨损" width="150">
                <template slot-scope="scope">
                  <el-tag
                    :type="exteriorTagMap[scope.row.exterior]"
                    disable-transitions>{{scope.row.exterior}}</el-tag>
                </template>

              </el-table-column>
              <el-table-column prop="mainType" label="主要类别" width="130"></el-table-column>
              <el-table-column prop="boughtTime" label="购买时间" width="150"></el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="170"></el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                width="220">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteInventory(scope.$index, tableData)" type="text" size="median">
                    删除
                  </el-button>
                  <el-button
                    @click.native.prevent="requestHistoryPrice(scope.$index, tableData)" type="text" size="median">
                    查看历史价格
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <el-dialog :visible.sync="chartVisible" width="65%">
            <div id="priceLineChart" style='width: 90%; height: 500px; overflow: auto; left: 50px; text-align: center;'></div>
          </el-dialog>

          <el-row class="title-row" style="margin-top: 15px;">
            <el-col :span="4">
              <el-pagination layout="total, prev, pager, next" :total="totalEntries"
                             :current-page.sync="currentPage"
                             @current-change="changePage"
                             style="margin-left: 20px"/>
            </el-col>
            <el-col :span="18"></el-col>
          </el-row>

        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'CSGOInventory',
  components: {},
  data () {
    return {
      tableData: [],

      exteriorTagMap: {
        '崭新出厂': 'primary',
        '略有磨损': 'success',
        '久经沙场': 'info',
        '破损不堪': 'warning',
        '战痕累累': 'danger'
      },
      mainTypes: ['匕首', '手套', '手枪', '步枪', '狙击步枪'],

      totalEntries: 100,

      // 查询相关
      currentPage: 1,
      searchName: '',
      searchMainType: '',
      searchSubType: '',
      searchExterior: '',
      searchPageSize: 10,

      chartVisible: false,
      loading: false,

      // 总览
      // 共持有物品 {{ itemCount }} 个，共花费 {{spentTotalPrice}} 元，现在持有价值 {{currentTotalPrice}} 元，
      //         收益 {{gain}} 元。
      itemCount: 0,
      spentTotalPrice: 0,
      currentTotalPrice: 0,
      gain: 0,

      statusLoading: false,
      mainLoading: false,
    }
  },
  mounted () {
    this.statusLoading = true
    this.mainLoading = true
    this.queryInventory()
    this.queryStatus()
    // this.getDivHeight()
    // window.addEventListener('resize', this.getDivHeight)
  },
  destroyed() {
    // window.removeEventListener('resize', this.getDivHeight, false)
  },
  methods: {
    changePage() {
      this.mainLoading = true
      this.queryInventory()
    },

    getDivHeight() {
      // const screenheight = window.innerHeight
      // this.$refs.display.style.height = screenheight - 704 + 'px'
      // 704 为 头部组件高度 + 底部组件高度
      // mainDiv 为需控制高度自适应盒子，通过 ref="mainDiv" 绑定
    },

    queryInventory () {
      const _this = this;
      _this.$axios
        // .get('/csgo/get_user_items', {
        .get('/csgo/get_user_items_with_update_price', {
          params: {
            page: _this.currentPage,
            pageSize: _this.searchPageSize,
          },
        }).then(resp => {
        if (resp.data.code === 0) {
          const data = resp.data.data
          _this.tableData = data.records
          _this.totalEntries = data.total
          this.mainLoading = false
        } else {
          this.$notify({
            title: '错误',
            message:  resp.data.msg,
            type: 'warning'
          });
          this.mainLoading = false
        }

      })
        // eslint-disable-next-line no-unused-vars
        .catch(failResponse => {
          this.$notify({
            title: '错误',
            message: failResponse,
            type: 'warning'
          });
          this.mainLoading = false
        })
    },

    queryStatus() {
      const _this = this;
      _this.$axios
        // .get('/csgo/get_user_items', {
        .get('/csgo/inventory_status', {
        }).then(resp => {
        if (resp.data.code === 0) {
          const data = resp.data.data
          _this.itemCount = data.itemCount
          _this.spentTotalPrice = data.spentTotalPrice
          _this.currentTotalPrice = data.currentTotalPrice
          _this.gain = data.gain
          _this.statusLoading = false
        } else {
          this.$notify({
            title: '获取总览错误',
            message:  resp.data.msg,
            type: 'warning'
          });
          _this.statusLoading = false
        }

      })
        // eslint-disable-next-line no-unused-vars
        .catch(failResponse => {
          this.$notify({
            title: '获取总览错误',
            message: failResponse,
            type: 'warning'
          });
          _this.statusLoading = false
        })
    },

    deleteInventory (idx, rows) {
      let _this = this
      const itemName = rows[idx].nameCn
      const itemId = rows[idx].id
      _this.$axios
        .post('/csgo/del_user_item', {
          itemId: itemId
        }).then(resp => {
        if (resp.data.code === 0) {
          this.$notify({
            title: '删除库存',
            message: itemName + ' 删除库存成功',
            type: 'success'
          });
          rows.splice(idx, 1);
        } else {
          this.$notify({
            title: '删除库存失败',
            message: resp.data.msg,
            type: 'warning'
          });
        }
      })
        .catch(failResponse => {
          this.$notify({
            title: '删除库存失败',
            message: failResponse,
            type: 'warning'
          });
        })
    },

    requestHistoryPrice(idx, rows) {
      const itemId = rows[idx].itemId
      const itemName = rows[idx].nameCn
      this.handleRequestHistoryPrice(itemId, itemName)
    },

    handleRequestHistoryPrice(itemId, itemName) {
      let _this = this

      _this.loading = true
      _this.$axios
        .post('/csgo/get_item_price', {
          itemId: itemId
        }).then(resp => {
        if (resp.data.code === 0) {
          console.log(resp.data)
          this.$notify({
            title: '价格查询成功',
            message: itemName + ' 价格查询完毕',
            type: 'success'
          });
          _this.chartVisible = true
          _this.loading = false
          this.$nextTick(() => {
            this.drawHistoryPriceChart(resp.data.data, itemName)
          })
        } else {
          this.$notify({
            title: '价格查询失败',
            message: resp.data.msg,
            type: 'warning'
          });
          _this.loading = false
        }

      })
        .catch(failResponse => {
          this.$notify({
            title: '价格查询失败',
            message: failResponse,
            type: 'warning'
          });
          _this.loading = false
        })
    },

    drawHistoryPriceChart (data, itemName) {
      let prices = []
      let dates = []
      let titleText = itemName + ' 历史价格记录'
      for (let i = 0; i < data.length; ++i) {
        prices.push(data[i].price)
        dates.push(data[i].time)
      }
      prices.reverse()
      dates.reverse()
      let chart = this.$echarts.init(document.getElementById('priceLineChart'))
      chart.setOption({
        title: {
          text: titleText,
          left: 'center',
          top: '5%'
        },
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   top: '8%',
        //   bottom: '5%',
        //   data: types
        // },
        grid: {
          height: '60%',
          left: '3%',
          right: '4%',
          top: '17%',
          containLabel: true
        },
        toolbox: {
          show: true,
          left: '4%',
          top: '2%',
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ['toolbox'],
              pixelRatio: 2
            },
            dataZoom: {
              show: true
            }
          }
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value',
          name: '￥'
        },
        series: [
          {
            data: prices,
            type: 'line'
          }
        ]
      })
    },

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

.el-input {
  width: 200px;
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
//padding: 0 0  20px 20px;
}


</style>
