<template>
    <div class="CourseBox">
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
        <ots-custom-dialog :dialog.sync="addDialog" :title="form.code?'修改':'添加课程'" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-form-item label="课程名称" class="childrenName" prop="name">
                            <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态">
                            <el-radio-group v-model="form.state">
                                <el-radio-button label=1>启用</el-radio-button>
                                <el-radio-button label=0>停用</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="成绩显示方式">
                            <el-radio-group v-model="form.scoreType">
                                <el-radio-button label=1>分数</el-radio-button>
                                <el-radio-button label=2>等级制</el-radio-button>
                                <el-radio-button label=3>合格率</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="合格率百分比" class="rateStyle" v-if="form.scoreType == 3">
                            <el-input v-model="form.rate" placeholder="请输入"></el-input><em>%</em>
                        </el-form-item>
                        <el-form-item label="等级设置" class="gradeStyle" v-if="form.scoreType == 2">
                          <div v-for="(item, index) in form.form_gradeList" :key="index" class="mb10">
                            <el-input class="long"  placeholder="请输入等级名称" v-model="item.name"></el-input>
                            <span class="mr5 ml5"> 分数 ≥ </span>
                            <el-input class="short" placeholder="最低分" v-model="item.score"></el-input>
                            <i v-if="index > 0" class="ml10 el-icon-delete col_blue cp" @click="deleteGrade(index)"></i>
                          </div>
                          <p class="col_blue mt10 cp" @click="addGrade"><i class="el-icon-plus mr5"></i><span>增加等级</span></p>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round @click="cancelDialog">取消</el-button>
                <el-button round type="primary" @click="addCourse">确定</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>
<script>
import { getAllCourse, addCourseFn, updateCourseFn, deleteCourseFn, updateCourseStateFn, } from '@/http/modules/baseSet/course'
const scoreType = {
  1: "分数",
  2: "等级制",
  3: "合格率"
}
export default {
  name: 'Course',
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
          title : '课程名称',
          type : 'input',
          placeholder : '请输入课程名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : -1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "课程名称",
              prop: "name"
          },
          {
              title:"成绩显示方式",
              prop:"scoreType",
              formatter: (val) => scoreType[val.row.scoreType]
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changeCourseState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editCourse
                  },
                  {
                      title:"删除",
                      click: this.deleteCourse
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
          //     click: this.exportCourse
          // },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteCourse
          },
      ],
      tableData: [],
      form: {
        name: '',
        state: 1,
        scoreType: 1,
        rate: 60,
        form_gradeList: [
          {score: 85, name: '优秀'},
          {score: 60, name: '及格'}
        ]
      },
      importForm: {
        file: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur'},
          { min: 1, max: 30, message: '输入范围在 1 到 30 个字符', trigger: 'blur' }
        ],
        rate: [
          // { required: true, message: '课程合格率必填', trigger: 'blur'},
          { type: 'number', message: '课程合格率必须为数字值', trigger: 'blur'}
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addCourseDialog
        },
      ],
      addDialog: false,
      pagination: {
        total: 0
      },
      CourseListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  created () {
    this.getAllCourseFn()
  },
  methods: {
    addGrade () {
      let obj = {
        score: '',
        name: ''
      }
      this.form.form_gradeList.push(obj)
    },
    deleteGrade (index) {
      this.form.form_gradeList.splice(index, 1)
    },
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    addCourseDialog () {
      this.resetForm()
      this.addDialog = true
    },
    cancelDialog () {
      this.resetForm()
      this.addDialog = false
    },
    addCourse () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let params = {
                name: this.form.name,
                scoreType: this.form.scoreType,
                state: this.form.state
              }
            
              if (this.form.scoreType == 2) { // 等级制
                let gradeSet = this.form.form_gradeList.filter(item => item.name && parseFloat(item.score))
                if (!gradeSet.length) { 
                  this.$message.error('请设置有效的等级制')
                  return false
                }
                params.gradeSet = JSON.stringify(gradeSet) 
              }
              if (this.form.scoreType == 3) { // 合格率
                let rate = parseFloat(this.form.rate)
                if (isNaN(rate) || rate < 0 ) {
                  this.$message.error('请设置有效的合格率')
                  return false
                }
                params.rate = parseInt(this.form.rate)
              }

              // 处理编辑还是新增
              if (this.form.id) {
                params.id = this.form.id
              }
              const useFn = params.id ? updateCourseFn : addCourseFn
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
    editCourse (row) {
      this.form = Object.assign(this.form, row)
      if (row.scoreType == 2 && row.gradeSet) {
        this.form.form_gradeList = JSON.parse(row.gradeSet)
      }
      this.addDialog = true
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择课程')
        return false
      }
    },
    exportCourse () {
      if (this.beforeBatch()) {

      }
    },
    deleteCourse (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteCourseFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllCourseFn()
          }
        }).catch(() => {        
        })
    },
    async changeCourseState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updateCourseStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllCourseFn()
      }
    },
    async getAllCourseFn () {
      this.CourseListParams = Object.assign(this.CourseListParams, this.selectForm)
      const { data } = await getAllCourse(this.CourseListParams)
      this.tableData = data.records
      this.pagination.total = data.total
    },
    resetForm() {
      this.form = {
        name: '',
        state: 1,
        scoreType: 1,
        rate: 60,
        form_gradeList: [
          {score: 85, name: '优秀'},
          {score: 60, name: '及格'}
        ]
      }
    },
    addAfter () {
      this.cancelDialog()
      this.getAllCourseFn()
    },
    changeSize(num) {
        this.CourseListParams.size=num
        this.getAllCourseFn()
    },
    changePage(p) {
        this.CourseListParams.page=p
        this.getAllCourseFn()
    },
    getResult () {
      this.CourseListParams.page = 1
      this.getAllCourseFn()
    },
  }
}
</script>
<style lang="less" scoped>
.CourseBox {
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
.rateStyle {
    .el-input {
        width: 120px;
        height: 36px;
    }
    em {
        position: relative;
        margin-left: -25px;
        z-index: 1;
        font-style:normal
    }
}
.gradeStyle {
    
    .el-input.long{
        width: 160px;
        height: 36px;
    }
    .el-input.short{
        width: 80px;
        height: 36px;
    }
    /deep/ .el-input__inner {
      padding: 8px !important;
    }
}       
</style>