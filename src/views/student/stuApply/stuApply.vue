<template>
    <div class="stuApply">

        <div > 
            <nav class="ots_header">{{titleName}}</nav>
             <el-form inline ref="ruleForm" :model="ruleForm" :rules="rules">
                  <p class="border"></p>
                 <div class="header_nav">
                     
                      <p class="title">基础信息</p>
                    <ul :ruleForm='ruleForm'>
                        <li><em>姓名：</em>{{ruleForm.realName }}</li>
                        <li><em>性别：</em>
                             <el-select v-model="ruleForm.sex" placeholder="请选择">
                                <el-option label="男" :value="1" ></el-option>
                                 <el-option label="女" :value="0" ></el-option>
                            </el-select>
                        </li>
                        <li><em>手机号：</em>{{ruleForm.phone }}</li>
                        <li><em>出生日期：</em>
                       
                            <el-date-picker
                                v-model="ruleForm.bitrhday"
                                type="date"
                                value-format="yyyy-MM-dd" 
                                placeholder="选择日期">
                            </el-date-picker>
                        </li>
                        <li><em>证件类型:</em>{{getCardType}}</li>
                        <li><em>证件号：</em>{{ruleForm.cardNo}}</li>
                    </ul>               
                    <p class="bordertitle"></p>
                    <el-form-item class="input_add">
                        <el-form-item label="政治面貌：" prop = "politics">
                            <el-select v-model="ruleForm.politics" placeholder="请选择">
                                <el-option :label="item.name" :value="item.id" v-for="item in politicsList" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" prop = "nation">
                            <el-select v-model="ruleForm.nation" placeholder="请选择">
                            <el-option :label="item.name" :value="item.id" v-for="item in nation" :key='item.id'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form-item> 
                    <el-form-item class="center_img">
                        <!-- <el-form-item label="照片：" prop="photo"> -->
                        <div class="img_style">
                            <img v-if="!url" :src="getAvatarUrl" class="avatar">
                            <img v-else :src="url" class="avatar">
                        </div>
                        <div class="avatarTip" :formData="formData">
                             <el-upload
                                action=""
                                class="avatar-uploader dbi"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :http-request="uploadImg">
                            <el-button type="primary"  :disabled="confirmDisabled" round>点击上传</el-button>
                        </el-upload>
                            <p class="mb10"></p>
                            <p class="col_grayQs">系统会对上传照片进行人脸核验，<span class="textcolor">{{basicsMaptext}}次</span>不通过将会影响您的此次报考，请严格按照以下要求上传照片：</p>
                            <p class="col_grayQ"> 1.必须是报考本人真实免冠蓝底照片，不许带眼镜，照片应清晰可识别身份，过于模糊的照片无法上报成功</p>
                            <p class="col_grayQ"> 2.照片必须是标准JPG格式，文件最大不超过40kb；照片宽度不超过480像素，高度应不超过640像素，宽高比例为3:4。</p>
                            <p class="col_grayQ" v-if="upNums!=='' && result!==''">
                                <span v-if="upNums >=1" class="text" style="color:red">人证核验不通过,请重新上传照片，您还剩{{upNums}}次核验机会。</span>
                                <span v-else class="text" style="color:red">人证核验不通过，您的人证核验机会已用尽，可联系院校老师进行处理，请继续填写其它报名信息。</span>
                            </p>
                        </div>
                        <!-- </el-form-item> -->
                    </el-form-item>
                      <p class="border"></p>
                        <p class="title">院校信息</p>
                        <el-form-item class="input_add">
                            <el-form-item label="就读院校：" prop = 'schoolId'>
                                <el-select v-model="ruleForm.schoolId" placeholder="请选择">
                                <el-option :label="item.name" :value="item.id" v-for="item in schoolList" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="专业：" prop = 'subjectId'>
                                <el-select v-model="ruleForm.subjectId" placeholder="请输入">
                                <el-option :label="item.name"  :value="item.id" v-for="item in subjectId" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="层次：" prop = 'level'>
                                <el-select v-model="ruleForm.level" placeholder="请选择">
                                <el-option :label="item.name"  :value="item.id" v-for="item in level" :key="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学号：" prop = 'studyNo'>
                                <el-input v-model="ruleForm.studyNo" placeholder="请输入"></el-input>
                            </el-form-item>
                                <el-form-item label="省份：" prop = 'province'>
                                <el-select  v-model="ruleForm.province" placeholder="请选择">
                                 <el-option
                                    v-for="item in provinceData"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>  
                                </el-select>
                            </el-form-item>
                            <el-form-item label="函授站：" prop = 'stationId'>
                                <el-select v-model="ruleForm.stationId" placeholder="请选择">
                                <el-option :label="item.name" :value="item.id" v-for="item in stationIdList" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学习形式：" prop = 'studyType'>
                                <el-select v-model="ruleForm.studyType" placeholder="请选择">
                                <el-option :label="item.name" :value="item.id" v-for="item in studyType" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="入学时间：" prop = 'enterTime' class ="demonstration" >    
                                <el-date-picker
                                    v-model="ruleForm.enterTime"
                                    type="date"
                                      value-format="yyyy-MM-dd" 
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item> 
                             <el-form-item label="毕业时间：" prop = 'educateTime' class ="demonstration" >       
                                <el-date-picker
                                    v-model="ruleForm.educateTime"
                                    type="date"
                                    value-format="yyyy-MM-dd" 
                                    placeholder="选择日期">
                                </el-date-picker>
                             </el-form-item>    
                        </el-form-item> 
                       <p class="border"></p>
                        <p class="title">报考信息</p>
                        <el-form-item class="ots_footer">
                            <el-form-item  prop = 'courseId'>
                                <span>报考课程：</span>
                                <el-checkbox-group v-model="ruleForm.courseId"  v-if="courseList.length == 1">
                                    <el-checkbox :label="item.courseId" v-for="item in courseList" :key="item.courseId" checked="checked">{{item.courseName}}</el-checkbox>
                                </el-checkbox-group>
                                  <el-checkbox-group v-model="ruleForm.courseId"  v-else>
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
                          <p class="border"></p>
                       <el-form-item class="agreement">
                             <el-checkbox v-model="checkeds">本人已确认提交报名信息真实无误且符合报名考试资格，后期因提交报名信息不真实、有误、不符合报名考试资格，导致的一切后果自行承担。</el-checkbox>
                       </el-form-item>
                    </div>  
                    <stu-foot cancelText= "取消" @cancel = "cancel" :confirmDisabled="confirmDisabled" confirmtext="提交报名信息" @confirm="UpdateRegistration('ruleForm')" ></stu-foot>
                    <!-- <stu-foot cancelText= "取消" @cancel = "cancel" v-else confirmtext="提交报名信息" ></stu-foot> -->
             </el-form>
        </div>
        <el-dialog
            title="报名须知"
            :visible.sync="centerDialogVisible"
            append-to-body
            width="960px"
            height="600px"
           :show-close='false'
           :close-on-click-modal='false'
           :close-on-press-escape='false'
            center>
             <p v-html="signRemark"></p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false" :disabled='isCountDownFinsh'>本人已认真阅读，同意报考 {{countDown}}</el-button>
            </span>
         </el-dialog>
    </div>
