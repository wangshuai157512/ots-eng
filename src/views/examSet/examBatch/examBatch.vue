<template>
    <div>
      <template v-if="isIndex">
        <div class="PlanBox">
            <!-- 标题 -->
            <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
            <!-- 搜索框 -->
            <!-- <div class="searchCon">
              <div class="searchMain">
                <ots-refer
                    :selectList="selectList"
                    :request-form="selectForm"
                    @search="getResult"
                />
              </div>
            </div> -->
            <!-- 列表 -->
            <div class="mainCon">
              <ots-table-group
                :tableHeader="tableHeader"
                :tableOption="tableOption"
                :tableData="tableData"
                :batchOperBtn="batchOperBtn"
                :pagination="pagination"
                @changeNum="changeSize"
                @changePage="changePage"
              ></ots-table-group>
            </div>
            <!-- 考生范围弹窗 -->
            <!-- 弹窗 -->
            <ots-custom-dialog :dialog.sync="studentDialog" title="考生范围设置" :isFullScreen="fullScreen" >
                <template v-slot:content>
                    
                    <div class="stuPop">
                        <div class="btnBox">
                          <el-button type="primary" round @click="importStudentFn">导入</el-button>
                        </div>
                        <ots-refer
                            class="mb16"
                            :selectList="stuselectList"
                            :request-form="stuselectForm"
                            :showAdvanced="4"
                            @search="getStuResult"
                        />
                        <div style="padding: 20px; background: #fff;">
                          <ots-table-group
                            :tableHeader="stutableHeader"
                            :tableOption="stutableOption"
                            :tableData="stutableData"
                            :batchOperBtn="stubatchOperBtn"
                            @handleSelectionChange="stubachOper"
                            :pagination="stupagination"
                            @changeNum="stuchangeSize"
                            @changePage="stuchangePage"
                          ></ots-table-group>
                        </div>
                    </div>
                </template>
            </ots-custom-dialog>
            <!-- 导入考生 -->
            <ots-custom-dialog :dialog.sync="importDialog" title="导入考生" width="40%">
                <template v-slot:content>
                     <el-form ref="exportForm" :model="importForm">
                        <el-form-item label="1.模板下载">
                            <span style="color:#006AFF;" @click="$getStaticFile('考生导入.xlsx')" class="cp">
                                <i class="el-icon-download"></i>
                                下载考生导入数据模板
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
                </template>
                <template v-slot:footer>
                    <el-button round @click="importDialog=false">取消</el-button>
                    <el-button round type="primary" @click="rightImport">确定</el-button>
                </template>
            </ots-custom-dialog>
            <!-- 编辑考生 -->
            <ots-custom-dialog :dialog.sync="editDialog" title="编辑考生" width="50%">
                <template v-slot:content>
                    <div>
                        <el-form :model="stuEditForm" label-width="160px" :inline="true">
                          <div class="sectionBox">
                            <el-form-item label="考试批次">
                              <span>{{currentPlanCode}}</span>
                            </el-form-item>
                            <el-form-item label="学校">
                                <el-select v-model="stuEditForm.schoolId" placeholder="请选择">
                                  <el-option
                                    v-for="item in schoolData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                          </div>
                          <div class="sectionBox">
                              <el-form-item label="层次">
                                  <el-select v-model="stuEditForm.level" placeholder="请选择">
                                    <el-option
                                      v-for="item in level"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.name">
                                    </el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="专业">
                                  <el-select v-model="stuEditForm.subjectId" placeholder="请选择">
                                    <el-option
                                      v-for="item in subjectData"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                    </el-option>
                                  </el-select>
                              </el-form-item>
                          </div>
                          <div class="sectionBox">
                              <el-form-item label="姓名">
                                  <el-input v-model="stuEditForm.name"/>
                              </el-form-item>
                              <el-form-item label="学号">
                                  <el-input v-model="stuEditForm.studyId"/>
                              </el-form-item>
                          </div>
                          <div class="sectionBox">
                            <el-form-item label="证件类型">
                                <el-select v-model="stuEditForm.cardType" placeholder="请选择">
                                  <el-option
                                    v-for="item in cardTypeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="证件号码">
                                <el-input v-model="stuEditForm.cardNo"/>
                            </el-form-item>
                          </div>
                        </el-form>
                    </div>
                </template>
                <template v-slot:footer>
                    <el-button round @click="editDialog=false">取消</el-button>
                    <el-button round type="primary" @click="editStuFn">确定</el-button>
                </template>
            </ots-custom-dialog>
            <!-- 查看考生 -->
            <ots-custom-dialog :dialog.sync="checkDialog" title="查看考生" width="50%">
                <template v-slot:content>
                    <div>
                        <el-form :model="stuEditForm" label-width="160px" :inline="true">
                          <div class="sectionBox">
                            <el-form-item label="考试批次">
                              <span>{{currentPlanCode}}</span>
                            </el-form-item>
                            <el-form-item label="学校">
                                <span>{{currentStu.schoolName}}</span>
                            </el-form-item>
                          </div>
                          <div class="sectionBox">
                              <el-form-item label="层次">
                                  <span>{{currentStu.level}}</span>
                              </el-form-item>
                              <el-form-item label="专业">
                                  <span>{{currentStu.subjectName}}</span>
                              </el-form-item>
                          </div>
                          <div class="sectionBox">
                              <el-form-item label="姓名">
                                  <span>{{currentStu.name}}</span>
                              </el-form-item>
                              <el-form-item label="学号">
                                  <span>{{currentStu.studyId}}</span>
                              </el-form-item>
                          </div>
                          <div class="sectionBox">
                            <el-form-item label="证件类型">
                                <span>{{cardTypeList[currentStu.cardType - 1].name}}</span>
                            </el-form-item>
                            <el-form-item label="证件号码">
                                <span>{{currentStu.cardNo}}</span>
                            </el-form-item>
                          </div>
                        </el-form>
                    </div>
                </template>
                <template v-slot:footer>
                    <el-button round type="primary" @click="checkDialog= false">关闭</el-button>
                </template>
            </ots-custom-dialog>
        </div>
      </template>
      <template v-else>
        <router-view />
      </template>
    </div>
