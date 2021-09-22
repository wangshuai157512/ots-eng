<template>
    <div class="SubjectBox">
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
        <ots-custom-dialog :dialog.sync="addDialog" :title="form.code?'修改':'添加专业'" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-form-item label="专业名称" class="childrenName" prop="name">
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
                <el-button round type="primary" @click="addSubject">确定</el-button>
            </template>
        </ots-custom-dialog>
        <ots-custom-dialog :dialog.sync="importDialog" title="导入专业" width="40%">
            <template v-slot:content>
                <div class="exportDialog">
                    <el-form ref="exportForm" :model="importForm">
                        <el-form-item label="1.模板下载">
                            <span style="color:#006AFF;" @click="$getStaticFile('专业导入.xlsx')" class="cp">
                                <i class="el-icon-download"></i>
                                下载专业导入数据模板
                            </span>
                        </el-form-item>
                        <el-form-item label="2.选择文件" v-model="importForm.file">
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
<script>
import { getAllSubject, addSubjectFn, updateSubjectFn, deleteSubjectFn, updateSubjectStateFn, importSubjectFn } from '@/http/modules/baseSet/major'
export default {
  name: 'major',
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
          title : '专业名称',
          type : 'input',
          placeholder : '请输入专业名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : -1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "专业名称",
              prop: "name"
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changeSubjectState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editSubject
                  },
                  {
                      title:"删除",
                      click: this.deleteSubject
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
          //     click: this.exportSubject
          // },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteSubject
          },
      ],
      tableData: [],
      form: {
        name: '',
        state: 1,
      },
      importForm: {
        file: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur'},
          { min: 1, max: 30, message: '输入范围在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addSubjectDialog,
          plain: true
        },
        {
          title: '导入',
          fn: this.importSubjectDialog
        }
      ],
      addDialog: false,
      importDialog: false,
      pagination: {
        total: 0
      },
      SubjectListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  created () {
    this.getAllSubjectFn()
  },
  methods: {
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    addSubjectDialog () {
      this.resetForm()
      this.addDialog = true
    },
    importSubjectDialog () {
      this.importDialog = true
    },
    addSubject () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let params = {...this.form}
              for (let key in params) {
                  if (key.startsWith('form_')) {
                      delete params[key]
                  }
              }
              const useFn = params.id ? updateSubjectFn : addSubjectFn
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
    editSubject (row) {
      console.log(row)
      this.form = Object.assign(this.form, row)
      this.addDialog = true
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择专业')
        return false
      }
    },
    exportSubject () {
      if (this.beforeBatch()) {

      }
    },
    deleteSubject (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该专业?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteSubjectFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllSubjectFn()
          }
        }).catch(() => {        
        });
    },
    async changeSubjectState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updateSubjectStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllSubjectFn()
      }
    },
    async getAllSubjectFn () {
      this.SubjectListParams = Object.assign(this.SubjectListParams, this.selectForm)
      const { data } = await getAllSubject(this.SubjectListParams)
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
      this.getAllSubjectFn()
    },
    changeSize(num) {
        this.SubjectListParams.size=num
        this.getAllSubjectFn()
    },
    changePage(p) {
        this.SubjectListParams.page=p
        this.getAllSubjectFn()
    },
    getResult () {
      this.SubjectListParams.page = 1
      this.getAllSubjectFn()
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
        const { code, data } = await importSubjectFn(fd)
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
            this.getAllSubjectFn()
        }
    },
  }
}
</script>
<style lang="less" scoped>
.SubjectBox {
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