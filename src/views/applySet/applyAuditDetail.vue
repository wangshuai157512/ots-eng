<template>
  <div>
    <ots-main-title></ots-main-title>
    <div class="detailBox clearfix">
      <div class="detailBox-l">
        <h1>202109学位英语考试</h1>
        <div class="base">
          <h2>基础信息</h2>
          <ul>
            <li><em>姓名：</em><span>{{showMsg.realName}}</span></li>
            <li><em>性别：</em><span>{{showMsg.sex}}</span></li>
            <li><em>学号：</em><span>{{showMsg.studyNo}}</span></li>
            <li><em>出生日期：</em><span>{{showMsg.bitrhday}}</span></li>
            <li><em>证件类型：</em><span>{{showMsg.cardType}}</span></li>
            <li><em>证件号：</em><span>{{showMsg.cardNo}}</span></li>
            <li><em>政治面貌：</em><span>{{showMsg.politics}}</span></li>
            <li><em>民族：</em><span>{{showMsg.nation}}</span></li>
            <li><em>手机号：</em><span>{{showMsg.phone}}</span></li>
          </ul>
          <img :src="showMsg.photo" alt="">
          <!-- <img src="../../assets/img/photo.jpg" alt=""> -->
        </div>
        <div class="school">
          <h2>院校信息</h2>
          <ul>
            <li v-if="showMsg.school"><em>就读院校：</em><span>{{showMsg.school.name}}</span></li>
            <li v-if="showMsg.subject"><em>专业：</em><span>{{showMsg.subject.name}}</span></li>
            <li><em>层次：</em><span>{{showMsg.level}}</span></li>
            <li><em>省份：</em><span>{{showMsg.province}}</span></li>
            <li v-if="showMsg.station"><em>函授站：</em><span>{{showMsg.station.name}}</span></li>
            <li><em>学习形式：</em><span>{{showMsg.studyType}}</span></li>
            <li><em>入学时间：</em><span>{{showMsg.enterTime}}</span></li>
            <li><em>毕业时间：</em><span>{{showMsg.educateTime}}</span></li>
          </ul>

        </div>
        <div class="applyMsg">
          <h2>报考信息</h2>
          <ul>
            <li><em>报考课程：</em><span v-for="item in showMsg.course" :key="item.id">{{item.courseName}}、</span></li>
            <li><em>备注：</em><span>{{showMsg.remark}}</span></li>
          </ul>
        </div>
      </div>
      <div class="rightMsg-r">
        <div class="showResult wait" v-if="query.stateType === '待审核'">
          <h1>报名信息审核</h1>
          <div class="examine-state">
            <el-form>
              <el-form-item label="审核结果">
                <el-radio-group v-model="ruleForm.state">
                  <el-radio-button :label='0'>通过</el-radio-button>
                  <el-radio-button :label='1'>驳回</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <template v-if="ruleForm.state">
                <el-form-item label="驳回原因">
                  <el-input type="textarea" v-model="ruleForm.reason"></el-input>
                </el-form-item>
                <el-form-item label="重新提交报考信息">
                  <el-radio-group v-model="ruleForm.flag">
                    <el-radio-button :label='0'>允许</el-radio-button>
                    <el-radio-button :label='1'>不允许</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <div class="rightMsg">
            <el-button round @click="goBack">取消</el-button>
            <el-button round type="primary" @click="rightNext">确定</el-button>
          </div>
        </div>
        <div class="showResult" v-else>
          <div class="showResult-t">
            <h1>审核结果</h1>
            <img
              :src="query.stateType === '审核不通过'?require('../../assets/img/unpass.png'):require('../../assets/img/pass.png')"
              alt="">
            <p :style="{color:query.stateType === '审核不通过'?'#FE5958':'#1DBF60'}">{{query.stateType}}</p>
          </div>
          <div class="showResult-b" v-if="query.stateType === '审核不通过'">
            <span>不通过原因：</span>
            <p class="cause">{{showMsg.reason}}</p>
            <span>是否允许重新报名：</span>
            <p>{{showMsg.state === 4?'不允许':'允许'}}</p>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data() {
      return {
        query: {},
        ruleForm: {
          flag: 0,
          reason: '',
          planId: '',
          state: 0, //0通过 1不通过
          stuId: '',
        },
        showMsg: {
          station: {},
          school: {},
          subject: {}
        }
      }
    },
    methods: {
      getDetailList() {
        let {planId, stuid} = this.query
        this.$api.applyAudit.examineByOne({planId, stuid}).then(res => {
          if (res.code) {
            if (res.data.bitrhday) {
              res.data.bitrhday = moment(res.data.bitrhday).format('YYYY-MM-DD')
            } else if (res.data.enterTime) {
              res.data.enterTime = moment(res.data.enterTime).format('YYYY-MM-DD')
            } else if (res.data.enterTime) {
              res.data.educateTime = moment(res.data.educateTime).format('YYYY-MM-DD')
            }
            this.showMsg = res.data
          }
        })
      },
      examine() {
        this.$api.applyAudit.examine(this.ruleForm).then(res => {
          if (res.code) {
            this.applyMsgDialog = false
            this.$message({
              message: this.ruleForm.state ? '审核不通过' : "审核通过",
              type: this.ruleForm.state ? 'error' : 'success'
            });
            this.$event.$emit('getApplyList')
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      },
      rightNext() {
        console.log('去下一个')
        this.examine()
      }
    },
    mounted() {
      this.query = this.$route.query
      this.getDetailList()
      this.ruleForm.planId = this.query.planId
      this.ruleForm.stuId = this.query.stuid
    }

  }
</script>

<style lang="less" scoped>
  .detailBox {
    .detailBox-l {
      width: 75%;
      padding: 24px;
      background: #fff;
      float: left;
      .base {
        width: 75%;
        position: relative;
        img {
          position: absolute;
          right: -180px;
          top: 42px;
          width: 116px;
          height: 152px;
        }
      }
      h1 {
        color: #2D2F33;
        font-size: 20px;
        padding-bottom: 24px;
        border-bottom: 1px solid #F1F2F5;
      }
      h2 {
        font-size: 16px;
        color: #2D2F33;
        padding: 32px 0;
        border-top: 1px solid #F1F2F5;
      }
      ul {
        li {
          display: inline-block;
          font-size: 14px;
          margin-bottom: 24px;
          em {
            color: #9299A6;
            display: inline-block;
            vertical-align: middle;
            width: 96px;
            text-align: right;
            font-style: normal;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            width: 204px;
          }
        }
        li:last-child {
          margin-bottom: 32px;
        }
      }
      .applyMsg li {
        display: block !important;
      }
    }
    .rightMsg-r {
      background: #fff;
      width: 240px;
      border-radius: 8px;
      padding: 24px;
      box-sizing: border-box;
      float: right;
      .showResult {
        /*width: 240px;*/
        margin-left: 16px;
        box-sizing: border-box;
        background: #fff;
        text-align: center;
        .showResult-t {
          display: flex;
          flex-direction: column;
          align-items: center;
          h1 {
            color: #2D2F33;
            font-size: 20px;
          }
          img {
            margin: 24px 0 12px 0;
          }
          p {
            font-size: 14px;
            color: #FE5958;
            margin-bottom: 24px;
          }
        }
        .showResult-b {
          text-align: left;
          padding-top: 16px;
          border-top: 1px solid #F1F2F5;
          span {
            font-size: 14px;
            color: #9299A6;
          }
          p {
            font-size: 14px;
            color: #45494D;
            margin-top: 8px;
          }
          .cause {
            margin-bottom: 32px;
          }
        }
      }
      .wait {
        position: relative;
        text-align: left;
        padding-bottom: 2px;
        h1 {
          margin-bottom: 32px;
          text-align: left;
        }
        /deep/ .el-radio-button__inner {
          margin-right: 16px;
          color: #45494D !important;
          background: #F4F5F8 !important;
          font-size: 13px;
          border-radius: 4px !important;
          border: 1px solid #DADDE6 !important;
          width: 64px;
          height: 32px;
          line-height: 32px;
          padding: 0;
        }
        /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: #EBF5FF !important;
          border: 1px solid #006AFF !important;
          color: #006AFF !important;
          box-shadow: none;
        }
        /deep/ .el-form-item__label {
          display: block;
          line-height: 1;
          padding-bottom: 16px;
          width: 100%;
          text-align: left;
        }
        .rightMsg {
          position: absolute;
          left: -40px;
          bottom: -60px;
          width: 240px;
          height: 60px;
          line-height: 60px;
          text-align: center;
          box-shadow: 0px -8px 12px 0px rgba(0, 0, 0, 0.05);
          border-radius: 0px 0px 8px 8px;
          background: #fff;
        }
        /deep/ .el-button.is-round {
          padding: 10px 23px;
        }
      }
    }
  }
  .examine-state {
    margin-top: 32px;
  }

</style>