</template>
<script>
import { getPagePlan, deletePlanFn, editPlanStateFn, getPlanStudentFn, importStudent, deleteStudentFn, editStudentFn } from '@/http/modules/examSet/examBatch'
import { getSelectSchool } from '@/http/modules/baseSet/school'
import { getSelectSubject } from '@/http/modules/baseSet/major'
import { mapState } from 'vuex'
export default {
  name: 'examBatch',
  data () {
    return {
      importDialog: false,
      editDialog: false,
      checkDialog: false,
      fullScreen: true,
      currentPlanId: '',
      currentPlanCode: '',
      importForm: {
        file: ''
      },
      studentSelectList: [],
      stuselectList: [
        {
          title: "学校",
          type: "select",
          requestKey: "schoolId",
          label: 'name',
          value: 'id',
          data: [],
        },
        {
          title: "专业",
          type: "select",
          requestKey: "subjectId",
          label: 'name',
          value: 'id',
          data: [],
        },
        {
          title: "层次",
          type: "select",
          requestKey: "level",
          label: 'name',
          value: 'name',
          data: [],
        },
        {
          title : '关键词',
          type : 'input',
          placeholder : '姓名或证件号',
          requestKey: "searchKey"
        }
      ],
      stuselectForm: {
        subjectId: '',
        schoolId: '',
        level: '',
        searchKey : '',
      },
      selectForm: {
        state: -1,
        searchKey : '',
      },
      tableHeader: [
          {
              title: "考试批次",
              prop: "code"
          },
          {
              title:"批次名称",
              prop: "name"
          },
          {
              title:"收费标准(元)",
              prop: "money"
          },
          {
              title:"启用状态",
              prop:"state",
              formatter: (val) => val.row.state == 1 ? '启用' : '停用',
          },
          {
              title: "考生范围",
              type: 'button',
              prop: "",
              formatter: () => '设置',
              disableFn: (val) => false,
              click: this.setStudent
              
          },
          {
              title: "发布状态",
              type: 'button',
              prop: "publish",
              formatter: (val) => val.row.publish == 1 ? '已发布' : '<span>发布</span>',
              disableFn: (val) => val.row.publish == 1 ? true : false,
              click: this.publishPlan
              
          },
          {
              title:"操作",
              type:"buttons",
              width:"160",
              btnList:[
                  {
                      title: "查看",
                      click: this.checkBatch
                  },
                  {
                      title:"编辑",
                      disableFn: (val) => val.row.publish == 1 ? true : false,
                      click: this.editPlan
                  },
                  {
                      title:"删除",
                      disableFn: (val) => val.row.publish == 1 ? true : false,
                      click: this.deletePlan
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
        //       click: this.exportPlan
        //   },
          // {
          //     title: "删除",
          //     icon: "iconfont icon-shanchu",
          //     click: this.deletePlan
          // },
      ],
      stubatchOperBtn:[
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteStudent
          },
      ],
      tableData: [],
      stutableData: [],
      stutableHeader: [
          {
              title: "姓名",
              prop: "name"
          },
          {
              title:"证件号",
              prop: "cardNo"
          },
          {
              title:"学号",
              prop: "studyId"
          },
          {
              title:"学校",
              prop: "schoolName"
          },
          {
              title:"专业",
              prop: "subjectName"
          },
          {
              title:"层次",
              prop: "level"
          },
          {
              title:"操作",
              type:"buttons",
              width:"160",
              btnList:[
                  {
                      title: "查看",
                      click: this.checkStudent
                  },
                  {
                      title:"编辑",
                      click: this.editStudent
                  },
                  {
                      title:"删除",
                      click: this.deleteStudent
                  },
              ]
          }
      ],
      stutableOption: {
          multiple:true
      },
      form: {
        name: '',
        state: -1,
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addPlanDialog
        }
      ],
      studentDialog: false,
      pagination: {
        total: 0
      },
      stupagination: {
        total: 0
      },
      PlanListParams: {
        order: '',
        page: 1, 
        size: 10
      },
      stuListParams: {
        page: 1, 
        size: 10
      },
      subjectData: [],
      schoolData: [],
      stuEditForm: {
        schoolId: '',
        level: '',
        subjectId: '',
        name: '',
        studyId: '',
        cardNo: '',
        cardType: 1
      },
      currentStu: {
        schoolName: '',
        level: '',
        subjectName: '',
        name: '',
        studyId: '',
        cardNo: '',
        cardType: 1
      },
    }
  },
  computed: {
      ...mapState(['level', 'cardTypeList']),
      isIndex () {
          return this.$route.name == 'examBatch'
      }
  },
  created () {
    this.getAllPlanFn()
    
  },
  mounted () {
    this.initStuLimitData()
  },
  watch: {
      '$route':'getPath'
  },
  methods: {
    initStuLimitData () {
      this.initSchool()
      this.initSubject()
      this.stuselectList[2].data = this.level
    },
    async initSchool () {
      const { data } = await getSelectSchool()
      this.schoolData = data
      this.stuselectList[0].data = data
    },
    async initSubject () {
      const { data } = await getSelectSubject()
      this.subjectData = data
      this.stuselectList[1].data = data
    },
    async rightImport () {
        if (!this.importForm.planId) {
            this.$message.error('请退出重试')
            return
        }
        if (!this.importForm.file) {
            this.$message.error('请选择文件')
            return
        }
        const fd = new FormData()
        for (let item in this.importForm) {
            fd.append(item,this.importForm[item])
        }
        const { code, data } = await importStudent(fd)
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
            this.getStudent()
        }
    },
    handleFormData (val) {
        this.importForm.planId = this.currentPlanId
        this.importForm.file = val.file
    },
    deleteStudent (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        planId: this.currentPlanId,
        cardNoList: row ? row.cardNo : this.studentSelectList.join()
      }
      this.$confirm('确定删除考生?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteStudentFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getStudent()
          }
        }).catch(() => {        
        })
    },
    importStudentFn () {
      this.importDialog = true
    },
    setStudent (row) {
      // console.log(row)
      this.currentPlanId = row.id
      this.currentPlanCode = row.code
      this.stuselectForm = {
        subjectId: '',
        schoolId: '',
        level: '',
        searchKey : '',
      }
      this.stuListParams = {
        planId: this.currentPlanId,
        page: 1,
        size: 10
      }
      this.getStudent()
      this.studentDialog = true
    },
    async getStudent () {
      let params = Object.assign(this.stuListParams, this.stuselectForm)
      const { data } = await getPlanStudentFn(params)
      console.log(data.records)
      this.stutableData = data.records
      this.stupagination.total = data.total
    },
    getPath () {
      if (this.$route.name == 'examBatch') {
          this.getAllPlanFn()
      }
    },
    editStudent (row) {
      this.editDialog = true
      for (let key in this.stuEditForm) {
        this.stuEditForm[key] = row[key] ? row[key] : this.stuEditForm[key]
      }
    },
    checkStudent (row) {
      console.log(row)
      this.checkDialog = true
      for (let key in this.currentStu) {
        this.currentStu[key] = row[key] ? row[key] : this.currentStu[key]
      }
    },
    async editStuFn () {
      this.stuEditForm.planId = this.currentPlanId
      const { code } = await editStudentFn(this.stuEditForm)
      if (code == 1) {
        this.$message.success('修改成功')
        this.editDialog = false
        this.getStudent()
      }
    },
    stubachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.cardNo)
      })
      this.studentSelectList = idList
    },
    addPlanDialog () {
      this.$router.push({
        name: 'addBatch'
      })
    },
    checkBatch (row) {
      this.$router.push({
        name: 'checkBatch',
        query: {
          id: row.id
        }
      })
    },
    editPlan (row) {
      this.$router.push({
        name: 'addBatch',
        query: {
          id: row.id
        }
      })
    },
    async publishPlan (row) {
      // console.log(row)
      this.$confirm('发布后考试批次不可编辑删除，确定发布该考试批次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(2222)
        const { code } = await editPlanStateFn({planId: row.id})
        if (code == 1) {
          this.$message.success('发布成功')
          this.getAllPlanFn()
        }
      }).catch(() => {        
      })
    },
    beforeBatch () {
      if (this.studentSelectList.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择考生')
        return false
      }
    },
    exportPlan () {
    },
    async deletePlan (row) {
      this.$confirm('确定删除该考试批次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await deletePlanFn({planId: row.id})
        if (code == 1) {
          this.$message.success('删除成功')
          this.getAllPlanFn()
        }
      }).catch(() => {        
      })
    },
    async getAllPlanFn () {
      this.PlanListParams = Object.assign(this.PlanListParams, this.selectForm)
      const { data } = await getPagePlan(this.PlanListParams)
      this.tableData = data.records
      this.pagination.total = data.total
    },
    resetForm() {
      this.form = {
        name: '',
        state: -1,
      }
    },
    addAfter () {
    },
    changeSize(num) {
        this.PlanListParams.size=num
        this.getAllPlanFn()
    },
    changePage(p) {
        this.PlanListParams.page=p
        this.getAllPlanFn()
    },
    stuchangeSize(num) {
        this.stuListParams.size=num
        this.getStudent()
    },
    stuchangePage(p) {
        this.stuListParams.page=p
        this.getStudent()
    },
    getStuResult () {
      this.stuListParams.page = 1
      this.getStudent()
    },
  }
}
</script>
<style lang="less" scoped>
.PlanBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .searchCon {
    padding: 20px;
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
.stuPop {
  .btnBox {
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
}
.sectionBox {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    flex: 1;
  }
}
</style>