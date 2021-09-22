<template>
    <div id="login">
        <div class="login-l">
            <div class="projectLogo">
                <img src="../assets/img/project-logo.png" alt="">
            </div>
            <!-- <div class="explain">
                <h1>智慧考试新模式</h1>
                <ul>
                    <li v-for="item in explainList" :key="item">{{item}}</li>
                </ul>
            </div> -->
        </div>
        <div class="login-r">
            <!-- <div class="clientLogo">
                <img src="../assets/img/client-logo.png" alt="">
            </div> -->
            <div class="fromLogo">
                <h1>欢迎登录</h1>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item prop="userName">
                        <el-input v-model="ruleForm.userName" placeholder="请输入用户名 ( 学生证件号即为用户名 )"></el-input>
                        <i class="el-icon-menu"></i>
                    </el-form-item>
                     <el-form-item prop="password">
                        <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"></el-input>
                        <i class="el-icon-menu"></i>
                    </el-form-item>
                     <el-form-item prop="imageCheckCode">
                        <el-input v-model="ruleForm.imageCheckCode" placeholder="请输入验证码"></el-input>
                        <i class="el-icon-menu"></i>
                        <img :src="codeSrc" alt="" class="code-img" @click="handleCode">
                    </el-form-item>
                    <el-form-item class="loginBtn">
                        <el-button type="primary" @click="handleLogin('ruleForm')">登 录</el-button>
                    </el-form-item>
                    <div class="logoBot">
                        <div>
                            还没有账号？<span @click="goRegister">立即注册</span>
                        </div>
                        <span @click="resetPassword">
                            忘记密码
                        </span>
                    </div>

                </el-form>

            </div>
            <div class="copyright">
                ©2015-2019 弘成科技发展有限公司版权所有 京ICP证041171号 京公网安备110101002605
            </div>
        </div>

    </div>
</template>

<script>
import crypto from 'crypto'
import {imageCheckCodeOne} from '@/http/api.js'
    export default {
       data() {
           return {
                codeSrc:"",
                explainList:['海量云题库，支持多种题型批量导入、智能查重。','大数据算法实现一键组卷，支持多种组卷方式。','人脸识别，严防考试作弊，保障考场纪律。'],
                ruleForm:{
                  authMode:1,
                  userName: '',
                  password: '',
                  imageCheckCode: '',
                  tenant: 'sign',
                },
                rules: {
                  userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    imageCheckCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                    ]
                }

           }
       },
       mounted() {
           this.codeSrc= `${imageCheckCodeOne}?time=${Math.random()}`
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    this.handleLogin('ruleForm')
                }
            })
       },
       methods: {
           handleCode() {
            this.codeSrc= `${imageCheckCodeOne}?time=${Math.random()}`
           },
           handleLogin(formName) {
               this.$refs[formName].validate((valid)=> {

                   if(valid) {
                       let { password,...parmas } = this.ruleForm
                       let md5Password = password
                       const md5 = crypto.createHash('md5')
                       md5.update(md5Password)
                       md5Password = md5.digest('hex')
                       let queryRuleForm = {
                            password:md5Password,
                            ...parmas
                       }
                       this.$api.login.login(queryRuleForm).then(res=> {
                            if(res.code) {
                                let userInfo = JSON.stringify(res.data)
                                localStorage.setItem('userInfo',userInfo)
                                this.$message({
                                        message: '登录成功',
                                        type: 'success'
                                    });
                                if(res.data.roleType === 2) {
                                    this.$router.push({name:'home'})
                                }else {
                                    this.$router.push({name:'index'})
                                }

                            }else {
                                this.codeSrc= `${imageCheckCodeOne}?time=${Math.random()}`
                            }
                        })
                   }else {
                        console.log('error submit!!');
                        return false;
                        
                    }
               })
           },
           resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            goRegister() {
                this.$router.push({name:'register'})
            },
            resetPassword() {
                this.$router.push({name:'resetPassword'})
            }
       }
    }
</script>

<style lang="less" scoped>
    #login {
        width: 100%;
        height: 100%;
        display: flex;
        .login-l {
            width: 480px;
            height: 100%;
            padding: 46px 48px;
            box-sizing: border-box;
            background: url('../assets/img/login-l-bg.jpg') bottom center no-repeat;
            background-size: cover;
            .explain {
                h1 {
                    margin-top: 152px;
                    margin-bottom: 36px;
                    font-size: 28px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.95);
                }
                li {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.75);
                    position: relative;
                    margin-bottom: 16px;
                    margin-left: 10px;
                }
                li:after {
                    content: ' ';
                    position: absolute;
                    left: -10px;
                    top: 10px;
                    width: 5px;
                    height: 5px;
                    background: rgba(255, 255, 255, 0.75);
                    border-radius: 50%;
                }
            }

        }
        .login-r {
            flex: 1;
            position: relative;
            background: url('../assets/img/login-r-bg.jpg') top center no-repeat;
            background-size: cover;
            padding: 44px 50px 36px 50px;
            .fromLogo {
                width: 480px;
                height: 460px;
                background: rgba(255, 255, 255, 0.2);
                box-shadow: 0px 8px 36px 0px rgba(0, 62, 153, 0.1), -1px 1px 1px 0px rgba(255, 255, 255, 0.5);
                border-radius: 12px;
                padding: 40px 60px;
                box-sizing: border-box;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                h1 {
                    font-weight: 600;
                    color: #2D2F33;
                    font-size: 28px;
                    margin-bottom: 32px;
                }
                .demo-ruleForm {
                    /deep/ .el-form-item__content {
                        margin-left: 0!important;
                    }
                    .el-form-item {
                        position: relative;
                        margin-bottom: 24px!important;
                        i {
                            position: absolute;
                            top: 14px;
                            left: 10px;
                            color: #C2C6CC;
                        }
                        /deep/ .el-input__inner {
                            padding-left: 34px!important;
                            padding-bottom: 16px!important;
                            border: 0!important;
                            border-bottom: 1px solid #E6E9F2!important;
                            background: transparent;
                        }
                        .code-img {
                            position: absolute;
                            top: 8px;
                            right: 10px;
                            width: 80px;
                            height: 30px;
                        }
                        /deep/ .el-button--primary {
                            span {
                               font-size: 20px;
                            }
                            background-color: #006AFF;
                            width: 100%;
                            height: 52px;
                            border-radius: 26px;
                        }

                    }
                    .loginBtn {
                        margin-top: 48px;
                    }
                    .logoBot {
                        display: flex;
                        justify-content: space-between;
                        color: #9299A6;
                        font-size: 14px;
                        span {
                            color: #006AFF;
                            cursor: pointer;
                        }
                    }
                }

            }
            .copyright {
                font-size: 14px;
                color: #9299A6;
                text-align: center;
                position: absolute;
                left: 50%;
                bottom: 36px;
                transform: translateX(-50%);
            }
        }
    }

</style>
