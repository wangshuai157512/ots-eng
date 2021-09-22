<template>
    <div class="mainBox">
        <div class="mainCon">
            <stu-main-title></stu-main-title>
            <div class="content">
                <el-form :model="form" class="formStyle" ref="form"   :rules="rules">
                    <el-form-item label="姓名" prop="realName">
                        <el-input v-model="form.realName"></el-input>
                    </el-form-item>
                    <el-form-item label="证件号">
                        <el-input v-model="form.cardNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPassword">
                        <el-input v-model="form.confirmPassword"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <stu-foot confirmtext="确定" cancelText="" @confirm="updateUser"></stu-foot>
    </div>
</template>
<script>
import { updateInfoFn } from '@/http/modules/student/userConfig'
import { selectUserInfo } from '@/http/modules/student/ticket'
import stuFoot from '../components/stuFoot.vue'
export default {
  components: { stuFoot },
    name: 'userConfig',
    data () {
        const validatePass = (rule, value, callback) => {
            
            if (value && this.form.confirmPassword !== '') {
                this.$refs.form.validateField('checkPass')
            }   
            callback()
            
        }
        const validatePass2 = (rule, value, callback) => {
            if (value && value !== this.form.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        const isCellPhone = (val) => {
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
                return false;
            } else {
                return true;
            }
        }
        const checkPhone = (rule, value, callback) => {
            if (value && !isCellPhone(value)) {
                callback(new Error("请输入正确的手机号！"))
            } else {
                callback()
            }
        }
        return {
            form: {
                realName: '',
                cardNo: '',
                phone: '',
                password: '',
                confirmPassword: '',
            },
            rules:{
                realName: [
                    {required: true, message: '请填写考点名称', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请填写手机号', trigger: 'blur'},
                    { validator: checkPhone, trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请填写密码', trigger: 'blur'},
                    { validator: validatePass, trigger: 'blur'}
                ],
                confirmPassword: [
                    {required: true, message: '请确认密码', trigger: 'blur'},
                    { validator: validatePass2, trigger: 'blur'}
                ]
            }
        }
    },
    created () {
        this.initData()
    },
    methods: {
        async initData () {
            const { data: user } = await selectUserInfo()
            this.form.realName = user.realName
            this.form.cardNo = user.cardNo
            this.form.phone = user.phone
            this.form.id = user.id
        },
        async updateUser () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    const { code } = await updateInfoFn(this.form)
                    if (code == 1) {
                        this.$message.success('修改成功')
                          this.$router.push({
                            path : '/stuHome/home'
                        })
                    }
                }
            })
            
        }
    }
}
</script>
<style lang="less" scoped>
.mainBox {
    width: 100%;
    min-width: 700pt;
    background-color: #fff;
}
.mainCon {
    box-sizing: border-box;
    padding: 20px;
    padding-top: 16px;
    width: 100%;
    background: rgba(255, 255, 255, 0.93);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    .content {
        padding-top: 20px;
        display: flex;
        justify-content: center;
        .formStyle{
            width: 360px;
            /deep/ .el-form-item{
                margin-bottom: 22px!important;
            }
        }
    }
}
/deep/ .el-table th, .el-table tr {
    background-color: #EBECFF!important;
}
</style>