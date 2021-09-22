<template>
    <div class="header-box">
        <el-header class="clearfix">
            <div class="heder-f fl">
                <img src="../assets/img/admin-logo.png" alt="" class="login">
            </div>
            <el-dropdown class="heder-r fr">
                <span class="logTea"><img src="../assets/img/3.png" alt=""> <em>{{userInfo.realName}}</em></span>
                <el-dropdown-menu slot="dropdown" class="dropdown-show" v-show="false">
                    <el-dropdown-item @click.native="handleEditPsd"><i class="ace-icon fa fa-key"></i>修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="outLogin"><i class="ace-icon fa fa-power-off"></i>安全退出</el-dropdown-item>
                </el-dropdown-menu>
                <el-dropdown-menu></el-dropdown-menu>
                
            </el-dropdown>
        </el-header>
        <ots-custom-dialog :dialog.sync="psdDialog" title="修改密码" width="30%">
            <template v-slot:content class="">
                <slot>
                    <div>
                        <el-form :model="psdRuleForm" :rules="rules" ref="psdRuleForm" class="editPsdForm" >
                            <!-- <el-form-item label="旧密码" prop="oldPsd" >
                                <el-input v-model="psdRuleForm.oldPsd" type="password"></el-input>
                            </el-form-item> -->
                            <el-form-item label="新密码" prop="password" >
                                <el-input v-model="psdRuleForm.password" type="password" autocomplete="new-password"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="confirmPassword">
                                <el-input v-model="psdRuleForm.confirmPassword" type="password" autocomplete="new-password"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </slot>
            </template>
            <template v-slot:footer>
                <el-button round @click="psdDialog = false"
                >取消</el-button>
                <el-button type="primary" round @click="rightEditPsd('psdRuleForm')"
                >确定</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>

<script>
import {checkPwd} from '@/common/verify.js'
export default {
    name:"out-header",
    data() {
        return {
            userInfo:{},
            psdDialog:false,
            psdRuleForm:{
                // oldPsd:'',
                userId:"",
                password:'',
                confirmPassword:'',
                tenant:'sign',
            },
             rules: {
                // oldPsd: [
                //     { required: true, message: '请输入旧密码', trigger: 'blur' },
                // ],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: checkPwd,trigger: 'blur'}
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { validator: this.confirmPassword,trigger: 'blur'}
                ]
            },
            
        }
    },
    computed : {
        // getTeacherInfo () {
        //     let that = this
        //     let isShowTeacherInfo = false
        //     this.$api.reviewManage.getConfigValue1ByKey({configKey: "FlushExtendInfo" }).then(res => {
        //       if(res.data==1){
        //         isShowTeacherInfo = true
        //       }
        //     });

        //     return isShowTeacherInfo
        // }
    },
    methods : {
        handleEditPsd() {
            this.psdDialog = true
            this.psdRuleForm.password = ''
            this.psdRuleForm.confirmPassword = ''
        },
        rightEditPsd(psdRuleForm) {
            this.$refs[psdRuleForm].validate((valid) => {
                if (valid) {
                    let editPsdQuery = {
                        userId:this.userInfo.id,
                        password:this.psdRuleForm.password,
                        confirmPassword:this.psdRuleForm.confirmPassword,
                        tenant:this.psdRuleForm.tenant
                    }
                    this.$api.login.editPsd(editPsdQuery).then(res=> {
                        if(res.code) {
                            this.$message({
                                message: '密码修改成功',
                                type: 'success'
                            });
                            this.psdDialog = false
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        confirmPassword (rule, value, callback) {
            if (value) {
                if (this.psdRuleForm.password !== this.psdRuleForm.confirmPassword) {
                    callback(new Error('确认密码必须和新密码相同'));
                } else {
                    callback();
                }
            }
            callback();
        },
        outLogin() {
            this.$api.login.outLogin().then(res=> {
                if(res.code) {
                    // this.$router.options.routes = []
                    this.$router.replace({name:'Login'})
                    window.localStorage.clear();
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', function () {
                        history.pushState(null, null, document.URL);
                    });

                }
            })
        },
        

    },
    mounted() {
        this.$store.commit('setUserInfo',JSON.parse(localStorage.getItem('userInfo')))
        this.userInfo = this.$store.state.userInfo
    },
}
</script>

<style scoped lang="less">

        .header-box {
            width: 100%;
        }
        .el-header {
            padding: 0 10px;
            height: 60px;
            line-height: 60px;
            background: #006AFF;
            box-shadow: 0px 4px 12px 0px rgba(0, 53, 128, 0.3);
            .heder-f {
                height: 60px;
                text-align: left;
                color: #fff;
                .login {
                    display: inline-block;
                    margin-left: 30px;
                    vertical-align: middle;
                }
                span {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .heder-r {
                margin-right: 30px;
                position: relative;
                .logTea {
                    display: flex;
                    justify-content: right;
                    align-items: center;
                    height: 60px;
                    color: #fff;
                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        margin-right: 5px;
                        text-align: right;
                    }
                    em {
                        font-style:normal;
                        color: #fff;
                        max-width: 113px;
                        overflow: hidden;
                        white-space:nowrap;
                        text-overflow:ellipsis;
                    }

                }

            }

        }
        .dropdown-show{
                    width: 150px!important;
                }

        .add-tea-box {
            // padding: 0px 30px;
            background: #fff;
        }
        .title-msg {
            font-size: 16px;
            font-weight: 600;
            color: #15151A;
            position: relative;
            margin-top: 20px;
        }
        .title-msg:after {
            content: ' ';
            position: absolute;
            left: -8px;
            top: 5px;
            width: 3px;
            height: 14px;
            background-color:#3388FF;
        }
        .add-tea-box /deep/ .el-input__inner {
            width: 240px;
            height: 40px;
        }
        .title-msg-top {
            margin-top: 0!important;
            margin-bottom: 10px!important;
        }
        .textareaBox {
            width: 100%!important;
        }
        /deep/ .el-form-item {
            display: inline-block;
            margin-bottom: 10px;
        }
        /deep/ .el-form-item__label {
            float: none;
        }
        /deep/ .el-form-item__content {
            margin-left: 0!important;
            // margin-right: 50px;
        }
        .editPsdForm /deep/ .el-input__inner {
            width: 280px;
        }
        .pubMsg {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .colorBtn {
            font-size: 16px;
            color: #fff;
        }
</style>
