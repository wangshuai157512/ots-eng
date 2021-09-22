<template>
  <div class="examine">
    <div class="examine-header">
      <div class="examine-title">{{plan.name}}</div>
      <div class="examine-state">
        <div class="examine-state-item" v-if="info.flag === 1">
          <div class="examine-box">
            <div class="examine-state-img">
              <img src="../../../assets/stuImg/examine-wait.png" alt="">
            </div>
            <div class="examine-state-text">
              <div class="examine-state-title">审核中</div>
              <div class="examine-state-content">您的报名信息正在审核中，请耐心等待</div>
            </div>
          </div>
        </div>

        <div class="examine-state-item examine-finsh" v-if="info.flag === 2 || info.flag === 5 || info.flag === 6 || info.flag === 7">
          <div class="examine-box">
            <div class="examine-state-img">
              <img src="../../../assets/stuImg/examine-finsh.png" alt="">
            </div>
            <div class="examine-state-text">
              <div class="examine-state-title examine-finsh">审核通过</div>
              <div class="examine-state-content" v-if="info.flag === 2 || info.flag === 5">您的报名信息已审核通过，请前往缴费</div>
            </div>
          </div>
          <div class="examine-btn" @click="payFee" v-if="info.flag === 5 || info.flag === 2">缴费</div>
        </div>

        <div class="examine-state-item examine-error" v-if="info.flag === 3 || info.flag === 4">
          <div class="examine-box">
            <div class="examine-state-img">
              <img src="../../../assets/stuImg/examine-error.png" alt="">
            </div>
            <div class="examine-state-text">
              <div class="examine-state-title examine-error">审核不通过</div>
              <div class="examine-state-content">
                <span>原因：</span>
                <span class="examine-error-reason">{{info.reason}}</span>
              </div>
            </div>
          </div>
          <div class="examine-btn" v-if="info.flag === 3" @click="goEditsignUpInfo">修改报考信息</div>
        </div>

      </div>

      <div class="stu-info-container">
        <div class="info-item">
          <div class="info-title">基础信息</div>
          <div class="info-content">
            <div class="info-text-content">
              <span class="info-label">姓名：</span>
              <span class="info-text">{{info.realName}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">性别：</span>
              <span class="info-text">{{getSex}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">手机号：</span>
              <span class="info-text">{{info.phone}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">出生日期：</span>
              <span class="info-text">{{info.bitrhday}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">证件类型：</span>
              <span class="info-text">{{getCardType}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">证件号：</span>
              <span class="info-text">{{info.cardNo}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">政治面貌：</span>
              <span class="info-text">{{info.politics}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">民族：</span>
              <span class="info-text">{{info.nation}}</span>
            </div>
            <div class="avatar-url">
              <img :src="info.photo" alt="">
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title">院校信息</div>
          <div class="info-content">
            <div class="info-text-content">
              <span class="info-label">就读院校：</span>
              <span class="info-text" v-if="info.school">{{info.school.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">专业：</span>
              <span class="info-text" v-if="info.subject">{{info.subject.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">层次：</span>
              <span class="info-text">{{info.level}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">学号：</span>
              <span class="info-text">{{info.studyNo}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">省份：</span>
              <span class="info-text">{{info.province}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">函授站：</span>
              <span class="info-text" v-if="info.station">{{info.station.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">学习形式：</span>
              <span class="info-text">{{info.studyType}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">入学时间：</span>
              <span class="info-text">{{info.enterTime}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">毕业时间：</span>
              <span class="info-text">{{info.educateTime}}</span>
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title">报考信息</div>
          <div class="info-content">
            <div class="info-text-content info-text-content-col">
              <span class="info-label">报考课程：</span>
              <span class="info-text">{{getCourse}}</span>
            </div>
            <div class="info-text-content info-text-content-col">
              <span class="info-label">备注：</span>
              <span class="info-text">{{info.remark}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import stuFoot from '../components/stuFoot'

  export default {
    name: "examine",
    data () {
      return {
        userInfo : {},
        info : {},
        plan : {}
      }
    },
    components: {
      stuFoot
    },
    computed : {
      getSex () {
        let { sex } = this.info
        return sex === 0 ? '女' : '男'
      },
      getCardType () {
        const cardType = ['身份证','港澳台身份证','士官证','护照']
        return cardType[this.info.cardType - 1]
      },
      getCourse () {
        let { course } = this.info
        let courseStr = ''
        course && course.forEach(item => {
          courseStr = `${courseStr + item.courseName}、`
        })
        return courseStr.substring(0,courseStr.length - 1)
      }
    },
    async mounted () {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      await this.getCurrentPlan()
      this.selectByOne()
    },
    methods: {
      async getCurrentPlan () {
        let res = await this.$api.applyManage.getCurrentPlan()
        this.plan = res.data
      },
      selectByOne () {
        this.$api.applyManage.selectOneSignUp({
          planId : this.plan.id,
          stuIds : this.userInfo.id
        }).then(res => {
          this.info = res.data
        })
      },
      goEditsignUpInfo(){
        this.$router.push({
          path : '/stuHome/stuApply'
        })
      },
      payFee () {
        this.$router.push({
          path : '/stuHome/payFee'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .examine {
    width: 1420px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    margin-bottom: 72px;
  }

  .examine-header {
    padding: 32px 48px ;
    .examine-title {
      color: #2D2F33;
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 32px;
    }
    .examine-state {
      border-top: 1px solid #DFE4F2;
      border-bottom: 1px solid #DFE4F2;
      display: flex;
      justify-content: center;
      .examine-state-item {
        padding: 38px 0;
        .examine-box {
          display: flex;
        }
        .examine-btn {
          display: inline-flex;
          padding: 8px 26px;
          color: #fff;
          background-color: #006AFF;
          border-radius: 100px;
          margin-left: 60px;
          margin-top: 30px;
          cursor: pointer;
        }
        .examine-state-img {
          img {
            width: 48px;
            height: 48px;
            display: block;
          }
        }
        .examine-state-text {
          padding-left: 12px;
          line-height: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .examine-state-title {
            color: #F27900;
            font-weight: bold;
            font-size: 24px;
          }
          .examine-state-content {
            color: #9299A6;
            font-size: 14px;
            .examine-error-reason {
              color: #45494D;
            }
          }
        }
      }
    }
    .examine-finsh.examine-state-item {
      .examine-state-title.examine-finsh {
        color: #1DBF60;
      }
    }
    .examine-error.examine-state-item {
      .examine-state-title.examine-error {
        color: #FE5958;
      }
    }
  }

  .stu-info-container {
    margin-top: 45px;
    .info-item:first-child {
      padding-top: 0;
    }
    .info-item {
      position: relative;
      padding: 32px 0 24px 32px;
      border-bottom: 1px solid #F1F2F5;
      .avatar-url {
        position: absolute;
        top: 54px;
        right: 0;
        img {
          width: 116px;
          height: 152px;
        }
      }
      .info-title {
        color: #45494D;
        font-size: 16px;
        font-weight: 600;
      }
      .info-content {
        padding: 32px 32px 0 32px;
        display: flex;
        flex-wrap: wrap;
        .info-text-content.info-text-content-col {
          width: 100%;
        }
        .info-text-content {
          font-size: 14px;
          width: 30%;
          margin-bottom: 24px;
          .info-label{
            display: inline-block;
            width: 80px;
            color: #9299A6;
            text-align: right;
          }
          .info-text{
            color: #737780;
          }
        }
      }
    }
  }
</style>
