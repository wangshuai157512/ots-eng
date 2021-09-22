<template>
    <div class="resetPassword">
        <div class="login-content">
          <div class="login-box">
            <div class="reset-pass-header">找回密码</div>
            <div class="reset-pass-step-box">
              <div class="step-item" :class="[step > 0 ? 'active' : '']">
                <div class="step-item-num">1</div>
                <div class="step-item-name">填写手机号</div>
              </div>
              <div class="step-division" :class="[step > 1 ? 'active' : '']">
                <div class="step-division__"></div>
                <div class="step-division__"></div>
                <div class="step-division__"></div>
              </div>
              <div class="step-item" :class="[step > 1 ? 'active' : '']">
                <div class="step-item-num">2</div>
                <div class="step-item-name">设置密码</div>
              </div>
              <div class="step-division" :class="[step > 2 ? 'active' : '']">
                <div class="step-division__"></div>
                <div class="step-division__"></div>
                <div class="step-division__"></div>
              </div>
              <div class="step-item" :class="[step > 2 ? 'active' : '']">
                <div class="step-item-num">3</div>
                <div class="step-item-name">完成</div>
              </div>
            </div>
            <div class="reset-pass-form">
              <el-form ref="resetPass" :rules="rule1" :model="resetPass" v-if="step === 1">
                <el-form-item label="证件号" prop="cardNo">
                  <el-input type="text" v-model="resetPass.cardNo" placeholder="请输入证件号"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input type="text" v-model="resetPass.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="next active" @click="next('resetPass')">下一步</div>
                </el-form-item>
              </el-form>
              <el-form ref="resetPass" :rules="rule2" :model="resetPass" v-if="step === 2">
                <el-form-item label="设置新密码" prop="password" :key="1">
                  <el-input type="text" v-model="resetPass.password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword" :key="2">
                  <el-input type="text" v-model="resetPass.confirmPassword" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
                <!-- <el-form-item> -->
                  <div class="next active" @click="rightEditPsd('resetPass')">确定</div>
                <!-- </el-form-item> -->
              </el-form>
              <div class="reset-finsh" v-if="step === 3">
                <div class="reset-success-icon">
                  <img src="../../../assets/stuImg/reset-pass-success-icon.png" alt="">
                </div>
                <div class="reset-success-text">密码修改成功</div>
                <div class="auto-go-login">
                  {{pushTime}}s后自动跳转登录页面，或<span @click="handleLogin">直接跳转</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import {checkPwd} from '@/common/verify.js'
    export default {
        name: 'resetPassword',
        data () {
            return {
                step : 1,
                pushTime : 5,
                resetPass : {
                  tenant: 'sign',
                  userId:"",
                  cardNo:"",
                  phone : '',
                  password : '',
                  confirmPassword : '',
                },
                rule1 : {
                  cardNo: [
                      { required: true, message: '请输入证件号', trigger: 'blur' },
                  ],
                  phone: [
                      { required: true, message: '请输入手机号', trigger: 'blur' }
                  ],
                },
                rule2 : {
                      password: [
                        { required: true, message: '请输入设置密码', trigger: 'blur' },
                        { validator: checkPwd,trigger: 'blur'}
                      ],
                      confirmPassword: [
                          { required: true, message: '请输入确认密码', trigger: 'blur' },
                          { validator: this.confirmPassword,trigger: 'blur'}
                      ]
                },
            }
        },
        methods : {
              confirmPassword (rule, value, callback) {
                if (value) {
                    if (this.resetPass.password !== this.resetPass.confirmPassword) {
                        callback(new Error('设置密码必须和确认密码必须相同'));
                    } else {
                        callback();
                    }
                }
                callback();
            },
            next(formName) {
                this.$refs[formName].validate((valid)=> {
                    if(valid) {
                      let { cardNo, phone, tenant} = this.resetPass
                        this.$api.login.queryInfo({ cardNo, phone, tenant}).then(res=> {
                            if(res.code) {
                              this.resetPass.userId = res.data
                              this.step = 2 
                            }
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
           
            rightEditPsd(formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      let { userId, password, confirmPassword, tenant} = this.resetPass
                      this.$api.login.editPsd({ userId, password, confirmPassword, tenant}).then(res=> {
                          if(res.code) {
                              this.step = 3
                              this.pushTime = 5
                              this.timer = setInterval(() => {
                                  if (this.pushTime === 0) {
                                    clearInterval(this.timer)
                                    this.$router.push({name:'Login'})
                                  }
                                  this.pushTime --
                              }, 5000)
                          }
                      })
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
          },
          resetForm(formName) {
              this.$refs[formName].resetFields();
          },
          handleLogin() {
            this.$router.push({name:'Login'})
          }
        }
    }
</script>


<style lang="less" scoped>
    .resetPassword {
        background: rgba(255, 255, 255, 0.95);
        width: 100%;
        height: 500px;
        padding: 32px 48px 40px 48px;
        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        backdrop-filter: blur(10px);
        .reset-pass-header {
            color: #333;
            font-size: 20px;
            font-weight: bold;
            padding-bottom: 16px;
            border-bottom: 1px solid #EEEEEE;
        }
        .reset-pass-step-box {
            margin-top: 20px;
            height: 46px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            .step-item.active {
                .step-item-num {
                background-color: #006AFF;
                color: #fff;
                }
                .step-item-name {
                color: #006AFF;
                }
            }
            .step-item {
                display: flex;
                align-items: center;
                .step-item-num {
                width: 28px;
                height: 28px;
                background-color: #D8D8D8;
                color: #fff;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                }
                .step-item-name {
                margin-left: 14px;
                color: #666666;
                font-size: 13px;
                font-weight: bold;
                }
            }
            .step-division.active {
                .step-division__ {
                background-color: #006AFF;
                }
            }
            .step-division {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 30px;
                .step-division__ {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #D5D5D5;
                }
                .step-division__:nth-child(2) {
                margin: 0 8px;
                }
            }
        }
        .reset-pass-form {
            display: flex;
            justify-content: center;
            margin-top: 40px;
            .next.active {
                background: #006AFF;
            }
            .next {
                width: 360px;
                height: 40px;
                background: #D5D5D5;
                border-radius: 100px;
                color: #fff;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
            }
            .code-form {
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .code-time {
                  width: 100px;
                  height: 38px;
                  background: #fff;
                  color: #006AFF;
                  border: 1px solid #006AFF;
                  border-radius: 4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .get-code-btn {
                  cursor: pointer;
                  width: 102px;
                  height: 38px;
                  border: 1px solid #D5D5D5;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 4px;
                  margin-top: 2px;
                }
                .get-code-btn.active {
                  border: 1px solid #006AFF;
                  color: #006AFF;
                }
            }
            .el-form-item {
                margin-bottom: 24px!important;
                 /deep/ .el-form-item__label {
                    line-height: 1;
                    margin-bottom: 8px;
                }
                /deep/ .el-input__inner {
                    width: 360px;
                    height: 40px;
                }
            }
        }
        .reset-finsh {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .reset-success-icon {
                margin-bottom: 14px;
                img {
                width: 40px;
                height: 40px;
                }
            }
            .reset-success-text {
                color: #08BD6B;
                font-size: 24px;
                font-weight: bold;
            }
            .auto-go-login {
                margin-top: 12px;
                color: #9299A6;
                font-size: 16px;
                span{
                   color: #006AFF;
                   cursor: pointer;
                }
            }
        }
    }
</style>