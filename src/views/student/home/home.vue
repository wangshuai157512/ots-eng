<template>
  <div class="home-container">
    <div class="sign-up">
      <div class="sign-up-title">报考流程</div>
      <div class="sign-up-step">
        <ul class="step-list">
          <li class="step-item" @click="goStuApply">
            <div class="step-img">
              <img src="../../../assets/stuImg/step-1-s.png" v-if="isSignUp">
              <img v-else src="../../../assets/stuImg/step-1-n.png">
            </div>
            <div class="step-name">报名</div>
          </li>
          <li class="step-item-spot">
            <div class="spot"></div>
            <div class="spot"></div>
            <div class="spot"></div>
          </li>
          <li class="step-item" @click="goExamine">
            <div class="step-img">
              <img src="../../../assets/stuImg/step-2-s.png" v-if="isAudit">
              <img v-else src="../../../assets/stuImg/step-2-n.png">
            </div>
            <div class="step-name">审核资格</div>
          </li>
          <li class="step-item-spot">
            <div class="spot"></div>
            <div class="spot"></div>
            <div class="spot"></div>
          </li>
          <li class="step-item" @click="goPay">
            <div class="step-img">
              <img src="../../../assets/stuImg/step-3-s.png" v-if="info.flag === 2 || info.flag === 5">
              <img v-else src="../../../assets/stuImg/step-3-n.png">
            </div>
            <div class="step-name">缴费</div>
          </li>
          <li class="step-item-spot">
            <div class="spot"></div>
            <div class="spot"></div>
            <div class="spot"></div>
          </li>
          <li class="step-item" @click="goPrint">
            <div class="step-img">
              <img src="../../../assets/stuImg/step-4-s.png" v-if="isPrint">
              <img v-else src="../../../assets/stuImg/step-4-n.png">
            </div>
            <div class="step-name">打印准考证</div>
          </li>
          <li class="step-item-spot">
            <div class="spot"></div>
            <div class="spot"></div>
            <div class="spot"></div>
          </li>
          <li class="step-item" @click="queryScore">
            <div class="step-img">
              <img src="../../../assets/stuImg/step-5-s.png" v-if="isQuery">
              <img v-else src="../../../assets/stuImg/step-5-n.png">
            </div>
            <div class="step-name">成绩查询</div>
          </li>
        </ul>
      </div>
      <!--<div class="sign-step-container">-->
      <!--<div class="sign-step1 sign-step" v-if="info.flag === 0">-->
      <!--<div class="step-text">-->
      <!--<span>报名起止时间：</span>-->
      <!--<span class="tips-text">2021年8月23日08:00至2021年8月27日23:59</span>-->
      <!--<span>（期间若考点名额报满，报名自动截止）</span>-->
      <!--</div>-->
      <!--<div class="step-text">-->
      <!--<span>您尚未报名，如需报名，请</span>-->
      <!--<span class="sign-up-btn">点击报名</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="sign-step2 sign-step" v-if="info.flag">-->
      <!--<div class="step-text">-->
      <!--<div class="step-examine" v-if="info.flag === 1">-->
      <!--<span class="examine-state examine-state-text">审核中</span>-->
      <!--<span>您的报名信息正在审核中，请耐心等待</span>-->
      <!--</div>-->
      <!--<div class="step-examine" v-if="info.flag === 3 || info.flag === 4">-->
      <!--<span class="examine-state examine-error-state-text">审核未通过</span>-->
      <!--<span>您的报名信息审核不通过，请前往</span>-->
      <!--<span class="sign-up-btn" v-if="info.flag === 3">修改报名信息</span>-->
      <!--</div>-->
      <!--<div class="step-examine" v-if="info.flag === 2 || info.flag === 5 || info.flag === 6 || info.flag === 7">-->
      <!--<span class="examine-state examine-pass-state-text">审核通过</span>-->
      <!--<span>您的报名信息已审核通过，请前往</span>-->
      <!--<span class="sign-up-btn" v-if="info.flag === 5 || info.flag === 2">缴费</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;<div class="sign-step3 sign-step">&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<template>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<div class="step-text">&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<span>缴费时间为：</span>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<span class="tips-text">2021年9月2日-9月6日</span>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<span>（期间若考点名额报满，报名自动截止）</span>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<div class="step-text">&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<span>您有尚未缴费的报考科目，未在规定时间内缴纳报考费将视为放弃报名考试，请</span>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;<span class="sign-up-btn">立即缴费</span>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;</template>&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;<template>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="step-text">&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="pay-success">您已缴费成功</span>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</template>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->

      <!--&lt;!&ndash;<div class="sign-step4 sign-step">&ndash;&gt;-->
      <!--&lt;!&ndash;<template>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="step-text">&ndash;&gt;-->
      <!--&lt;!&ndash;<span>准考证打印时间：</span>&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="tips-text">2021年9月20日-考前30分钟</span>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="step-text">&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="sign-up-btn">查看准考证</span>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</template>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->

      <!--&lt;!&ndash;<div class="sign-step5 sign-step">&ndash;&gt;-->
      <!--&lt;!&ndash;<template>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="step-text">&ndash;&gt;-->
      <!--&lt;!&ndash;<span>成绩查询开始时间：</span>&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="tips-text">2021年10月15日</span>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="step-text">&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="sign-up-btn">查询成绩</span>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</template>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->

      <!--</div>-->
    </div>
    <div class="stu-info">
      <div class="stu-header">
        <div class="stu-avatarurl">
          <img :src="getAvatarUrl" alt="">
        </div>
        <div class="stu-name-of-card">
          <div class="stu-name">{{info.realName}}</div>
          <div class="card-id">证件号：{{info.cardNo}}</div>
        </div>
      </div>
      <div class="school-info">
        <div class="school-info-title">院校信息</div>
        <ul class="school-info-list">
          <li class="school-info-item">
            <span class="info-label">就读院校：</span>
            <span class="info-value">{{info.schoolId}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">专业：</span>
            <span class="info-value">{{info.subjectId}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">学号：</span>
            <span class="info-value">{{info.studyNo}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">省份：</span>
            <span class="info-value">{{info.province}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">函授站：</span>
            <span class="info-value">{{info.stationId}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">学习形式：</span>
            <span class="info-value">{{info.studyType}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">入学时间：</span>
            <span class="info-value">{{info.enterTime}}</span>
          </li>
          <li class="school-info-item">
            <span class="info-label">毕业时间：</span>
            <span class="info-value">{{info.educateTime}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        info: {},
        planInfo: {}
      }
    },
    computed: {
      getAvatarUrl() {
        let {photo} = this.info
        if (photo) {
          return photo
        }
        return require('../../../assets/stuImg/default-avatarurl.png')
      },
      isSignUp () {
        let { currentTime, beginSign, endSign, flag} = this.getSignTime()
        if ((currentTime >= beginSign && currentTime <= endSign) || flag === 0 || flag === null) {
          return true
        }
        return false
      },
      isGoSignUp () {
        let { currentTime, beginSign, endSign, flag} = this.getSignTime()
        if ((currentTime >= beginSign && currentTime <= endSign) && flag === 0) {
          return true
        }
        return false
      },
      isPrint () {
        let { flag } = this.info
        let { endPay } = this.planInfo
	    	let { beginEntrance } = this.planInfo
		    let { beginExam } = this.planInfo
        let endPayTime = new Date(endPay).getTime()
        let currentTime = new Date().getTime()
	    	let beginEntranceTime = new Date(beginEntrance).getTime()
		    let beginExamTime = new Date(beginExam).getTime()
        if ((flag === 6 || flag === 7) && currentTime >= beginEntranceTime && currentTime <= beginExamTime) {
          return true
        }
        return false
      },
      isQuery() {
        let {flag} = this.info
        let {beginScoreCheck} = this.planInfo
        let queryTime = new Date(beginScoreCheck).getTime()
        let currentTime = new Date().getTime()
        if (flag === 7 && currentTime >= queryTime) {
          return true
        }
        return false
      },
      isAudit() {
        let {flag} = this.info
        let {endAudit} = this.planInfo
        let currentTime = new Date().getTime()
        let endAuditTime = new Date(endAudit).getTime()
        if (flag > 0 && currentTime <= endAuditTime) {
          return true
        }
        return false
      }
    },
    mounted() {
      this.getInfo()
      this.getCurrentPlan()
    },
    methods: {
      getSignTime () {
        let { beginSign, endSign } = this.planInfo
        let { flag } = this.info
        let currentTime = new Date().getTime()
        beginSign = new Date(beginSign).getTime()
        endSign = new Date(endSign).getTime()
        return {
          currentTime,
          beginSign,
          endSign,
          flag
        }
      },
      //去报名
      goStuApply() {
        if (this.isGoSignUp) {
          this.$router.push('/stuHome/stuApply')
        }
      },
      //审核资格
      goExamine() {
        if (this.isAudit) {
          this.$router.push('/stuHome/stuExamine')
        }
        // let { flag } = this.info
        // if (flag > 0) {
        //   this.$router.push('/stuHome/stuExamine')
        // }
      },
      //去缴费
      goPay() {
        let {flag} = this.info
        if (flag === 2 || flag === 5) {
          this.$router.push('/stuHome/payFee')
        }
      },
      //打印准考证
      goPrint() {
        if (this.isPrint) {
          this.$router.push('/stuHome/ticket')
        }
      },
      //成绩查询
      queryScore() {
        if (this.isQuery) {
          this.$router.push('/stuHome/score')
        }
      },
      getCurrentPlan() {
        this.$api.applyManage.getCurrentPlan().then(res => {
          this.planInfo = res.data
        })
      },
      getInfo() {
        this.$api.stuApply.selectByOne().then(res => {
          if (res.code === 1) {
            this.info = res.data
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .home-container:after {
    content: "";
    height: 0;
    clear: both;
    display: block;
    visibility: hidden;
  }

  .step-list {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    .step-item-spot {
      display: flex;
      align-items: center;
      margin: 0 43px;
      .spot {
        width: 6px;
        height: 6px;
        background: #DADDE6;
        border-radius: 50%;
        margin-right: 10px;
        margin-top: -28px;
      }
    }
    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .step-img {
        width: 64px;
        height: 64px;
        img {
          width: 64px;
          height: 64px;
        }
      }
      .step-name {
        color: #45494D;
        font-size: 14px;
        margin-top: 10px;
        white-space: nowrap;
      }
    }
  }

  .home-container {
    .sign-up {
      float: left;
      width: 75%;
      min-height: 480px;
      background: #fff;
      border-radius: 8px;
      padding: 40px 50px;
      box-sizing: border-box;
      .sign-up-title {
        color: #2D2F33;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
    }
    .stu-info {
      width: 22%;
      float: right;
      .stu-header {
        box-sizing: border-box;
        padding: 18px 30px;
        height: 108px;
        display: flex;
        background: url("../../../assets/stuImg/stu-info-header-bgc.png") no-repeat;
        background-size: 100% 100%;
        align-items: center;
        .stu-avatarurl {
          img {
            width: 72px;
            height: 72px;
            border-radius: 50%;
          }
        }
        .stu-name-of-card {
          padding-left: 16px;
          .stu-name {
            font-size: 20px;
            font-weight: bold;
          }
          .card-id {
            color: #737780;
            font-size: 13px;
          }
        }
      }
      .school-info {
        background: #fff;
        box-sizing: border-box;
        padding: 24px 28px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        .school-info-title {
          color: #1A2B3E;
          font-size: 18px;
          font-weight: bold;
          line-height: 1;
        }
        .school-info-list {
          .school-info-item {
            font-size: 14px;
            margin-top: 24px;
            line-height: 1;
            .info-label {
              display: inline-block;
              width: 80px;
              text-align: right;
              color: #9299A6;
            }
            .info-value {
              color: #737780;
            }
          }
        }
      }
    }
  }

  .sign-step-container {
    margin-top: 26px;
    .step-text {
      cursor: pointer;
      font-size: 14px;
      color: #737780;
      margin-bottom: 4px;
      .examine-state {
        font-size: 20px;
        font-weight: bold;
        margin-right: 16px;
      }
      .step-examine {
        .examine-state-text {
          color: #F27900;
        }
        .examine-error-state-text {
          color: #FE5958;
        }
        .examine-pass-state-text {
          color: #1DBF60;
        }
      }
      .tips-text {
        color: #45494D;
        font-weight: bold;
      }
      .sign-up-btn {
        font-weight: bold;
        color: #006AFF;
        margin-left: 4px;
      }
    }
    .sign-step1 {
      background: #EBF2FF;
    }
    .sign-step2 {
      background: #FFF4F5;
    }
    .sign-step3 {
      background: #FFF7EB;
      .pay-success {
        color: #1DBF60;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .sign-step4 {
      background: #EDFFF8;
      .sign-up-btn {
        margin-left: 0;
        margin-top: 5px;
      }
    }
    .sign-step5 {
      background: #F1F3FE;
      .sign-up-btn {
        margin-left: 0;
        margin-top: 5px;
      }
    }
    .sign-step1:after {
      border-color: transparent transparent #F1F3FE transparent;
      left: 68px;
      top: -20px;
    }
    .sign-step2:after {
      border-color: transparent transparent #FFF4F5 transparent;
      left: 268px;
      top: -20px;
    }
    .sign-step3:after {
      border-color: transparent transparent #FFF7EB transparent;
      left: 468px;
      top: -20px;
    }
    .sign-step4:after {
      border-color: transparent transparent #EDFFF8 transparent;
      left: 668px;
      top: -20px;
    }
    .sign-step5:after {
      border-color: transparent transparent #F1F3FE transparent;
      left: 39px;
      top: -20px;
    }
    .sign-step:after {
      width: 0;
      height: 0;
      border-width: 12px;
      border-style: solid;
      position: absolute;
      content: ' ';
    }
    .sign-step {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      height: 80px;
      border-radius: 8px;
      padding: 0 24px;
      position: relative;
    }
  }

  @media screen and (max-width: 1600px) {
    .step-item-spot {
      margin: 0 20px !important;
    }
  }
</style>
