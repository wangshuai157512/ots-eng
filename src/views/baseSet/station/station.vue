<template>
    <div class="stationBox">
        <!-- 标题 -->
        <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
        <!-- 搜索框 -->
        <div class="searchCon">
          <div class="searchMain">
            <ots-refer
                :selectList="selectList"
                :request-form="selectForm"
                @search="getResult"
            />
          </div>
        </div>
        <!-- 列表 -->
        <div class="mainCon">
          <ots-table-group
            :tableHeader="tableHeader"
            :tableOption="tableOption"
            :tableData="tableData"
            :batchOperBtn="batchOperBtn"
            @handleSelectionChange="bachOper"
            :pagination="pagination"
            @changeNum="changeSize"
            @changePage="changePage"
          ></ots-table-group>
        </div>
        <!-- 弹窗 -->
        <ots-custom-dialog :dialog.sync="addDialog" :title="form.code?'修改':'添加函授站'" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-form-item label="函授站名称" class="childrenName" prop="name">
                            <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态">
                            <el-radio-group v-model="form.state">
                                <el-radio-button label=1>启用</el-radio-button>
                                <el-radio-button label=0>停用</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round @click="addDialog=false">取消</el-button>
                <el-button round type="primary" @click="addStation">确定</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>
<script>
import { getAllStation, addStationFn, updateStationFn, deleteStationFn, updateStationStateFn } from '@/http/modules/baseSet/station'
export default {
  name: 'station',
  data () {
    return {
      selectIds: [],
      selectList: [
        {
          title: "状态",
          type: "select",
          requestKey: "state",
          label: 'key',
          value: 'value',
          data: [
            {
              key : '全部',
              value : -1
            },
            {
              key : '启用',
              value : 1
            },
            {
              key : '停用',
              value : 0
            }
          ],
        },
        {
          title : '函授站名称',
          type : 'input',
          placeholder : '请输入函授站名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : 1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "函授站名称",
              prop: "name"
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changeStationState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editStation
                  },
                  {
                      title:"删除",
                      click: this.deleteStation
                  },
              ]
          }
      ],
      tableOption: {
          multiple:true
      },
      batchOperBtn:[
        //   {
        //       title: "导出",
        //       icon: "iconfont icon-daochu",
        //       click: this.exportStation
        //   },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteStation
          },
      ],
      tableData: [],
      form: {
        name: '',
        state: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入函授站名称', trigger: 'blur'}
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addStationDialog
        }
      ],
      addDialog: false,
      pagination: {
        total: 0
      },
      StationListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  created () {
    this.getAllStationFn()
  },
  methods: {
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    addStationDialog () {
      this.resetForm()
      this.addDialog = true
    },
    addStation () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let params = {...this.form}
              for (let key in params) {
                  if (key.startsWith('form_')) {
                      delete params[key]
                  }
              }
              const useFn = params.id ? updateStationFn : addStationFn
              const { code } = await useFn(params)
              if (code ==  1) {
                this.$message.success('操作成功')
                this.addAfter()
              }
          } else {
              return false;
          }
      });
    },
    editStation (row) {
      console.log(row)
      this.form = Object.assign(this.form, row)
      this.addDialog = true
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择函授站')
        return false
      }
    },
    exportStation () {
      if (this.beforeBatch()) {

      }
    },
    deleteStation (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该函授站?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteStationFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllStationFn()
          }
        }).catch(() => {        
        });
    },
    async changeStationState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updateStationStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllStationFn()
      }
    },
    async getAllStationFn () {
      this.StationListParams = Object.assign(this.StationListParams, this.selectForm)
      const { data } = await getAllStation(this.StationListParams)
      this.tableData = data.records
      this.pagination.total = data.total
    },
    resetForm() {
      this.form = {
        name: '',
        state: 1,
      }
    },
    addAfter () {
      this.addDialog = false
      this.resetForm()
      this.getAllStationFn()
    },
    changeSize(num) {
        this.StationListParams.size=num
        this.getAllStationFn()
    },
    changePage(p) {
        this.StationListParams.page=p
        this.getAllStationFn()
    },
    getResult () {
      this.StationListParams.page = 1
      this.getAllStationFn()
    }
  }
}
</script>
<style lang="less" scoped>
.stationBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .searchCon {
    // padding: 20px;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    .searchMain {
      flex: 1;
    }
    .searchBtn {
      flex-shrink: 0;
      width: 72px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .mainCon {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    flex: 1;
  }
}
</style>