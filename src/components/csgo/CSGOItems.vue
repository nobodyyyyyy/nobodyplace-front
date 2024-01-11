<template>
  <div id="wrapper">
    <el-container class="container" style="height: 100%">
      <el-header class="navi_header">
        <el-row>
          <el-col :span="24">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-wrapper child">
              <el-breadcrumb-item>CSGO</el-breadcrumb-item>
              <el-breadcrumb-item>物品查询</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <el-row class="title-row">
<!--          CSGO 物品查询、历史价格查询及入库中心-->
          <el-col :span="24"><span class="title-text">CSGO 物品中心</span></el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="search-box">

          <div class="search-row">
            <span class="search-text">中文名&ensp;</span>
            <el-input placeholder="请输入中文名称" v-model="searchName" size="small" style="width: 200px">
            </el-input>
            <span class="search-text">磨损</span>
            <el-select v-model="searchExterior" clearable placeholder="请选择" size="small">
              <el-option
                v-for="(value, key) in exteriorTagMap"
                :key="key"
                :label="key"
                :value="key">
              </el-option>
            </el-select>

            <span class="search-text">主要类别</span>
            <el-select v-model="searchMainType" clearable placeholder="请选择" size="small">
              <el-option
                v-for="key in mainTypes"
                :key="key"
                :label="key"
                :value="key">
              </el-option>

            </el-select>

            <el-button style="margin-left: 20px" round size="small" v-on:click="onSearchBtnClicked">&ensp;&ensp; 搜索 &ensp;&ensp;</el-button>
          </div>

        </div>
        <div class="display-box" v-loading="loading">

          <template>
            <el-table class="result-table" :data="tableData" max-height="700" style="width: 100%">
              <el-table-column fixed prop="itemId" label="编号" width="150"></el-table-column>
              <el-table-column prop="picUrl" label="图片" width="250">
                <template scope="scope">
                    <div class="demo-image__preview">
                      <el-image style="width: 100px; height: 100px; margin-left:10px;"
                             :src=" scope.row.picUrl">
                      </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="nameCn" label="中文名" width="400"></el-table-column>
              <el-table-column prop="nameEng" label="英文名" width="400"></el-table-column>
              <el-table-column prop="exterior" label="磨损" width="150">
                <template slot-scope="scope">
                  <el-tag
                    :type="exteriorTagMap[scope.row.exterior]"
                    disable-transitions>{{scope.row.exterior}}</el-tag>
                </template>

              </el-table-column>
              <el-table-column prop="mainType" label="主要类别" width="150"></el-table-column>
              <el-table-column prop="subType" label="次要类别" width="150"></el-table-column>

              <el-table-column
                fixed="right"
                label="操作"
                width="220">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="addToInventory(scope.$index, tableData)" type="text" size="median">
                    入库
                  </el-button>
                  <el-button
                    @click.native.prevent="requestHistoryPrice(scope.$index, tableData)" type="text" size="median">
                    查看历史价格
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog title="物品入库" :visible.sync="dialogFormVisible" width="25%">
              <el-form :model="addCurrentItemForm" label-position="left" size="small" style="margin-left: 40px; margin-right: 40px">
                <el-form-item label="物品编号" :label-width="'100px'">
                  <el-input v-model="addCurrentItemForm.id" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="物品名称" :label-width="'100px'">
                  <el-input v-model="addCurrentItemForm.name" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="物品磨损" :label-width="'100px'">
                  <el-input v-model="addCurrentItemForm.wear" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="购买时间" :label-width="'100px'">
                  <el-date-picker
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%"
                    v-model="addCurrentItemForm.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="购买金额" :label-width="'100px'">
                  <el-input v-model="addCurrentItemForm.cost" autocomplete="off"></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="handleAddToInventory">确 定</el-button>
              </div>
            </el-dialog>

            <el-dialog :visible.sync="chartVisible" width="65%">
              <div id="priceLineChart" style='width: 90%; height: 500px; overflow: auto; left: 50px; text-align: center;'></div>
            </el-dialog>

          </template>

          <el-row class="title-row" style=" margin-top: 15px;">
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
  name: 'CSGOItems',
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

      dialogFormVisible: false,
      currentItemId: 0,
      addCurrentItemForm: {
        name: '',
        id: '',
        wear: '',
        date: '',
        cost: 1000,
      },
      loading: false,
      chartVisible: false,
    }
  },
  mounted () {
    this.queryItemInfos()
  },
  methods: {
    changePage() {
      this.queryItemInfos()
    },

    onSearchBtnClicked() {
      this.currentPage = 1
      this.queryItemInfos()
    },

    queryItemInfos () {
      const _this = this;
      _this.$axios
        .get('/csgo/item_infos', {
          params: {
            page: _this.currentPage,
            name: _this.searchName,
            mainType: _this.searchMainType,
            subType: _this.searchSubType,
            exterior: _this.searchExterior,
            pageSize: _this.searchPageSize,
          },
          // headers: {
          //   token: localStorage.getItem('token')
          // }
        }).then(resp => {
        if (resp.data.code === 0) {
          const data = resp.data.data
          _this.tableData = data.records
          _this.totalEntries = data.total
        } else {
          this.$notify({
            title: '失败',
            message: resp.data.msg,
            type: 'warning'
          });
        }

      })
        .catch(failResponse => {
          this.$notify({
            title: '失败',
            message: failResponse,
            type: 'warning'
          });
        })
    },

    addToInventory(idx, rows) {
      let that = this
      that.dialogFormVisible = true
      that.addCurrentItemForm.id = rows[idx].itemId
      that.addCurrentItemForm.name = rows[idx].nameCn
      that.addCurrentItemForm.wear = rows[idx].exterior
      that.addCurrentItemForm.cost = 1000
      that.addCurrentItemForm.date = ''
    },

    handleAddToInventory() {
      let _this = this
      _this.dialogFormVisible = false
      _this.$axios
        .post('/csgo/add_user_item', {
          itemId: _this.addCurrentItemForm.id,
          boughtDate: _this.addCurrentItemForm.date,
          boughtPrice: _this.addCurrentItemForm.cost,
        }).then(resp => {
        if (resp.data.code === 0) {
          this.$message({
            message: _this.addCurrentItemForm.name + '添加成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: resp.data.msg,
            type: 'warning'
          });
        }

      })
        .catch(failResponse => {
          this.$notify({
            title: '失败',
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
            title: '成功',
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
            title: '失败',
            message: resp.data.msg,
            type: 'warning'
          });
          _this.loading = false
        }

      })
        .catch(failResponse => {
          this.$notify({
            title: '失败',
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
          name: '￥',
          min: function(value) {//取最小值向下取整为最小刻度
            return Math.floor(value.min)
          },
          max: function(value) {//取最大值向上取整为最大刻度
            return Math.ceil(value.max)
          },
          scale: true,
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

/deep/ .el-dialog {
  border-radius: 15px;
}
</style>
