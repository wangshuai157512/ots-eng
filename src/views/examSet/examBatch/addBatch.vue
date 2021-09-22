<template>
  <div>
      <layout-one>
          <el-form :model="form" label-width="160px" :inline="true" ref="form" :rules="rules">
                <div class="section">
                    <h4>基本信息</h4>
                    <div class="sectionBox">
                        <el-form-item label="考试批次">
                            <span>{{planCode}}</span>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="考试批次名称" prop="name">
                            <el-input placeholder="请输入" v-model="form.name"></el-input>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="报名人工审核" :required="true">
                            <el-switch
                                v-model="form.form_needAudit">
                            </el-switch>
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>时间设置</h4>
                    <div class="sectionBox">
                        <el-form-item label="报名起止时间" prop="beginSign">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.beginSign"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            至
                        </el-form-item>
                        <el-form-item label="" prop="endSign">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.endSign"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="审核截止时间" prop="endAudit">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.endAudit"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="缴费截止时间" prop="endPay">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.endPay"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="准考证打印开始时间" prop="beginEntrance">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.beginEntrance"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="考试起止时间" prop="beginExam">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.beginExam"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            至
                        </el-form-item>
                        <el-form-item label="" prop="endExam">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.endExam"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="成绩查询开始时间">
                            <el-date-picker
                                :value-format="dataFormat"
                                v-model="form.beginScoreCheck"
                                type="datetime"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>费用设置</h4>
                    <div class="sectionBox">
                        <el-form-item label="收费标准" prop="money">
                            <el-input class="short" placeholder="请输入" v-model="form.money">
                                <template slot="suffix">元/科</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>课程设置</h4>
                    <div class="sectionBox">
                        <el-form-item label="考试科目选择">
                            <div class="stationBox">
                                <div class="stationTop">
                                    <div class="searchCourse ml30">
                                        <el-input  placeholder="快捷搜索" v-model="courseStr"></el-input>
                                        <div class="searchPos">
                                            <i class="iconfont icon-sousuo"></i>
                                        </div>   
                                    </div>
                                </div>
                                <el-checkbox-group v-model="form.form_courseIdList" @change="handleCheckedChange">
                                <el-checkbox  v-for="course in courseSelectData" :label="course.id" :key="course.id" :title="course.name">{{course.name}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>其它设置</h4>
                    <div class="sectionBox">
                        <el-form-item label="验证IP范围">
                            <el-switch
                                v-model="form.form_needIpCheck">
                            </el-switch>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="报名须知" prop="signRemark">
                            <vue-ueditor-wrap class="editor" v-model="form.signRemark" :config="editorConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="考生须知" prop="examRemark">
                            <vue-ueditor-wrap class="editor" v-model="form.examRemark" :config="editorConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>
                </div>
          </el-form>
      </layout-one>
  </div>
</template>
<script>
const EditorConfig = {
    // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 200,
        // 初始容器宽度
        initialFrameWidth: '90%',
        // 元素路径
        elementPathEnabled : false,
        // 启用自动保存
        enableAutoSave: false,
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        // serverUrl: '/api/resources/ots/student/ueditorjsp/jsp/controller.jsp?name=cate',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: './UEditor/',
        // 编辑器图标设置
        // toolbars: [
        //     [
        //         "source",
        //         "|",
        //         "bold",
        //         "italic",
        //         "underline",
        //         "|",
        //         'simpleupload',
        //         'insertimage',
        //         "|"
        //     ]
        // ],
        toolbars: [
            [
            'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', '|', 
          'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 
          // 'removeformat', 'formatmatch','blockquote', ,  '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter' 
            ]
        ]
}
import { mapMutations } from 'vuex'
import { getSelectCourse } from '@/http/modules/baseSet/course'
import { addPlanFn, editPlanFn, getPlanCodeFn, getSinglePlan } from '@/http/modules/examSet/examBatch'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
    name: 'addBatch',
    components: { VueUeditorWrap },
    data () {
        return {
            isEdit: false,
            saveMethods: 'addOrEdit',
            backMethods: 'goIndex',
            planCode: '',
            dataFormat: 'yyyy-MM-dd HH:mm:ss',
            courseStr: '',
            aaa: '',
            form: {
                name: '',
                form_needAudit: true,
                form_needIpCheck: false,
                money: '',
                beginSign: '',
                endSign: '',
                endAudit: '',
                endPay: '',
                beginEntrance: '',
                beginExam: '',
                endExam: '',
                beginScoreCheck: '',
                signRemark: '',
                examRemark: '',
                form_courseIdList: []
            },
            rules: {
                name: [
                    {required: true, message: '请填写考试批次名称', trigger: 'blur'},
                    { min: 1, max: 50, message: '最多可输入50个字', trigger: 'blur' }
                ],
                money: [
                    {required: true, message: '收费项必填', trigger: 'blur'},

                ],
                beginSign: [
                    {required: true, message: '请选择报名起止时间', trigger: 'change'}
                ],
                endSign: [
                    {required: true, message: '请选择报名截止时间', trigger: 'change'}
                ],
                endAudit: [
                    {required: true, message: '请选择审核截止时间', trigger: 'change'}
                ],
                endPay: [
                    {required: true, message: '请选择缴费截止时间', trigger: 'change'}
                ],
                beginEntrance: [
                    {required: true, message: '请选择准考证打印时间', trigger: 'change'}
                ],
                beginExam: [
                    {required: true, message: '请选择考试开始时间', trigger: 'change'}
                ],
                endExam: [
                    {required: true, message: '请选择考试结束时间', trigger: 'change'}
                ],
                signRemark: [
                    {required: true, message: '请填写报名须知', trigger: 'blur'}
                ],
                examRemark: [
                    {required: true, message: '请填写考试须知', trigger: 'blur'}
                ]

            },
            courseData: [],
            editorConfig: {}
        }
    },
    computed: {
        courseSelectData () {
            if (this.courseStr) {
                return this.courseData.filter(item => item.name.indexOf(this.courseStr) > -1)
            }
            return this.courseData
        }
    },
    created () {
        this.initStatus()
        this.editorConfig = EditorConfig
        
        this.initCourseData()
    },
    mounted () {
        this.SAVE_PAGE_THIS(this)
    },
    methods: {
        ...mapMutations(['SAVE_PAGE_THIS']),
        async initStatus () {
            if (this.$route.query.id) {
                this.isEdit = true
                let id = this.$route.query.id
                const { data } = await getSinglePlan({planId: id})
                console.log(data)
                for (let item in this.form) {
                    this.form[item] = data[item] ? data[item] : this.form[item]
                }
                this.form.planId = data.planId
                this.form.form_needAudit = data.needAudit == 1 ? true : false 
                this.form.form_needIpCheck = data.needIpCheck == 1 ? true : false
                this.form.form_courseIdList = data.courseList.map(item => item.id)

                this.planCode = data.planCode
            } else {
                this.initPlanCode()
            }
        },
        async initPlanCode () {
            const { data } = await getPlanCodeFn()
            this.planCode = data
        },
        async initCourseData () {
            const { data } = await getSelectCourse()
            this.courseData = data
        },
        handleCheckedChange (value) {
            console.log(value)
        },
        async addOrEdit () {
      
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let params = {...this.form}
                    if (!params.form_courseIdList.length) {
                        this.$message.warning('请选择课程')
                        return false
                    }
                    let money = parseFloat(params.money)
                    if (isNaN(money) || money < 0 ) {
                        this.$message.error('请设置有效的收费金额')
                        return false
                    }
                    params.money = money
                    params.courseIdList = params.form_courseIdList.join()
                    params.needAudit = params.form_needAudit ? 1 : 0
                    params.needIpCheck = params.form_needIpCheck ? 1 : 0
                    for (let key in params) {
                        if (key.startsWith('form_')) {
                            delete params[key]
                        }
                    }
                    const dealFn = this.isEdit ? editPlanFn : addPlanFn
                    const { code } = await dealFn(params)
                    if (code ==  1) {
                        this.$otsPopPro({
                            content: this.isEdit ? '修改成功' : '添加成功',
                            isNeedCancel: false,
                            okName: '确定'
                        }).then(() => {
                            // this.$router.push({
                            //     name: 'checkBatch',
                            //     query: {
                            //         id: params.planId
                            //     }
                            // })
                            this.goIndex()
                        }).catch(() => {
                            
                        })
                    }
                } else {
                    return false
                }
            })
        },
        goIndex () {
            this.$router.push({
                name: 'examBatch'
            })
        },
    }
}
</script>
<style lang="less" scoped>
.section {
  border-bottom: 1px solid #F1F2F5;
  h4{
    margin-bottom: 30px;
  }
  .sectionBox {
      .lang {
        width: 512px;
      }
  }
  .stationBox {
      width: 1000px;
      max-height: 300px;
      background-color: #F8F9FC;
      overflow-y: auto;
      padding: 20px;
      .stationTop {
        display: flex;
        margin-bottom: 20px;
      }
      .searchCourse {
          position: relative;
          /deep/ .el-input{
              width: 240px;
              .el-input__inner {
                  height: 32px!important;
                  line-height: 32px!important;
                  border-radius: 40px!important;
              }
          }
          .searchPos {
              width: 40px;
              height: 18px;
              line-height: 18px;
              border-left: 1px solid #E1E6ED;
              position: absolute;
              right: 0;
              top: 11px;
              color: #C2C6CC;
              font-size: 14px;
              i {
                  margin-left: 10px;
                  cursor: pointer;
              }
          }
      }
  }
  .editor {
      width: 1000px;
  }
  /deep/ .el-form-item {
      margin-bottom: 30px!important;
  }
  /deep/ .el-radio-button__inner {
      margin-right: 16px;
      color: #45494D!important;
      background: #F4F5F8!important;
      font-size: 13px;
      border-radius: 4px!important;
      border: 1px solid #DADDE6!important;
      width: 64px;
      height: 32px;
      line-height: 32px;
      padding: 0;
  }
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background: #EBF5FF!important;
      border: 1px solid #006AFF!important;
      color: #006AFF!important;
      box-shadow:none;
  }
  /deep/ .el-checkbox {
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>