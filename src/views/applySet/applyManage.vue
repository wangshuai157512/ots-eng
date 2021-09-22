<template>
  <div class="applyManage">
    <template v-if="isApplyManage">
      <el-alert
        title=""
        type="warning"
        show-icon>
        <div class="importantNote">
          当前批次报缴信息修改截止日期为<span>{{endTime}}</span> ,请尽快完成相关操作
        </div>
      </el-alert>
      <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
      <ots-custom-dialog :dialog.sync="baseImportDialog" title="基本信息导入">
        <template v-slot:content>
          <div class="exportDialog">
            <el-form ref="exportForm" :model="importForm">
              <el-form-item label="1.模板下载">
                                <span style="color:#006AFF;" @click="$getStaticFile('基本信息导入.xlsx')" class="cp">
                                    <i class="el-icon-download"></i>
                                    下载基本信息导入数据模板
                                </span>
                <!-- <a href="./template/baseMsgImportant.xls " class="downTemplate">下载基本信息导入数据模板</a> -->
              </el-form-item>
              <el-form-item label="2.导入文件" v-model="importForm.Filedata">
                <ots-upload-file :httpRequest="handleFormData" fileType="xlsx"/>
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
          <el-button round @click="baseImportDialog=false">取消</el-button>
          <el-button round type="primary" @click="rightImport">导入</el-button>
        </template>
      </ots-custom-dialog>
      <ots-custom-dialog :dialog.sync="upLoadImgDialog" title="照片上传">
        <template v-slot:content>
          <div class="exportDialog">
            <el-form>
              <el-form-item label="请选择照片信息文件" v-model="upLoadImgForm.Filedata">
                <ots-upload-file ref="importImg" :httpRequest="handleImgFormData" fileType="zip"/>
              </el-form-item>
            </el-form>
            <!-- <el-progress :stroke-width="3" :percentage="5"></el-progress> -->
            <div class="impExplain">
              <span class="tipTitle"><i></i>提示：</span>
              <div>
                <div>1：只能上传扩展名为<span class="col_red">.zip</span>的文件；</div>
                <div>2：文件大小不能超过<span class="col_red">10M</span>；</div>
                <div>3：文件名不能是中文,<span class="col_red">照片以证件号命名；</span></div>
                <div>4：压缩包内只能是照片（不包含文件夹）；</div>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <el-button round @click="upLoadImgDialog=false">取消</el-button>
          <el-button round type="primary" @click="submitUploadImg">导入</el-button>
        </template>
      </ots-custom-dialog>
      <ots-custom-dialog :dialog.sync="repeatPsdDialog" title="重置密码" width="40%">
        <template v-slot:content>
          <div class="repeatPsd">
            确定将考生<span>{{editPsdQuery.realName}}</span>的密码重置？重置后，密码为其<span>手机后六位</span>
          </div>
        </template>
        <template v-slot:footer>
          <el-button round @click="repeatPsdDialog=false">取消</el-button>
          <el-button round type="primary" @click="submitRepeatPsd">确定</el-button>
        </template>
      </ots-custom-dialog>
      <ots-table-group-new
        :selectList="teaSelectList"
        :requestForm='requestForm'
        @search="search"
        :tableHeader="tableHeader"
        :tableData="tableData"
        :batchOperBtn="batchOperBtn"
        :pagination="pagination"
        @changeNum="changeNum"
        @changePage="changePage"></ots-table-group-new>
    </template>

    <template v-else>
      <router-view></router-view>
    </template>

  </div>
</template>

