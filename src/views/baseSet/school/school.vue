<template>
    <div class="schoolBox">
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
        <ots-custom-dialog :dialog.sync="addDialog" :title="form.code?'修改':'添加学校'" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-form-item label="学校名称" class="childrenName" prop="name">
                            <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
                            <el-checkbox v-model="form.form_isMain" class="ml20">本校</el-checkbox>
                            <i class="el-icon-warning ml10 tipIcon">
                              <div class="tips">本校为负责组织考试的学校</div>
                            </i>
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
                <el-button round type="primary" @click="addSchool">确定</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>
<script>
import { getAllSchool, addSchoolFn, updateSchoolFn, deleteSchoolFn, updateSchoolStateFn } from '@/http/modules/baseSet/school'
export default {
  name: 'school',
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
          title : '学校名称',
          type : 'input',
          placeholder : '请输入学校名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : 1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "学校名称",
              prop: "name"
          },
          {
              title: "是否本校",
              prop: "isMain",
              formatter: (val) => val.row.isMain == 1 ? '是' : '否',
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changeSchoolState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editSchool
                  },
                  {
                      title:"删除",
                      click: this.deleteSchool
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
          //     click: this.exportSchool
          // },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteSchool
          },
      ],
      tableData: [],
      form: {
        name: '',
        state: 1,
        form_isMain: false,
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur'},
          { min: 1, max: 30, message: '输入范围在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addSchoolDialog
        }
      ],
      addDialog: false,
      pagination: {
        total: 0
      },
      schoolListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  created () {
    this.getAllSchoolFn()
  },
  methods: {
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    addSchoolDialog () {
      this.resetForm()
      this.addDialog = true
    },
    addSchool () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              this.form.isMain = this.form.form_isMain ? 1 : 0
              let params = {...this.form}
              for (let key in params) {
                  if (key.startsWith('form_')) {
                      delete params[key]
                  }
              }
              const useFn = params.id ? updateSchoolFn : addSchoolFn
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
    editSchool (row) {
      console.log(row)
      this.form = Object.assign(this.form, row)
      this.form.form_isMain = row.isMain == 0 ? false : true
      this.addDialog = true
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择学校')
        return false
      }
    },
    exportSchool () {
      if (this.beforeBatch()) {

      }
    },
    deleteSchool (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该学校?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteSchoolFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllSchoolFn()
          }
        }).catch(() => {        
        });
    },
    async changeSchoolState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updateSchoolStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllSchoolFn()
      }
    },
    async getAllSchoolFn () {
      this.schoolListParams = Object.assign(this.schoolListParams, this.selectForm)
      const { data } = await getAllSchool(this.schoolListParams)
      this.tableData = data.records
      this.pagination.total = data.total
    },
    resetForm() {
      this.form = {
        name: '',
        state: 1,
        form_isMain: false,
      }
    },
    addAfter () {
      this.addDialog = false
      this.resetForm()
      this.getAllSchoolFn()
    },
    changeSize(num) {
        this.schoolListParams.size=num
        this.getAllSchoolFn()
    },
    changePage(p) {
        this.schoolListParams.page=p
        this.getAllSchoolFn()
    },
    getResult () {
      this.schoolListParams.page = 1
      this.getAllSchoolFn()
    }
  }
}
</script>
<style lang="less" scoped>
.schoolBox {
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