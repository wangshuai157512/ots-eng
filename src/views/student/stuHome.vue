<template>
  <div class="stuHome">
    <div class="pubBg">
      <img src="../../assets/stuImg/stuLogo.png" alt="">
      <div class="nav" v-if="hidNavList.indexOf(pageName) === -1">
        <span :class="{activeNav:pageName === item.name}" v-for="(item,index) in navList" :key="index" @click="handleNav(item.name)">{{item.title}}</span>
      </div>
      <div class="user" v-if="isShowUser">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goUserConfig">账号设置</el-dropdown-item>
            <el-dropdown-item @click.native="outLogin">安全退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      </div>
      <div class="stuMain">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { selectUserInfo } from '@/http/modules/student/ticket'
export default {
  name: 'stuHome',
  data() {
    return {
      userName: "",
      pageName: "",
      isShowUser: false,
      hidNavList:['register','resetPassword'],
      navList:[
        {
          title : '首页',
          name : 'home'
        },
        {
          title:"报名",
          name:"stuApply",
        },
        {
          title:"缴费",
          name:"payFee",
        },
        {
          title: "准考证",
          name: "ticket",
        },
        {
          title: "成绩",
          name: "stuScore"
        }
      ],
      planInfo : {},
      info : {}
    }
  },
  computed : {
    isSignUp() {
      let { beginSign, endSign } = this.planInfo
      let { flag } = this.info
      console.log(this.info.flag)
      let currentTime = new Date().getTime()
      beginSign = new Date(beginSign).getTime()
      endSign = new Date(endSign).getTime()
      if ((currentTime >= beginSign && currentTime <= endSign) && (flag === 0 || flag === null ||  flag === 3)) {
        return true
      }
      return false
    }
  },
  methods:{
    getCurrentPlan() {
      this.$api.applyManage.getCurrentPlan().then(res => {
        this.planInfo = res.data
      })
    },
    getInfo() {
      this.$api.stuApply.selectByOne().then(res => {
        if (res.code === 1) {
          this.info = res.data
          console.log(res.data.flag)
        }
      })
    },
    handleNav(name) {
      if (name === 'stuApply' && !this.isSignUp) {
        this.$message.warning('当前不能报名~')
        return
      }
      this.$router.push({name:name})
    },
    getPageName() {
      this.pageName = this.$route.name
    },
    goUserConfig () {
      this.$router.push({
        name: 'userConfig'
      })
    },
    outLogin() {
        this.$api.login.outLogin().then(res=> {
            if(res.code) {
                // this.$router.options.routes = []
                window.localStorage.clear();
                this.$router.replace({name:'Login'})
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', function () {
                    history.pushState(null, null, document.URL);
                });

            }
        })
    },
  },
  async created () {

   
    if (this.$route.name != 'register' && this.$route.name != 'resetPassword') {
       this.getInfo()
      this.getCurrentPlan()
      this.isShowUser = true
      const { data } = await selectUserInfo()
      this.userInfo = data
      this.userName = data.realName
    }

  },
  mounted() {
    this.getPageName()
  },
  watch: {
      $route:'getPageName'
  }


}
</script>
<style lang="less" scoped>
  .stuHome {
    height: 100%;
    background: #F4F5F8;
    position: relative;
    .pubBg {
      width: 100%;
      height: 360px;
      padding: 10px 0 0 24px;
      box-sizing: border-box;
      background: url('../../assets/stuImg/pubBg.jpg') no-repeat center center;
      background-size: cover;
      .nav {
        display: inline-block;
        vertical-align: top;
        color: #fff;
        margin-left: 98px;
        span {
          display: inline-block;
          vertical-align: top;
          height: 40px;
          line-height: 40px;
          margin-right: 60px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 16px;
          cursor:pointer
        }
        .activeNav {
          color: #FFF!important;
          font-weight: 600!important;
        }
      }
      .user{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        vertical-align: top;
        position: absolute;
        right: 30px;
        color: #fff;
      }
    }
    .stuMain {
      min-width: 74%;
      position: absolute;
      left: 50%;
      top: 108px;
      transform: translateX(-50%);
      .footer{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 68px;
        background: #FFFFFF;
        box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.06);
        border-radius: 0px 0px 8px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  /deep/ .el-dropdown {
    color: #fff;
  }
</style>
