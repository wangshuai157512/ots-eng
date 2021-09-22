<template>
  <div>
    <ots-main-title></ots-main-title>
    <div class="applyManageAddBox">
      <h1>{{planInfo.name}}</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div>
          <h2>基础信息</h2>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model.trim="ruleForm.realName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="ruleForm.sex" placeholder="请选择">
              <el-option label="女" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" prop="cardType">
            <el-select :disabled="isEdit" v-model.trim="ruleForm.cardType" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in cardTypeList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号" prop="cardNo">
            <el-input :disabled="isEdit" v-model="ruleForm.cardNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="bitrhday">
            <el-date-picker
              v-model="ruleForm.bitrhday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="政治面貌" prop="politics">
            <el-select v-model="ruleForm.politics" placeholder="请选择">
              <el-option :label="item.name" :value="item.name" v-for="item in politics" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="ruleForm.nation" placeholder="请选择">
              <el-option :label="item.name" :value="item.name" v-for="item in nation" :key="item.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="照片信息" prop="photo" class="upload-img">
            <div class="photo">
              <img v-if="!ruleForm.photo" src="../../assets/img/auto-photo.jpg">
              <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
            </div>
            <div class="avatarTip">
              <el-upload
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg">
                <el-button type="primary" round>点击上传</el-button>
              </el-upload>
              <!--<p class="mb10">要求：</p>-->
              <div class="upload-tips">
                <p class="col_grayQ">1. 必须是报考人本人真实免冠蓝底照片，不许带眼镜，照片应清晰可识别身份，过于模糊的照片无法上报成功。</p>
                <p class="col_grayQ"> 2. 照片必须是标准JPG格式，文件最大不超过40kb；照片宽度不超过480像素，高度应不超过640像素，宽高比例为3:4。</p>
              </div>
            </div>
          </el-form-item>
        </div>
        <div>
          <h2>院校信息</h2>
          <el-form-item label="就读院校" prop="schoolId">
            <el-select v-model="ruleForm.schoolId" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in schoolList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-select v-model="ruleForm.province" placeholder="请选择">
              <el-option :label="item.name" :value="item.name" v-for="item in citys" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学号" prop="studyNo">
            <el-input v-model.trim="ruleForm.studyNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="subjectId">
            <el-select v-model="ruleForm.subjectId" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in subject" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="函授站" prop="stationId">
            <el-select v-model="ruleForm.stationId" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in stationIdList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层次" prop="level">
            <el-select v-model="ruleForm.level" placeholder="请选择">
              <el-option :label="item.name" :value="item.name" v-for="item in level" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学习形式" prop="studyType">
            <el-select v-model="ruleForm.studyType" placeholder="请选择">
              <el-option :label="item.name" :value="item.name" v-for="item in studyType" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入学时间" prop="bitrhday">
            <el-date-picker
              v-model="ruleForm.enterTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="毕业时间" prop="bitrhday">
            <el-date-picker
              v-model="ruleForm.educateTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <h2>报考信息</h2>
          <el-form-item label="报考课程" prop="courseId">
            <el-checkbox-group v-model="ruleForm.courseId">
              <el-checkbox v-for="item in courseList" :label="item.courseId" :key="item.courseId">{{item.courseName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="remark" label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="ruleForm.remark"></el-input>
          </el-form-item>
        </div>
        <!--<div>-->
          <!--<h2>密码设置</h2>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" plain disabled>手机号码后6位</el-button>-->
          <!--</el-form-item>-->
        <!--</div>-->
      </el-form>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {getQueryAllSchool} from '@/http/modules/school'
  import {getQueryAllStation} from '@/http/modules/station'
  import citys from '../baseSet/examSite/citys'
  import {politics} from "../../common/variable";
  import nation from '../student/stuApply/nation'
  import {checkPhone} from "../../common/verify";

  export default {
    data() {
      return {
        query: {},
        planId: '',
        ruleForm: {
          realName: '',
          phone: '',
          cardType: 1,
          cardNo: '', //220204199002085300 测试身份证号
          photo: '',
          schoolId: '',
          subjectId: "",
          stationId: "",
          courseId: [],
          password: "",
          confirmPassword: "",
          province: '',
          studyNo: '',
          bitrhday: '',
          politics: '',
          level: '',
          studyType: '',
          enterTime: '',
          educateTime: '',
          nation: '',
          remark: '',
          sex: ''
        },
        nation: nation,
        politics: politics,
        citys: citys,
        level: [
          {
            name: '高起本'
          },
          {
            name: '专升本'
          }
        ],
        studyType: [
          {
            name: '函授'
          },
          {
            name: '业余'
          },
          {
            name: '自考'
          }
        ],
        schoolList: [],
        stationIdList: [],
        courseList: [],
        cardTypeList: [
          {
            id: 1,
            name: "身份证"
          },
          {
            id: 2,
            name: "护照"
          },
          {
            id: 3,
            name: "士官证"
          },
          {
            id: 4,
            name: "港澳台身份证"
          },
        ],
        rules: {
          realName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '请输入性别', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {required: true, message: '手机号格式错误', validator: checkPhone},
          ],
          cardType: [
            {required: true, message: '请选择证件类型', trigger: 'change'}
          ],
          cardNo: [
            {required: true, message: '请输入证件号', trigger: 'blur'}
          ],
          photo: [
            {required: true, message: '请上传照片', trigger: 'change'}
          ],
          schoolId: [
            {required: true, message: '请选择学校', trigger: 'change'}
          ],
          subjectId: [
            {required: true, message: '请输入专业', trigger: 'change'},
          ],
          stationId: [
            {required: true, message: '请选择函数站', trigger: 'change'},
          ],
          courseId: [
            {type: 'array', required: true, message: '请选择课程', trigger: 'change'},
          ],
          province: [
            {required: true, message: '请选择省份', trigger: 'change'},
          ],
          studyNo: [
            {required: true, message: '请输入学号', trigger: 'blur'},
          ],
          bitrhday: [
            {required: true, message: '请选择出生日期', trigger: 'change'},
          ],
          politics: [
            {required: true, message: '请选择政治面貌', trigger: 'change'}
          ],
          level: [
            {required: true, message: '请选择层次', trigger: 'change'}
          ],
          studyType: [
            {required: true, message: '请选择学习形式', trigger: 'change'}
          ],
          enterTime: [
            {required: true, message: '请选择入学时间', trigger: 'change'}
          ],
          educateTime: [
            {required: true, message: '请选择毕业时间', trigger: 'change'}
          ],
          nation: [
            {required: true, message: '请选择民族', trigger: 'change'}
          ]
        },
        subject: [],
        planInfo : {}
      }
    },
    computed : {
      isEdit () {
        return this.$route.query.stuid
      }
    },
    methods: {
      autoSetBitrhday (val) {
        let { cardType } = this.ruleForm
        let birthday = ''
        if (cardType === 1) {
          if(val.length == 15){
            birthday = "19"+val.substr(6,6);
          } else if(val.length == 18){
            birthday = val.substr(6,8);
          }
          birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
          this.$set(this.ruleForm,'bitrhday',birthday)
        }
      },
      getCourse() {
        this.$api.applyManage.getPlanCourse({planId: this.planId}).then(res => {
          if (res.code && res.data.length > 0) {
            this.courseList = res.data
            if (!this.$route.query.stuid && res.data.length === 1) {
              this.ruleForm.courseId = [res.data[0].courseId]
            }
          }
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt30kb = file.size / 1024 < 30;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt30kb) {
          this.$message.error('上传头像图片大小不能超过 30kb!');
        }
        return isJPG && isLt30kb;
      },
      uploadImg(data) {
        let that = this
        let fileData = data.file
        let reader = new FileReader()
        reader.readAsDataURL(fileData)
        reader.onload = function (e) {
          if (e.currentTarget.result) {
            that.ruleForm.photo = e.currentTarget.result
          }
        }
      },
      ...mapMutations(['SAVE_PAGE_THIS']),
      save() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let password = this.ruleForm.phone.substring(this.ruleForm.phone.length - 6)
            let params = {
              ...this.ruleForm,
              password,
              confirmPassword: password,
              photo: this.ruleForm.photo.split(',')[1],
              courseId: this.ruleForm.courseId.toString()
            }
            let saveState = this.ruleForm.id ? 'UpdateRegistration' : 'addStudengt' // 有id编辑，没有id添加
            this.$api.applyManage[saveState](params)
              .then(res => {
                if (res.code) {
                  this.$message({
                    message: this.ruleForm.id ? '修改成功' : '添加成功',
                    type: 'success'
                  });
                  this.$event.$emit('getData')
                  this.$router.push({name: 'applyManage'})
                }
              })
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      },
      subjects() {
        this.$api.applyManage.queryAllSubject({state: 1}).then(res => {
          if (res.code === 1) {
            this.subject = res.data
          }
        })
      },
      getPlan () {
        this.$api.applyManage.getCurrentPlan().then(res => {
          this.planInfo = res.data
        })
      }
    },
    mounted() {
      this.getPlan()
      this.subjects()
      this.SAVE_PAGE_THIS(this)
      getQueryAllSchool({state: 1}).then(res => {
        if (res.code) {
          this.schoolList = res.data
        }
      })
      getQueryAllStation({state: 1}).then(res => {
        this.stationIdList = res.data
      })
      this.planId = this.$route.query.planId
      this.getCourse()
      if (this.$route.query.stuid) {
        document.querySelector('.el-breadcrumb').querySelector('.currentBread').querySelector('.el-breadcrumb__inner').innerText = '修改报缴信息'
        this.query = this.$route.query
        let {planId, stuid} = this.query
        let querySelectOne = {
          planId,
          stuIds: stuid
        }
        this.$api.applyManage.selectOneSignUp(querySelectOne).then(res => {
          let {courseId} = this.ruleForm
          this.ruleForm = Object.assign({}, this.ruleForm, {
            planId,
            realName: res.data.realName,
            phone: res.data.phone,
            cardType: res.data.cardType,
            cardNo: res.data.cardNo,
            photo: res.data.photo,
            schoolId: res.data.school ? res.data.school.id : '',
            subjectId: res.data.subject ? res.data.subject.id : '',
            stationId: res.data.station ? res.data.station.id : '',
            id: res.data.id,
            studyNo: res.data.studyNo,
            level: res.data.level,
            studyType: res.data.studyType,
            nation: res.data.nation,
            educateTime: res.data.educateTime,
            enterTime: res.data.enterTime,
            bitrhday: res.data.bitrhday,
            politics: res.data.politics,
            province: res.data.province,
            remark: res.data.remark,
            sex: res.data.sex
          })
          res.data.course.forEach(item => {
            courseId.push(item.courseId)
          })
        })
      }
    },
    watch : {
      'ruleForm.cardNo' : 'autoSetBitrhday'
    }
  }
</script>

<style lang="less" scoped>
  .applyManageAddBox {
    padding: 24px;
    background: #fff;
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
    /deep/ .el-input__inner {
      width: 240px;
      height: 36px;
    }
    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .upLoadSstate {
        position: absolute;
        left: 30px;
        top: 100px;
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #006AFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 116px;
      height: 152px;
      line-height: 152px;
      text-align: center;
    }
    .avatar {
      width: 116px;
      height: 152px;
    }
    .avatarTip {
      padding-top: 8px;
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      line-height: 1.8;
    }
    .dbi {
      display: inline-block;
    }
    .avatar-uploader /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 116px;
      height: 152px;
    }
    .avatar-uploader /deep/ .el-upload:hover {
      border-color: #006AFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 116px;
      height: 152px;
      line-height: 152px;
      text-align: center;
      position: absolute;
      top: 0%;
      left: 0%;
    }
    .avatar-uploader /deep/ .el-upload:hover .avatar-uploader-icon {
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 3;
    }
  }

  .remark /deep/ .el-textarea__inner {
    width: 340px !important;
  }

  .upload-img {
    .photo {
      width: 116px;
      height: 152px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
    /deep/ .el-form-item__content {
      display: flex;
    }
  }
  .upload-tips {
    margin-top: 10px;
  }
</style>