<script>
  import {getQueryAllSchool} from '@/http/modules/school'
  import {getQueryAllStation} from '@/http/modules/station'
  import moment from 'moment'

  export default {
    data() {
      return {
        endTime: '',
        mainTopBtnList: [
          {
            title: "批量导入",
            select: true,
            children: [
              {
                title: "基本信息导入",
                fn: this.baseImport
              },
              {
                title: "学生照片导入",
                fn: this.phoneImport
              },
            ]
          },
          {
            title: "新增",
            fn: this.addUser
          },
        ],
        baseImportDialog: false,
        importForm: {
          planId: '',
          file: ''
        },
        upLoadImgDialog: false,
        repeatPsdDialog: false,
        editPsdQuery: {
          realName: '',
          userId: '',
          password: '',
          confirmPassword: ''
        },
        upLoadImgForm: {
          Filedata: ''
        },
        requestForm: {
          page: 1,
          size: 10, //每页条数
          planId: "", //批次Id
          schoolId: "", // 学校
          stationId: "", // 函授站
          orders: "",
          subjectId: "", //专业
          level: "", //层次
          stateType: 0, // 审核状态
          photoState: "", // 人身核验状态
          payType: "", //缴费状态
          realName: "",
          cardNo: "",  //证件号
          phone: "",

        },
        teaSelectList: [
          {
            title: "考试批次",
            type: "select",
            isSearch: true,
            requestKey: "planId",
            label: "name",
            value: "id",
            data: [],
            // change:()=> {
            //     this.getExamCourseCode()
            // },
          },
          {
            title: "院校",
            type: "select",
            isSearch: true,
            requestKey: "schoolId",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
            ],
          },
          {
            title: '函授站',
            type: 'select',
            requestKey: "stationId",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
            ],
          },
          {
            title: "层次",
            type: "select",
            isSearch: true,
            requestKey: "level",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
              {
                id: "高起本",
                name: "高起本",
              },
              {
                id: "专升本",
                name: "专升本",
              },
            ],
          },
          {
            title: "专业",
            type: "select",
            isSearch: true,
            requestKey: "subjectId",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
            ],
          },
          {
            title: "人身核验状态",
            type: "select",
            isSearch: true,
            requestKey: "photoState",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
              {
                id: 0,
                name: "系统不通过",
              },
              {
                id: 1,
                name: "系统通过",
              },
              {
                id: 2,
                name: "人工通过",
              },
            ],
          },
          {
            title: "缴费状态",
            type: "select",
            isSearch: true,
            requestKey: "payType",
            label: "value",
            value: "stateType",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
              {
                id: 1,
                name: "已缴费",
              },
              {
                id: 0,
                name: "未缴费",
              },
            ],
          },
          {
            title: '姓名',
            type: 'input',
            requestKey: 'realName',
            placeholder: '请输入'
          },
          {
            title: '证件号',
            type: 'input',
            requestKey: 'cardNo',
            placeholder: '请输入'
          },
          {
            title: '手机号',
            type: 'input',
            requestKey: 'phone',
            placeholder: '请输入'
          },
        ],
        tableHeader: [
          {
            title: "考试批次",
            prop: "planName",
            width: "120",
            fixed: 'left',
            align : 'left',
            headerAlign : 'left',
          },
          {
            title: "姓名",
            width: "120",
            prop: "realName",
            fixed: 'left'
          },
          {
            title: "性别",
            width: "120",
            prop: "sex"
          },
          {
            title: "证件号",
            width: "120",
            prop: "cardNo"
          },
          {
            title: "手机号",
            width: "120",
            prop: "phone",
          },
          {
            title: "院校",
            width: "120",
            prop: "school",
          },
          {
            title: "函授站",
            prop: "station",
            width: "120",
          },
          {
            title: "专业",
            prop: "subject",
          },
          {
            title: "层次",
            prop: "level",
          },
          {
            title: "入学时间",
            formatter: (scope) => {
              return moment(scope.row.enterTime).format('YYYY-MM-DD')
            },
            prop: "enterTime",
            width: "200",
          },
          {
            title: "本科毕业时间",
            formatter: (scope) => {
              return moment(scope.row.enterTime).format('YYYY-MM-DD')
            },
            prop: "educateTime",
            width: "200",
          },
          {
            title: "报考课程",
            prop: "course",
            width: "100"
          },
          {
            title: "人身核验状态",
            prop: "markPhotoState",
            width: "140",
            fixed: 'right'
          },
          {
            title: "缴费状态",
            prop: "payType",
            type: "tag",
            width: "100",
            fixed: 'right'
          },
          {
            title: "操作",
            type: "buttons",
            width: "240",
            fixed: 'right',
            align : 'right',
            headerAlign : 'right',
            btnList: [
              {
                title: "重置密码",
                click: this.repeatPsd

              },
              {
                title: "编辑",
                formatter: (scope) => {
                  return !scope.row.isEdit
                },
                click: this.edit
              },
              {
                title: "删除",
                formatter: (scope) => {
                  return scope.row.payType === "已缴费"
                },
                click: this.delet
              },
            ]
          }

        ],
        tableData: [],
        // tableOption:{
        //     multiple:true
        // },
        batchOperBtn: [
          {
            title: "导出",
            icon: "iconfont icon-daochu",
            click: this.exportStu
          }
        ],
        pagination: {
          total: 0
        },

      }
    },
    computed: {
      isApplyManage() {
        return this.$route.name === 'applyManage'
      }
    },
    methods: {
      getData () {
        this.$api.applyManage.getCurrentPlan().then(res => {
          this.endTime = moment(res.data.endPay).format('YYYY年MM月DD日 HH时mm分ss秒')
          this.importForm.planId = res.data.id
        })
        this.$api.applyManage.getSelectPlan().then(res => {
          if (res.code) {
            this.$set(this.teaSelectList[0], 'data', res.data)
            this.requestForm.planId = res.data[0].id
            this.getTableList()
          }

        })
        getQueryAllSchool({state: 1}).then(res => {
          if (res.code) {
            let newSchoolList = [
              {
                id: "",
                name: "全部",
              },
              ...res.data
            ]
            this.$set(this.teaSelectList[1], 'data', newSchoolList)
          }
        }),
          getQueryAllStation({state: 1}).then(res => {
            if (res.code) {
              let newStationList = [
                {
                  id: "",
                  name: "全部",
                },
                ...res.data
              ]
              this.$set(this.teaSelectList[2], 'data', newStationList)
            }
            console.log(res)
          })
        this.$api.applyManage.queryAllSubject({state: 1}).then(res => {
          if (res.code) {
            let newSubjectList = [
              {
                id: "",
                name: "全部",
              },
              ...res.data
            ]
            this.$set(this.teaSelectList[4], 'data', newSubjectList)
          }
        })
      },
      baseImport() {
        this.baseImportDialog = true

      },
      handleFormData(val) {
        this.importForm.file = val.file
      },
      rightImport() {
        if (!this.importForm.file) {
          this.$message.error('请选择文件')
          return
        }
        const fd = new FormData()
        for (let item in this.importForm) {
          fd.append(item, this.importForm[item])
        }
        this.$api.applyManage.planStudentImport(fd).then(res => {
          if (res.code) {
            this.baseImportDialog = false
            const failNum = res.data.errorCount ? parseInt(res.data.errorCount) : 0
            const totalNum = parseInt(res.data.allCount)
            const successNum = totalNum - failNum

            let message = `导入完成，成功导入${successNum}，失败人员数${failNum}`
            this.importDialog = false

            this.$confirm(message, '导入结果', {
              confirmButtonText: failNum > 0 ? '查看错误记录' : '确定',
              cancelButtonText: '取消',
              type: failNum > 0 ? 'warning' : 'success'
            }).then(() => {
              if (failNum > 0) {
                window.location.href = res.data.address
              }
            }).catch(() => {
            });
            this.getTableList()
          }
        })

      },
      phoneImport() {
        this.upLoadImgDialog = true
      },
      handleImgFormData(val) {
        this.upLoadImgForm.Filedata = val.file
      },
      submitUploadImg() {
        if (!this.upLoadImgForm.Filedata) {
          this.$message.error('请选择文件')
          return
        }
        let param = {
          // multiple: true,
          // fileType: 4,
          // fileName: this.upLoadImgForm.Filedata.name,
          // Filedata: this.upLoadImgForm.Filedata
          file: this.upLoadImgForm.Filedata
        }

        const fd = new FormData()
        for (let item in param) {
          fd.append(item, param[item])
        }
        this.$api.applyManage.batchImportUserPhoto(fd).then(res => {
          if (res.code) {
            const failNum = res.data.errorCount ? parseInt(res.data.errorCount) : 0
            const totalNum = parseInt(res.data.allCount)
            const successNum = totalNum - failNum

            let message = `导入完成，成功导入照片${successNum}张，导入失败${failNum}张`
            this.upLoadImgDialog = false

            this.$confirm(message, '导入结果', {
              confirmButtonText: failNum > 0 ? '查看错误记录' : '确定',
              cancelButtonText: '取消',
              type: failNum > 0 ? 'warning' : 'success'
            }).then(() => {
              if (failNum > 0) {
                window.location.href = res.data.address
              }
            }).catch(() => {
            });
            this.getTableList()
          }

        })
      },
      addUser() {
        this.$router.push({
          path: 'applyManage/applyManageAdd',
          query: {
            planId: this.requestForm.planId
          }
        })
      },
      getTableList() {
        this.$api.applyManage.getSelectList(this.requestForm).then(res => {

          if (res.code) {
            res.data.records.forEach(item => {
              if (item.payType === '已缴费') {
                item.tagType = 'success'
              } else if (item.payType === '未缴费') {
                item.tagType = 'info'
              }
              if (item.photoState === '人工通过') {
                item.markPhotoState = '<span class="unFinish">人工通过</span>'
              } else if (item.photoState === '系统不通过') {
                item.markPhotoState = '<span class="unDistributed">系统不通过</span>'
              } else if (item.photoState === '系统通过') {
                item.markPhotoState = '<span class="finish">系统通过</span>'
              }
            })
            this.tableData = res.data.records
            this.pagination.total = res.data.total
          }

        })
      },
      repeatPsd(val) {
        this.repeatPsdDialog = true
        let {stuid, phone, realName} = val
        let phoneLastSix = phone.substring(phone.length - 6)
        this.editPsdQuery = {
          userId: stuid,
          password: phoneLastSix,
          confirmPassword: phoneLastSix,
          tenant: 'sign',
        }
      },
      submitRepeatPsd() {
        let {realName, ...params} = this.editPsdQuery
        this.$api.login.editPsd(params).then(res => {
          if (res.code) {
            this.repeatPsdDialog = false
            this.$message({
              message: '密码修改成功',
              type: 'success'
            });
          }
        })
      },
      edit(val) {
        this.$router.push({
          path: "/applyManage/applyManageAdd",
          query: val
        })
      },
      delet(val) {
        let stuid = val.stuid
        let planId = val.planId
        console.log(stuid, planId)
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.applyManage.del({stuid, planId}).then(res => {
            console.log(res)
            if (res.code) {
              this.$message({
                message: "删除成功",
                type: 'success'
              });
              this.getTableList()
            }
          })
        })
      },
      // bachOper(val) {
      //     console.log(val,'多选')
      //     // let idList=[]
      //     // val.forEach(item=>{
      //     //     idList.push(item.id)
      //     // })
      //     // this.queryOper.ids = idList + ''
      //     // this.queryexportForm.exportIds = idList + ''
      // },
      exportStu() {
        let {page, size, ...queryFrom} = this.requestForm
        this.$api.applyManage.studentExport(queryFrom).then(res => {
          console.log(res)
          if (res.code) {
            window.open(res.data)
          }
        })

      },
      search() {
        this.requestForm.page = 1
        this.getTableList()
      },
      changeNum(num) {
        this.requestForm.size = num
        this.getTableList()
      },
      changePage(p) {
        this.requestForm.page = p
        this.getTableList()
      },
    },
    mounted() {
      this.$event.$on('getData',this.getData)
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  .applyManage {
    .el-alert {
      margin-bottom: 24px;
      background: #FFF0E0;
      border: 1px solid #F27900;
      .importantNote {
        font-size: 14px;
        color: #45494D;
        line-height: 1.4;
        span {
          color: #F27900;
          margin-left: 3px;
        }
      }
    }
    /deep/ .unDistributed {
      position: relative;
      margin-left: 10px;
      &:after {
        content: ' ';
        position: absolute;
        left: -10px;
        top: 7px;
        width: 5px;
        height: 5px;
        background-color: #FE5958;
        border-radius: 50%;
      }
    }
    /deep/ .unFinish {
      position: relative;
      margin-left: 10px;
      &:after {
        content: ' ';
        position: absolute;
        left: -10px;
        top: 7px;
        width: 5px;
        height: 5px;
        background-color: #006AFF;
        border-radius: 50%;
      }
    }
    /deep/ .finish {
      position: relative;
      margin-left: 10px;
      &:after {
        content: ' ';
        position: absolute;
        left: -10px;
        top: 7px;
        width: 5px;
        height: 5px;
        background-color: #1DBF60;
        border-radius: 50%;
      }
    }

  }

  .exportDialog {
    .impExplain {
      margin-top: 32px;
      color: #9299A6;
      // display: flex;
      .tipTitle {
        flex-shrink: 0;
        display: block;
        margin-bottom: 12px;
      }
      div {
        line-height: 1.8;
      }
    }
  }

  .downTemplate {
    display: block;
    padding: 8px 0 0px 0;
    color: #3388FF;
    font-size: 13px;
    text-decoration: none;
  }

  .repeatPsd {
    font-size: 14px;
    color: #45494D;
    span {
      color: #2D2F33;
      font-weight: 600;
    }
  }

</style>
