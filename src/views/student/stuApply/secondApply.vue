<template>
     <div class="examine">
    <div class="examine-header">
      <div class="examine-title">202109学位英语考试报名</div>
      <div class="examine-state">
        <div class="info-item">
            <el-form >
            <p class="title">报考信息</p>
                <el-form-item class="ots_footer">
                    <el-form-item>
                        <span>报考课程：</span>
                        <el-checkbox-group v-model="course">
                             <el-checkbox :label="item.courseId" v-for="item in courseList" :key="item.courseId">{{item.courseName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="ots_textarea">
                        <span>备注：</span>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 2}"
                            placeholder="选填"
                            v-model="ruleForm.remark"
                            resize="none"
                            >
                        </el-input>
                    </el-form-item>
                    
                </el-form-item>
            </el-form>
        </div>
      </div>

      <div class="stu-info-container">
        <div class="info-item">
          <div class="info-title">基础信息</div>
          <div class="info-content">
            <div class="info-text-content">
              <span class="info-label">姓名：</span>
              <span class="info-text">{{ruleForm.realName }}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">性别：</span>
              <span class="info-text">{{ruleForm.sex }}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">手机号：</span>
              <span class="info-text">{{ruleForm.phone }}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">出生日期：</span>
              <span class="info-text">{{ruleForm.bitrhday }}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">证件类型：</span>
              <span class="info-text">{{ruleForm.cardType }}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">证件号：</span>
              <span class="info-text">{{ruleForm.cardNo}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">政治面貌：</span>
              <span class="info-text">{{ruleForm.politics}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">民族：</span>
              <span class="info-text">{{ruleForm.nation}}</span>
            </div>
            <div class="avatar-url">
              <img :src="ruleForm.photo" alt="">
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title">院校信息</div>
          <div class="info-content">
            <div class="info-text-content">
              <span class="info-label">就读院校：</span>
              <span class="info-text" v-if='ruleForm.school'>{{ruleForm.school.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">专业：</span>
              <span class="info-text" v-if='ruleForm.subject'>{{ruleForm.subject.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">层次：</span>
              <span class="info-text">{{ruleForm.level}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">学号：</span>
              <span class="info-text">{{ruleForm.studyNo}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">省份：</span>
              <span class="info-text">{{ruleForm.province}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">函授站：</span>
              <span class="info-text" v-if='ruleForm.station'>{{ruleForm.station.name}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">学习形式：</span>
              <span class="info-text">{{ruleForm.studyType}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">入学时间：</span>
              <span class="info-text">{{ruleForm.enterTime}}</span>
            </div>
            <div class="info-text-content">
              <span class="info-label">毕业时间：</span>
              <span class="info-text">{{ruleForm.educateTime}}</span>
            </div>
          </div>
        </div>
         <div class="info-text-checkbox">
        <el-checkbox v-model="checkeds">本人已确认提交报名信息真实无误且符合报名考试资格，后期因提交报名信息不真实、有误、不符合报名考资格，导致的一切后果自行承担。</el-checkbox>
       </div>
        <stu-foot cancelText="取消" confirmtext="提交报名信息" @confirm="UpdateRegistration" ></stu-foot>
      </div>
     <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            append-to-body
            width="960px"
            height="600px"
           :show-close='false'
           :close-on-click-modal='false'
           :close-on-press-escape='false'
            center>
            <p>为加大对网络统考的监管力度，严防替考，网考办具体要求如下：</p>
            <p>1、考生须持统考有效身份证件和准考证参加统考，一代居民身份证、户口本、临时身份证、户籍证明、社保卡、医保卡、驾照、军官证或士兵证不属于统考有效身份证件，统考考点不得允许考生参加考试。</p>
            <p>2、港澳台地区考生凭港、澳、台通行证或护照、外籍考生凭护照参加考试的，到达考点后须配合考点工作人员验证并拍照后入场。</p>
            <p>3、除港澳台地区考生、外籍考生外，其他考生均须持二代身份证参加考试。 </p>
            <p>4、考生所持身份证件类型与准考证上不一致的，不允许参加考试。 </p>
            <p>5、考生所持身份证件号码、姓名与准考证上身份证件号码、姓名不一致的，不允许参加考试。</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false" :disabled='isCountDownFinsh'>本人已认真阅读，同意报考 {{getTimeText}}</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import stuFoot from '@/views/student/components/stuFoot'
export default {
     name:'stuApply',
    components: {
            stuFoot,
        },
    data() {
        return {
            centerDialogVisible: true,
            ruleForm:{
                bitrhday:'',
                cardNo:'',
                course : [],
                cardType:'',
                educateTime:'',
                enterTime:'',
                id:'',
                level:'',
                nation:'',
                phone:'',
                realName :'',
                politics:'',
                province:'',
                remark:'',
                schoolId:'',
                sex:'',
                stationId:'',   
                studyNo :'',
                studyType:'',
                subjectId:'',
                userName:''
            },
            course : [],
            courseList:[],
            checkeds:'',
            planId : ''
        }
    },
    methods:{
        selectOneSignUp() {
            let loc = JSON.parse(localStorage.getItem('userInfo'))
            let params = {
                planId: this.planId,
                stuIds :loc.id

            }
            this.$api.applyManage.selectOneSignUp(params).then(res=> {
                // this.ruleForm = res.data
                // this.$set(this.ruleForm,'course',[])
                let params = {}
                Object.keys(res.data).forEach(item => {
                    if (item !== 'course') {
                        params[item] = res.data[item]
                    }
                })
                this.ruleForm = params
                this.courseList = res.data.course
                console.log(this.courseList)
            })
        },
        
       open() {
            this.$alert('', '报名须知', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
         },
        
        handleClose(done) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
      },
      UpdateRegistration(){
          if(!this.checkeds) {
               this.$message({
                message: '请确认人间报名信息无误',
                type: 'success'
                });
              return
          }
        
        let params = {
            planId : this.planId,
            courseId: this.course.toString()
        }
       
        Object.keys(this.ruleForm).forEach(item => {
            if (this.submitParams.indexOf(item) !== -1) {
                params[item] =  this.ruleForm[item]
            }
        })
         params.planId = this.planId
          this.$api.applyManage.UpdateRegistration(params).then(res=>{
            console.log(res)
        })
      }
    },
    computed : {
        isCountDownFinsh () {
            return this.countDown > 0
        },
        getTimeText () {
            let { countDown } = this
            return  countDown > 0 ? `(${countDown}s)` : ''
        }
    },
    mounted(){
        this.submitParams = ['planId']
        Object.keys(this.ruleForm).forEach(item => this.submitParams.push(item))
         this.$api.applyManage.getCurrentPlan().then(res=> {
            this.planId = res.data.id
            this.selectOneSignUp()
         })
    },
    
}
</script>

<style lang="less" scoped>
.examine {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    margin-bottom: 72px;
  }

  .examine-header {
    padding: 32px 48px 0;
    .examine-title {
      color: #2D2F33;
      font-size: 20px;
      font-weight: bold;
    }
    .examine-state {
      border-top: 1px solid #DFE4F2;
      border-bottom: 1px solid #DFE4F2;
      display: flex;
      justify-content: center;
      .examine-state-item {
       
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
  .info-item{
      width: 1420px;
      height:262px ;
      .info-titlenav{
          color: #45494D;
        font-size: 16px;
        font-weight: 600;  
        margin-top: 32px;
      }
    .ots_footer{
            margin:32px 0 0 20px ;
            height: 160px;
            span{
                display: inline-block;
                width: 80px;
            }
        }
  }
   .info-text-checkbox{
       width: 100%;
       height: 100px;
       text-align: center;
       line-height: 100px;
       /deep/ .el-checkbox__label{
       color: #F27900;}
   }
    .title{  width: 100%;
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: #2D2F33;
        line-height: 22px;
        margin-top: 32px;
    }
    .ots_textarea /deep/ .el-textarea{
            width: 1064px;
            height: 100px;
            padding-left:4px ;
        }   
     .ots_textarea{
              span{
                  text-align: right;
                  height: 20px;
                  width: 80px;
                  display: inline-block;
                  vertical-align: top;
              }
             
         } 
          /deep/ .el-dialog__body{
            overflow: auto;
            width: 880px;
            height: 420px;
           p{
           line-height: 30px;
           color:#45494D ;
            padding: 0 40px;
         }
       }
       /deep/ .el-dialog__footer{
            /deep/ .el-button--primary{
                width: 242px;
                height: 36px;
                background: #006AFF;
                border-radius: 20px;
                opacity: 0.5;
            } 
            
       }  
       /deep/ .el-checkbox-group{
           display: inline-block;
       }  
</style>
