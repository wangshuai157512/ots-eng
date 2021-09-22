<template>
  <div class="register">
    <h1>注册</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model.trim="ruleForm.realName" placeholder="请输入注册考生的真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入正确的手机号" @blur="phoneBlur"></el-input>
      </el-form-item>
      <el-form-item label="证件号" prop="cardNo">
        <el-input placeholder="请输入正确的证件号" v-model="ruleForm.cardNo" class="input-with-select" @blur="cardNoBlur">
          <el-select v-model="ruleForm.cardType" slot="prepend" placeholder="请选择">
            <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="设置密码" prop="password">
        <el-input v-model.trim="ruleForm.password" type="password" autocomplete="new-password"
                  placeholder="请输入以字母开头且只能包含字母和数字"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model.trim="ruleForm.confirmPassword" type="password" autocomplete="new-password"
                  placeholder="设置密码必须和确认密码必须相同"></el-input>
      </el-form-item>
      <el-form-item class="registerBtn">
        <el-button type="primary" @click="handleRegister('ruleForm')">注 册</el-button>
      </el-form-item>
      <div class="registerBot"><span @click="backLogin">返回登录</span>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {checkPwd, checkCardId, checkPhone} from '@/common/verify.js'

  export default {
    data() {
      return {
        cardTypeList: [
          {
            id: '1',
            name: "身份证"
          },
          {
            id: '2',
            name: "护照"
          },
          {
            id: '3',
            name: "士官证"
          },
          {
            id: '4',
            name: "港澳台身份证"
          },
        ],
        ruleForm: {
          realName: '',
          cardNo: '',
          cardType: '1',
          phone: '',
          password: '',
          confirmPassword: '',
          tenant: 'sign',
        },
        rules: {
          realName: [
            {required: true, message: '请输入注册考生的真实姓名', trigger: 'blur'},
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          cardNo: [
            {required: true, message: '请输入证件号', trigger: 'blur'},
            {message: '身份证格式错误', trigger: 'blur', validator: this.checkCardId}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {message: '手机号格式错误', trigger: 'blur', validator: checkPhone}
          ],
          password: [
            {required: true, message: '请输入设置密码', trigger: 'blur'},
            {validator: checkPwd, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: this.confirmPassword, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      checkCardId (rule,value,callback) {
        return checkCardId(rule,value,callback,this.ruleForm.cardType)
      },
      backLogin() {
        this.$router.push({name: 'Login'})
      },
      confirmPassword(rule, value, callback) {
        if (value) {
          if (this.ruleForm.password !== this.ruleForm.confirmPassword) {
            callback(new Error('设置密码必须和确认密码必须相同'));
          } else {
            callback();
          }
        }
        callback();
      },
      verification(queryCheckd) {
        this.$api.login.verification(queryCheckd).then(res => {
          if (res.code === 0) {
            this.ruleForm.cardNo = ''
          }
        })
      },
      phoneBlur() {
        let {cardNo, phone, tenant} = this.ruleForm
        let queryCheckd = {cardNo, phone, tenant,}
        if (cardNo && phone) {
          this.verification(queryCheckd)
        }
      },
      cardNoBlur() {
        let {cardNo, phone, tenant} = this.ruleForm
        let queryCheckd = {cardNo, phone, tenant}
        if (cardNo && !phone) {
          this.$confirm('请先输入手机号进行考生范围验证', '系统提示', {
            confirmButtonText: '确定',
            roundButton: true,
          })
          return
        }
        if (cardNo && phone) {
          this.verification(queryCheckd)
        }

      },

      handleRegister(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.applyManage.registerUser(this.ruleForm).then(res => {
              if (res.code) {
                this.$message({
                  message: '注册成功,请登录',
                  type: 'success'
                });
                this.$router.push({name: 'Login'})
              }
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style lang="less" scoped>
  .register {
    background: rgba(255, 255, 255, 0.95);
    width: 100%;
    padding: 32px 48px 40px 48px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    text-align: center;
    backdrop-filter: blur(10px);
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #2D2F33;
      padding-bottom: 16px;
      border-bottom: 1px solid #DADDE6;;
      margin-bottom: 40px;
      text-align: left;
    }
    .demo-ruleForm {
      display: inline-block;
      .el-form-item {
        margin-bottom: 24px !important;
        /deep/ .el-form-item__label {
          line-height: 1;
          margin-bottom: 8px;
        }
        /deep/ .el-input__inner {
          width: 360px;
          height: 40px;
        }
        .input-with-select {
          /deep/ .el-input-group__prepend {
            margin-right: 24px !important;
          }
          .el-select {
            /deep/ .el-input__inner {
              width: 116px !important;
              margin-left: 0;
              background: #fff;
            }
          }
          /deep/ .el-input__inner {
            width: 240px !important;
            margin-left: 4px;
          }
        }
      }
    }

    .registerBtn {
      margin-top: 32px;
      margin-bottom: 24px;
      /deep/ .el-button--primary {
        span {
          font-size: 16px;
        }
        background-color: #006AFF;
        width: 100%;
        height: 40px;
        border-radius: 24px;
      }

    }
    .registerBot {
      text-align: center;
      color: #9299A6;
      font-size: 14px;
      span {
        color: #006AFF;
        cursor: pointer;
      }
    }
  }
</style>
