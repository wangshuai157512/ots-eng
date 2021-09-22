<template>
    <div>
      <template v-if="isIndex">
            <div class="PlaceBox">
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
            <ots-custom-dialog :dialog.sync="importDialog" title="导入考点" width="40%">
                <template v-slot:content>
                    <div class="exportDialog">
                        <el-form ref="exportForm" :model="importForm">
                            <el-form-item label="1.模板下载">
                                <span style="color:#006AFF;" @click="$getStaticFile('考点导入.xlsx')" class="cp">
                                    <i class="el-icon-download"></i>
                                    下载考点导入数据模板
                                </span>
                            </el-form-item>
                            <el-form-item label="2.考点名相同时处理方式">
                                <el-radio-group v-model="importForm.style">
                                    <el-radio-button label=0>提示重复</el-radio-button>
                                    <el-radio-button label=1>更新数据</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="3.选择文件" v-model="importForm.file">
                                <ots-upload-file :httpRequest="handleFormData" fileType="xlsx" />
                            </el-form-item>
                            
                        </el-form>
                        <div class="impExplain">
                            <span class="tipTitle"><i></i>提示：</span>
                            <div>
                                <div>1：模板中<span class="col_red">*</span>字段为必填项</div>
                                <div>2：只能上传扩展名为<span class="col_red">.xlsx</span>的文件；</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:footer>
                    <el-button round @click="importDialog=false">取消</el-button>
                    <el-button round type="primary" @click="rightImport">确定</el-button>
                </template>
            </ots-custom-dialog>
        </div>
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </div>
</template>
<script>
import { getAllPlace, addPlaceFn, updatePlaceFn, deletePlaceFn, updatePlaceStateFn, importPlaceFn } from '@/http/modules/baseSet/examSite'
export default {
  name: 'examSite',
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
          title : '考点名称',
          type : 'input',
          placeholder : '请输入考点名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : -1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "考点名称",
              prop: "name"
          },
          {
              title: "考点地址",
              prop: "address"
          },
          {
              title: "教室",
              type: 'button',
              prop: "classCount",
              formatter: (val) => val.row.classCount == 0 ? '<span>添加</span>' : val.row.classCount,
              disableFn: (val) => val.row.state == 1? false : true,
              click: this.addClass
              
          },
          {
              title: "联系人",
              prop: "contact"
          },
          {
              title: "联系电话",
              prop: "phone"
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changePlaceState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editPlace
                  },
                  {
                      title:"删除",
                      click: this.deletePlace
                  },
              ]
          }
      ],
      tableOption: {
          multiple:true
      },
      batchOperBtn:[
          // {
          //     title: "导出",
          //     icon: "iconfont icon-daochu",
          //     click: this.exportPlace
          // },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deletePlace
          },
      ],
      tableData: [],
      form: {
        name: '',
        state: 1,
      },
      importForm: {
        file: '',
        style: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入考点名称', trigger: 'blur'},
          { min: 1, max: 30, message: '输入范围在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.goAddPlace,
          plain: true
        },
        {
          title: '导入',
          fn: this.importPlaceDialog
        }
      ],
      addDialog: false,
      importDialog: false,
      pagination: {
        total: 0
      },
      PlaceListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  computed: {
      isIndex () {
          return this.$route.name == 'examSite'
      }, 
      // orgTreeData () {
      //     return dealTreeData(this.orgList)
      // }
      
  },
  created () {
    this.getAllPlaceFn()
  },
  methods: {
    addClass (row) {
      
      this.$router.push({
        name: 'classroom',
        query: {
          type: row.classCount > 0 ? 'search' : 'add',
          siteId: row.id
        }
      })
    },
    getPath () {
      if (this.$route.name == 'examSite') {
          this.getAllPlaceFn()
      }
    },
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    goAddPlace () {
      this.$router.push({
        name: 'addSite'
      })
    },
    importPlaceDialog () {
      this.importDialog = true
    },
    addPlace () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let params = {...this.form}
              for (let key in params) {
                  if (key.startsWith('form_')) {
                      delete params[key]
                  }
              }
              const useFn = params.id ? updatePlaceFn : addPlaceFn
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
    editPlace (row) {
      console.log(row)
      this.$router.push({
        name: 'addSite',
        query: {
          id: row.id
        }
      })
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择考点')
        return false
      }
    },
    exportPlace () {
      if (this.beforeBatch()) {

      }
    },
    deletePlace (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该考点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deletePlaceFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllPlaceFn()
          }
        }).catch(() => {        
        });
    },
    async changePlaceState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updatePlaceStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllPlaceFn()
      }
    },
    async getAllPlaceFn () {
      this.PlaceListParams = Object.assign(this.PlaceListParams, this.selectForm)
      const { data } = await getAllPlace(this.PlaceListParams)
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
      this.getAllPlaceFn()
    },
    changeSize(num) {
        this.PlaceListParams.size=num
        this.getAllPlaceFn()
    },
    changePage(p) {
        this.PlaceListParams.page=p
        this.getAllPlaceFn()
    },
    getResult () {
      this.PlaceListParams.page = 1
      this.getAllPlaceFn()
    },
    handleFormData (val) {
        this.importForm.file = val.file
    },
    async rightImport () {
        if (!this.importForm.file) {
            this.$message.error('请选择文件')
            return
        }
        const fd = new FormData()
        for (let item in this.importForm) {
            fd.append(item,this.importForm[item])
        }
        const { code, data } = await importPlaceFn(fd)
        if (code == 1) {
            const failNum = data.errorCount ? parseInt(data.errorCount) : 0
            const totalNum = parseInt(data.allCount)
            const successNum = totalNum - failNum
            
            let message = `导入完成，成功导入${successNum}，失败人员数${failNum}`
            this.importDialog = false

            this.$confirm(message, '导入结果', {
                confirmButtonText: failNum > 0 ? '查看错误记录' :'确定',
                 cancelButtonText: '取消',
                type: failNum > 0 ? 'warning' :'success'
            }).then(async () => {
                if (failNum > 0) {
                    window.location.href = data.address
                }
            }).catch(() => {          
            });
            this.getAllPlaceFn()
        }
    },
  },
  watch: {
      '$route':'getPath'
  }
}
</script>
<style lang="less" scoped>
.PlaceBox {
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
.tipIcon{
    position: relative;
    .tips {
      font-size: 13px;
      position: absolute;
      color: #fff;
      width: 176px;
      text-align: center;
      padding: 10px;
      top: -48px;
      left: -90px;
      background: rgba(0, 0, 0, 0.85);
    }
    .tips::after{
      content: '';
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.85);
      position: absolute;
      top: 33px;
      left: 96px;
    }
}
</style>