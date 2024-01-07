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
        <div class="search-box">


        </div>
        <div class="display-box">

          <template>
            <el-table class="result-table" :data="tableData" max-height="700" style="width: 100%">
              <el-table-column fixed prop="itemId" label="编号" width="150"></el-table-column>
              <el-table-column prop="picUrl" label="图片" width="250">
                <template scope="scope">
                    <div class="demo-image__preview">
                      <el-image style="width: 100px; height: 100px; margin-left:10px;"
                             :src=" scope.row.picUrl"
                             :preview-src-list="scope.row.picUrl">
                      </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="nameCn" label="中文名" width="300"></el-table-column>
              <el-table-column prop="nameEng" label="英文名" width="300"></el-table-column>
              <el-table-column prop="exterior" label="磨损" width="150">
                <template slot-scope="scope">
                  <el-tag
                    :type="exteriorTagMap[scope.row.exterior]"
                    disable-transitions>{{scope.row.exterior}}</el-tag>
                </template>

              </el-table-column>
              <el-table-column prop="mainType" label="主要类别" width="150"></el-table-column>
              <el-table-column prop="subType" label="次要类别" width="150"></el-table-column>
              <el-table-column prop="boughtTime" label="购买时间" width="150"></el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="150"></el-table-column>
              <el-table-column prop="boughtPrice" label="购买价格" width="150"></el-table-column>

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
                    @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="median">
                    查看历史价格
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
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

    }
  },
  mounted () {
    this.queryInventory()
  },
  methods: {
    changePage() {
      this.queryInventory()
    },

    queryInventory () {
      const _this = this;
      _this.$axios
        .get('/csgo/get_user_items', {
          params: {
            page: _this.currentPage,
            pageSize: _this.searchPageSize,
          },
        }).then(resp => {
        console.log(resp)
        if (resp.data.code === 0) {
          const data = resp.data.data
          _this.tableData = data.records
          _this.totalEntries = data.total
        } else {
          this.$message({
            message: resp.data.data.msg,
            type: 'warning'
          });
        }

      })
        // eslint-disable-next-line no-unused-vars
        .catch(failResponse => {
          this.$message({
            message: failResponse,
            type: 'warning'
          });
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
          this.$message({
            message: itemName + ' 删除库存成功',
            type: 'success'
          });
          rows.splice(idx, 1);
        } else {
          this.$message({
            message: resp.data.data.msg,
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