</template>

<script>
import{getQueryAllSchool} from '@/http/modules/school'
import { getQueryAllStation } from '@/http/modules/station'
import nation from './nation' 
var cityList = require('@/views/baseSet/examSite/citys.json')
import stuFoot from '@/views/student/components/stuFoot'
export default {
    name:'stuApply',
    components: {
            stuFoot,
        },
    data() {
        return {
             centerDialogVisible: true,
             countDown :0,
             nation : nation,
             ruleForm: {
                bitrhday:'',
                cardNo:'',
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
                userName:'',
                courseId : []
          },
        formData:{
            maxNum:''
        },
        titleName:'',
        provinceData: cityList,
        stationId:[],
        schoolList:[],
        subjectId:[],
        stationIdList:[],
        courseList:[],
        courseId :[],
        checkeds:'',
        signRemark:'',
        checkedall:'',
        cardNo:'',
        info:{},
        upNums:'',
        upNum:'',
        result:'',
        photo:'',
        type:'',
        url:'',
        flag:'',
        basicsMaptext:'',
        politicsList:[
                {
                    id:'中共党员',
                    name:"中共党员"
                },
                {
                    id:'中共预备党员',
                    name:"中共预备党员"
                },
                {
                    id:'共青团员',
                    name:"共青团员"
                },
                {
                    id:'民革会员',
                    name:"民革会员"
                },
                 {
                    id:'民盟盟员',
                    name:"民盟盟员"
                },
                 {
                    id:'民进会员',
                    name:"民进会员"
                },
                 {
                    id:'农工党党员',
                    name:"农工党党员"
                },
                 {
                    id:'致公党党员',
                    name:"致公党党员"
                },
                 {
                    id:'无党派人士',
                    name:"无党派人士"
                },

                 {
                    id:'群众',
                    name:"群众"
                },
            ],
        level:[
            {
                id:'高起本',
                name:'高起本'
            },
             {
                id:'专升本',
                name:'专升本'
            }
        ],
        
        studyType:[
            {
                id :'函授',
                name :'函授'
            },{
                id:'业余',
                 name :'业余'
            },
            {
                id:'自考',
                 name :'自考'
            }
        ],
            rules: {
               
                politics: [
                    { required: true, message: '请选择政治面貌', trigger: 'blur' }
                ],
                nation: [
                    { required: true, message: '请选择民族', trigger: 'blur' }
                ],
                schoolId: [
                    { required: true, message: '请选择就读院校', trigger: 'blur' }
                ],
                subjectId: [
                    { required: true, message: '请输入专业', trigger: 'blur' }
                ],
                level: [
                    { required: true, message: '请选择层次', trigger: 'blur' },
                ],
                studyNo: [
                    { required: true, message: '请输入学号', trigger: 'blur' },
                ],
                 enterTime: [
                    { required: true, message: '请选择入学时间', trigger: 'blur' },
                ],
                educateTime: [
                    { required: true, message: '请选择毕业时间', trigger: 'blur' },
                ],
                 province: [
                    { required: true, message: '请选择省份', trigger: 'blur' },
                ],
                stationId: [
                    { required: true, message: '请选择函授站', trigger: 'blur' },
                ],
                studyType: [
                    { required: true, message: '请选择学习形式', trigger: 'blur' },
                ],
                courseId: [
                    {  type: 'array', required: true, message: '请选择课程', trigger: 'change' },
                 ],
                 
            },
        }
        
    },
    computed : {
        confirmDisabled(){
            let{flag} = this
            if (flag === 0) {
                return false
            } else if (flag === 3) {
                return false
            } else if (flag === null) {
                return false
            }
            return true           
        },
        getCardType () {
            const cardType = ['身份证','港澳台身份证','士官证','护照']
            return cardType[this.ruleForm.cardType -1]
        },
        isCountDownFinsh () {
            return this.countDown > 1
        },
        getTimeText () {
            let { countDown } = this
            return  countDown > 0 ? `(${countDown}s)` : ''
           
        },
         getAvatarUrl () {
          
        return require('../../../assets/img/auto-photo.jpg')
      },
    },
    mounted () {
        this.getInfo()
         this.$api.applyManage.getCurrentPlan().then(res=> {
            this.planId = res.data.id
            this.titleName = res.data.name
            this.signRemark = res.data.signRemark 
            this.getCourse()
         })
        
        this.submitParams = ['planId']
          this.$api.applyManage.queryAllSubject().then(res=> {
           this.subjectId = res.data
        })
        getQueryAllSchool({state:1}).then(res=>{
            if(res.code){
                this.schoolList = res.data
            }
        })
         getQueryAllStation({state:1}).then(res=> {
            this.stationIdList = res.data
        }), 
        this.initCountDown()
        this.getConfigData()
        this.selectOneSignUp()
    },
    methods:{
         getInfo () {
            this.$api.stuApply.selectByOne().then(res => {
            if (res.code === 1) {
                this.info = res.data
            }
            })
          },
        selectOneSignUp () {
            let planId = this.planId
             let loc = JSON.parse(localStorage.getItem('userInfo'))
            let params = {
                stuIds :loc.id,
                planId: planId
               
            }
            this.$api.applyManage.selectOneSignUp(params).then(res=> {
                this.ruleForm = res.data
                this.url  = res.data.photo
                let {
                    bitrhday,
                    cardNo,
                    cardType,
                    educateTime,
                    enterTime,
                    id,
                    level,
                    nation,
                    phone,
                    realName ,
                    politics,
                    province,
                    remark,
                    school,
                    sex,
                    station,   
                    studyNo ,
                    studyType,
                    subject,
                    userName,
                    course,
                    flag
                } = res.data
                this.ruleForm = {
                    bitrhday,
                    cardNo,
                    cardType,
                    educateTime,
                    enterTime,
                    id,
                    level,
                    nation,
                    phone,
                    realName ,
                    politics,
                    province,
                    remark,
                    schoolId : school ? school.id : '',
                    sex,
                    stationId :station? station.id :'',   
                    studyNo ,
                    studyType,
                    subjectId :subject? subject.id :'',
                    userName,
                    courseId : course || [],
                    planId : this.planId,
            }
            console.log(flag)
            this.flag = flag
            })
        },
         getCourse() {
            this.$api.applyManage.getPlanCourse({planId:this.planId}).then(res=>{
                if(res.code && res.data.length>0) {
                    this.courseList = res.data
                }
            })
        },
           getConfigData(){
            this.$api.system.getConfigData().then(res=> {
                let configList = res.data.configList
                let basicsMap = {}
                configList.forEach(item => {
                    basicsMap[item.setName] = item.setValue
                })
                this.basicsMap =  basicsMap.uploadTimes
                this.basicsMaptext = this.basicsMap
               
               
            })
        },
        upLoadSstate(fileData){//上传
            let loc = JSON.parse(localStorage.getItem('userInfo'))
            let formData = new FormData()
            formData.append('cardNo',this.ruleForm.cardNo)
            formData.append('file',fileData)
            formData.append('stuId',loc.id)
            formData.append('stuName',loc.realName)
            formData.append('type',this.ruleForm.cardType)
            this.$api.applyManage.savePhoto(formData).then(res=>{ 
                let upNum = ''
                let maxNum = ''
                let url = ''
                let upNums = '';
                let result = ''
                if(res.error !== null){
                    upNum = res.error.upNum;
                    maxNum = res.error.maxNum;
                    url = res.error.url;
                    result = res.error.result
                }  else{
                    upNum = res.data.upNum;
                    maxNum = res.data.maxNum;
                  
                    url = res.data.url
                }
               if(url){
                 this.url = url
               }else{
                   this.url = res.error.url
               }
               this.upNum = upNum
               this.upNums = maxNum - upNum
               this.result = result
            })
        },
        cancel(){
             this.$router.push({
                path : '/stuHome/home'
            })
        },
        initCountDown () {
            if (this.countDown <= 0) {
                clearTimeout(this.timer)
                return
            }
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.countDown = this.countDown - 1
            this.timer = setTimeout(this.initCountDown,1000)
        },
        beforeAvatarUpload(fileData) {
            const isJPG = fileData.type === 'image/jpeg';
            const isLt30kb = fileData.size / 1024 < 40;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt30kb) {
                this.$message.error('上传头像图片大小不能超过 40kb!');
            }
            return isJPG && isLt30kb;
          
        },
       
         uploadImg(data) {
            let that = this
            let fileData = data.file
            this.upLoadSstate(fileData)
        },
       
        open() {
            this.$alert('', '系统提示', {
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
      UpdateRegistration(ruleForm){
          this.$refs[ruleForm].validate((valid) => {
              if (valid) {
                if(!this.checkeds) {
                this.$message({
                    message: '请勾选报名承诺信息',
                    type: 'error'
                            });
                        return
                 }
                    let params = {
                        ...this.ruleForm,
                        courseId : this.ruleForm.courseId.toString(),
                        planId : this.planId
                    }
                    this.$api.applyManage.UpdateRegistration(params).then(res=>{
                    if (res.code === 1) {
                        this.$router.push({
                            path : '/stuHome/stuExamine'
                        })
                    }
                }) 
          } else {

          }
        });
          
      }
      

    }
}
</script>

<style lang="less" scoped>
   
    /deep/ .el-input input {
                    width: 240px;
                    height: 36px !important;
                    line-height: 36px;
                    box-sizing: border-box;

                }
    /deep/ .el-form-item__content{
           line-height: 36px;
           margin-bottom: 30px !important;
    }
    /deep/ .el-form-item__label{
        width: 95px;
        text-align: right;
    }
    .stuApply {
        background: #fff;
        width: 1420px;
        height: 100%;
        border-radius: 8px;
        .ots_header {
            width: 100%;
            height: 76px;
            margin-left: 48px;
            font-size: 20px;
            font-weight: 600;
            color: #2D2F33;
            line-height: 76px;
            font-family: PingFangSC-Semibold, PingFang SC;
        }
        .title{  width: 100%;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #2D2F33;
            line-height: 22px;
            margin-top: 32px;
        }
        .header_nav{
            padding: 0 80px;
        }
        ul{
            width: 1420px;
            margin-left:20px ;
           li{
              margin-top: 32px;
              display:inline-block;
              font-size: 14px;
              width: 30%;
                em {
                    color: #9299A6; 
                    display: inline-block;
                    vertical-align: middle;
                    width: 82px;
                    text-align: right;
                    font-style: normal;
                    margin-right: 6px;
                    }
           }
          
        }
        .input_add{
            width: 1420px;
            margin-top: 32px;
            margin-left:20px ;
           .el-form-item{
               width: 336px;
               margin-right: 88px;
               display: inline-block;
           }
        } 
      
    }
       .avatar-uploader /deep/ .avatar-uploader {
            width: 200px;
            height: 152px;
        }
      .avatar-uploader /deep/ .el-upload {
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
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
        .center_img /deep/ .el-form-item__content{
            display: flex;
            line-height: 24px;
            padding-left: 16px;
            float:right;
        }
         .center_img /deep/ .avatarTip{
             padding-left:16px;
         }
         .input_add /deep/ .el-form-item{
             width: 82px;
             text-align: right;
         }
        //  .demonstration1{
            
        //      padding-right: 10px;
        //  }
         .demonstration{
             margin-left: -22px;
             padding-right: 25px;
         }
         .ots_footer{
             margin:32px 0 0 20px ;
             height: 160px;
             span{
                 display: inline-block;
                 width: 80px;
             }
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
          .ots_textarea /deep/ .el-textarea{
              width: 1064px;
              height: 100px;
              padding-left:4px ;
          }
        .agreement{
            width: 100%;
            text-align: center;
             /deep/ .el-checkbox__label{
                color: #F27900;
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
       .border{
                width:  100%;
                height: 1px;
                background: #F1F2F5;
                margin: 10px auto;
              }    
        .bordertitle{
            width:  100%;
            height: 1px;
            background: #F1F2F5;
            margin-top: 30px;
        }      
       /deep/ .el-checkbox-group{
           float:right;
       }   
       .textcolor{
           color:#F27900
       } 
       img{
           width:140px;
           height: 183px;
       }   
       .col_grayQs{
           width: 667px;
            height: 24px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #45494D;
            line-height: 24px;
       }
        .el-dialog__footer{
            width: 100%;
            height: 68px;
            text-align: center;
            box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.06);
            .el-button.el-button--primary{
                height: 36px;
                margin-top: 16px;
                border-radius: 20px;
            }  
        } 
        .img_style{
            width: 140px; 
            height: 183px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .buttonClick{
           background-color: #2D2F33;
        }
        .el-button--primary.is-disabled:hover{
           background-color:#ccc;
        }
</style>