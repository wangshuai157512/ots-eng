<template>
  <div class="applyAudit">
    <template v-if="isApplyAudit">
      <el-alert
        title=""
        type="warning"
        show-icon>
        <div class="importantNote">
          当前批次报名审核的截止日期为<span>{{endAudit}}</span> ,请尽快完成审核
        </div>
      </el-alert>
      <ots-main-title></ots-main-title>
      <ots-table-group-new
        ref="ots-table"
        :selectList="teaSelectList"
        :requestForm='requestForm'
        @search="search"
        :tableHeader="tableHeader"
        :tableData="tableData"
        :tableOption="tableOption"
        :batchOperBtn="batchOperBtn"
        :isDisabledMultiple="isDisabledMultiple"
        @handleSelectionChange="bachOper"
        :pagination="pagination"
        @changeNum="changeNum"
        @changePage="changePage"
      ></ots-table-group-new>
      <ots-custom-dialog :dialog.sync="applyMsgDialog" title="报名信息审核">
        <template v-slot:content>
          <div class="exportDialog">
            <el-form ref="exportForm">
              <el-form-item label="驳回原因">
                <el-input type="textarea" v-model="ruleForm.reason"></el-input>
              </el-form-item>
              <el-form-item label="重新提交报考信息">
                <el-radio-group v-model="ruleForm.flag">
                  <el-radio-button :label='0'>允许</el-radio-button>
                  <el-radio-button :label='1'>不允许</el-radio-button>
                </el-radio-group>
              </el-form-item>

            </el-form>
          </div>
        </template>
        <template v-slot:footer>
          <el-button round @click="applyMsgDialog=false">取消</el-button>
          <el-button round type="primary" @click="rightAudit">确定</el-button>
        </template>
      </ots-custom-dialog>
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
        endAudit: "",
        applyMsgDialog: false,
        ruleForm: {
          flag: 0,
          reason: '',
          planId: '',
          state: 0,
          stuId: '',
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
          stateType: '', // 审核状态
          photoState: "", // 人身核验状态
          realName: "",
          cardNo: "",  //证件号
          phone: "",

        },
        stuIds: [],
        teaSelectList: [
          {
            title: '审核状态',
            type: 'select',
            requestKey: "stateType",
            label: "name",
            value: "id",
            data: [
              {
                id: "",
                name: "全部",
              },
              {
                id: "1",
                name: "待审核",
              },
              {
                id: "2",
                name: "审核通过",
              },
              {
                id: "3",
                name: "审核不通过",
              }
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
                id: 2,
                name: "人工通过",
              },
              {
                id: 0,
                name: "系统不通过",
              },
              {
                id: 1,
                name: "系统通过",
              }

            ],
          },
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
              }
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
            fixed : 'left'
          },
          {
            title: "姓名",
            prop: "realName",
            fixed : 'left'
          },
          {
            title: "院校",
            prop: "school",
          },
          {
            title: "函授站",
            prop: "station",
          },
          {
            title: "证件号",
            prop: "cardNo"
          },
          {
            title: "手机号",
            prop: "phone",
          },
          {
            title: "报考课程",
            prop: "course",
          },
          {
            title: "专业",
            prop: "subject",
          },

          {
            title: "照片",
            type: "img",
            prop: "photo",
            fixed : 'right'
          },
          {
            title: "人身核验状态",
            prop: "markPhotoState",
            width: "140",
            fixed : 'right'
          },
          {
            title: "审核状态",
            prop: "markStateType",
            fixed : 'right'
          },
          {
            title: "操作",
            type: "buttons",
            width: "240",
            fixed: 'right',
            btnList: [
              {
                title: "通过",
                formatter: (scope) => {
                  let { stateType, photoState } = scope.row
                  return stateType !== "待审核" || photoState === '系统不通过' || photoState === '其他'
                },
                click: this.pass
              },
              {
                title: "驳回",
                formatter: (scope) => {
                  let { stateType, photoState } = scope.row
                  return stateType !== "待审核" || stateType === "其他" || photoState === '其他' || photoState === '系统不通过'
                },
                click: this.unpass
              },
              {
                title: (scope) => {
                  let { photoState, course } = scope.row
                  if (photoState === "系统不通过" || !course || photoState === '其他') {
                    return '人工验证身份'
                  } else {
                    return '报名详情'
                  }
                },
                click: this.lookDetail
              },
            ]
          }

        ],
        tableData: [],
        tableOption: {
          multiple: true
        },
        batchOperBtn: [
          {
            title: "批量通过",
            icon: "iconfont icon-kaiqi",
            click: this.exportUser
          }
        ],
        pagination: {
          total: 0
        },
      }
    },
    computed: {
      isApplyAudit() {
        return this.$route.name === 'applyAudit'
      }
    },
    methods: {
      isDisabledMultiple (row) {
        let { photoState,stateType  } = row
        if (photoState === '系统不通过' || photoState === '其他' || stateType !== '待审核') {
          return false
        }
        return true
      },
      handleDetail() {
        this.$router.push({name: 'applyAuditDetail'})
      },
      getTableList() {
        this.$api.applyAudit.examineList(this.requestForm).then(res => {
          if (res.code) {
            res.data.records.forEach(item => {
              if (item.stateType === '审核通过') {
                item.markStateType = '<span class="finish">审核通过</span>'
              } else if (item.stateType === '审核不通过') {
                item.markStateType = '<span class="unDistributed">审核不通过</span>'
              } else if (item.stateType === '待审核') {
                item.markStateType = '<span class="wait">待审核</span>'
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
      bachOper(val) {
        this.stuIds = []
        let idList = []
        val.forEach(item => {
          idList.push(item.stuid)
        })
        this.stuIds = idList
      },
      exportUser() {
        if (this.stuIds.length < 1) {
          this.$message({
            message: "请选择要通过的学生",
            type: 'warning'
          });
          return
        }
        this.$confirm(`确认将选中${this.stuIds.length}名学生审核通过`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let queryImport = {
            planId: this.requestForm.planId,
            stuIds: this.stuIds + ''
          }
          this.$api.applyAudit.batchExamine(queryImport).then(res => {
            if (res.code) {
              this.$message({
                message: "审核通过",
                type: 'success'
              });
              this.getTableList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
      examine() {
        this.$api.applyAudit.examine(this.ruleForm).then(res => {
          if (res.code) {
            this.applyMsgDialog = false
            this.$message({
              message: this.ruleForm.state ? '审核不通过' : "审核通过",
              type: this.ruleForm.state ? 'error' : 'success'
            });
            this.getTableList()
          }
        })
      },
      pass(val) {
        let {planId, stuid} = val
        this.ruleForm.planId = planId
        this.ruleForm.stuId = stuid
        this.ruleForm.state = 0
        this.examine()
      },
      unpass(val) {
        this.ruleForm = {
          flag: 0,
          reason: '',
          planId: '',
          state: 1,
          stuId: '',
        },
          this.applyMsgDialog = true
        let {planId, stuid} = val
        this.ruleForm.planId = planId
        this.ruleForm.stuId = stuid

      },
      rightAudit() {
        this.examine()
      },
      lookDetail(val) {
        console.log(val)
        if (val.photoState === "系统不通过" || !val.course) {
          this.$router.push({
            path: '/applyManage/applyManageAdd',
            query: val
          })
        } else {
          this.$router.push({
            path: '/applyAudit/applyAuditDetail',
            query: val
          })
        }
      },
      getData () {
        this.$api.applyManage.getCurrentPlan().then(res => {
          this.endAudit = moment(res.data.endAudit).format('YYYY年MM月DD日 HH时mm分ss秒')
        })
        this.$api.applyManage.getSelectPlan().then(res => {
          if (res.code) {
            this.$set(this.teaSelectList[2], 'data', res.data)
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
            this.$set(this.teaSelectList[3], 'data', newSchoolList)
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
              this.$set(this.teaSelectList[4], 'data', newStationList)
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
            this.$set(this.teaSelectList[6], 'data', newSubjectList)
          }
        })
      }
    },
    mounted() {
      // this.$refs['ots-table'].$children[1].toggleRowSelection()
      this.getData()
      this.$event.$on('getApplyList',this.getData)
    }
  }
</script>

<style lang="less" scoped>
  .applyAudit {
    .el-alert {
      margin-bottom: 24px;
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
    /deep/ .wait {
      position: relative;
      margin-left: 10px;
      &:after {
        content: ' ';
        position: absolute;
        left: -10px;
        top: 7px;
        width: 5px;
        height: 5px;
        background-color: #F27900;
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

</style>
