<template>
    <div>
        <layout-one>
            <el-form :model="form" label-width="160px" :inline="true" ref="form" :rules="rules">
                <div class="section">
                    <h4>时间设置</h4>
                    <div class="sectionBox">
                        <el-form-item label="考试批次">
                            <span>{{planCode}}</span>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="场次">
                            <span>{{sectionName}}</span>
                        </el-form-item>
                    </div>
                    <div class="sectionBox">
                        <el-form-item label="考试起止时间" :required="true">
                            <el-form-item prop="beginTime">
                                <el-date-picker
                                    :value-format="dataFormat"
                                    v-model="form.beginTime"
                                    :disabled="true"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            至
                            <el-form-item prop="endTime" class="ml8">
                                <el-date-picker
                                    :value-format="dataFormat"
                                    v-model="form.endTime"
                                    :disabled="true"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                            
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>考点考场设置</h4>
                    <div class="sectionBox">
                        
                        <el-form-item label="">
                            <div>
                                <span>已选<span class="col_blue">{{siteSelectList.length}}</span>个考点</span>
                                <span>共计<span class="col_blue">{{allSeatNumber}}</span>个考位</span>
                            </div>
                            <div class="optionsBox mr30">
                                <div class="top">
                                    <div>考点列表</div>
                                    <!-- <div class="searchCourse ml30">
                                        <el-input  placeholder="快捷搜索" v-model="siteScopeText"></el-input>
                                        <div class="searchPos">
                                            <i class="iconfont icon-sousuo"></i>
                                        </div>   
                                    </div> -->
                                </div>
                                <!-- <el-checkbox class="pl20" :indeterminate="isAllSite" v-model="checkAllSite" @change="handleCheckAllSite">全选</el-checkbox> -->
                                <el-checkbox-group class="p20 pt0" v-model="siteSelectList" @change="handleCheckedSite">
                                    
                                    <el-checkbox disabled v-for="item in siteSelectList" :label="item" :key="item.id">{{`${item.name}(${item.classList.length})`}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="optionsBox">
                                <div class="top">
                                    <div>教室列表</div>
                                    <!-- <div class="searchCourse ml30">
                                        <el-input  placeholder="快捷搜索" v-model="classScopeText"></el-input>
                                        <div class="searchPos">
                                            <i class="iconfont icon-sousuo"></i>
                                        </div>  
                                    </div> -->
                                </div>
                                <!-- <el-checkbox class="pl20" :indeterminate="isAllClass" v-model="checkAllClass" @change="handleCheckAllClass">全选</el-checkbox> -->
                                <el-checkbox-group class="p20 pt0" v-model="classSelectList" @change="handleCheckedClass">
                                    <el-checkbox disabled v-for="item in classSelectList" :label="item" :key="item.id">{{`${item.name}(${item.seatNumber})`}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                <div class="section mt20">
                    <h4>考卷设置</h4>
                    <div class="sectionBox">
                        <!-- <el-form-item label="课程选择">
                            <el-select v-model="curCourseId" placeholder="请选择">
                                <el-option
                                    v-for="item in courseData"
                                    :key="item.courseId"
                                    :label="item.courseName"
                                    :value="item.courseId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="答卷时长" prop="time">
                            <el-input class="short" placeholder="请输入" v-model.number="form.time">
                                <template slot="suffix">分钟</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="ml30">
                            <span class="col_blue cp" @click="addPaperDialog"><i class="el-icon-plus mr5"></i>选择试卷</span>
                        </el-form-item> -->
                        <ots-table-group
                            :tableHeader="tableHeader"
                            :tableData="cpList"
                        ></ots-table-group>
                    </div>
                </div>
            </el-form>
            <ots-custom-dialog :dialog.sync="paperDialog" title="添加试卷" width="60%">
                <template v-slot:content>
                    <ots-refer
                        class="mb16"
                        :selectList="paperOptions"
                        :request-form="paperSelectForm"
                        :showAdvanced="4"
                        @search="getPaper"
                    />
                    <div>
                        <span>已选试卷</span><span class="col_blue ml5">{{paperSelectList.length}}</span>
                    </div>
                    <div>
                        <ots-table-group
                            :tableHeader="paperTableHeader"
                            :tableOption="paperTableOption"
                            :tableData="paperTableData"
                            @handleSelectionChange="paperBatchOper"
                            :pagination="paperPagination"
                            @changeNum="paperChangeSize"
                            @changePage="paperChangePage"
                        ></ots-table-group>
                    </div>
                </template>
                <template v-slot:footer>
                    <el-button round @click="paperDialog=false">取消</el-button>
                    <el-button round type="primary" @click="dealCoursePaper">确定</el-button>
                </template>
            </ots-custom-dialog>
        </layout-one>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getSelectPlace } from '@/http/modules/baseSet/examSite'
import { getPlanCourseFn } from '@/http/modules/baseSet/course'
import { getCurrentPlanFn } from '@/http/modules/examSet/examBatch'
import { getSessionName, addSection, editSection, getPaperFn, getSingleSection } from '@/http/modules/examSet/section'
import { flatten } from '@/help/publicFn'
export default {
    name: 'checkSection',
    data () {
        return {
            isEdit: false,
            saveMethods: 'addOrEdit',
            backMethods: 'goIndex',
            dataFormat: 'yyyy-MM-dd HH:mm:ss',
            planCode: '',
            sectionName: '',
            siteScopeText: '',
            classScopeText: '',
            siteData: [],
            siteSelectList: [],
            classData: [],
            classSelectList: [],
            checkAllSite: false,
            isAllSite: false,
            checkAllClass: false,
            isAllClass: false,
            courseData: [],
            curCourseId: '',
            cpList: [],
            tableHeader: [
                {
                    title: '课程',
                    prop: 'courseName',
                },
                {
                    title: '试卷',
                    prop: 'paperName',
                },
                // {
                //     title: '答卷时长',
                //     prop: 'createTime',
                // },
                // {
                //     title: '操作',
                //     type:"buttons",
                //     width:"60",
                //     btnList:[
                //         {
                //             title: "删除",
                //             click: this.deleteCoursePaper
                //         }
                //     ]
                // },
            ],
            paperOptions: [
                {
                    title : '关键词',
                    type : 'input',
                    placeholder : '试卷名称',
                    requestKey: "searchKey"
                }
            ],
            paperSelectForm: {
                searchKey: ''
            },
            paperListParams: {
                courseIds: '',
                page: 1,
                size: 10
            },
            paperDialog: false,
            paperTableOption: {
                multiple: true
            },
            paperTableData: [],
            paperTableHeader: [
                {
                    title: '试卷名称',
                    prop: 'name',
                },
                {
                    title: '难度',
                    prop: 'difficultyDegree',
                },
                {
                    title: '创建日期',
                    prop: 'createTime',
                },
                {
                    title: '专业',
                    prop: 'courseName',
                },
                {
                    title: '使用次数',
                    prop: 'usedCount',
                },
                {
                    title: '总分',
                    prop: 'score',
                },
                // {
                //     title: '操作',
                //     type:"buttons",
                //     width:"80",
                //     btnList:[
                //         {
                //             title: "查看",
                //             click: this.checkStudent
                //         }
                //     ]
                // },
            ],
            paperSelectList: [],
            paperPagination: {
                total: 0
            },
            form: {
                planId: '',
                name: '',
                beginTime: '',
                endTime: '',
                time: 90,
                classIdList: '',
                coursePaperList: '',
            },
            rules: {
                beginTime: [
                    {required: true, message: '请选择开始时间', trigger: 'change'}
                ],
                endTime: [
                    {required: true, message: '请选择结束时间', trigger: 'change'}
                ],
                time: [
                    { type: 'number', message: '答题时长必须为数字值', trigger: 'blur'}
                ]
            },
        }
    },
    computed: {
        siteSelectData () {
            return this.siteData.filter(item => item.id)
        },
        classSelectData () {
            return this.classData
        },
        allSeatNumber () {
            //function (a, b) { return a.concat(b)}
            return this.classSelectList.reduce((a, b) => { return a + parseInt(b.seatNumber)}, 0)
        }
    },
    watch: {
        siteSelectList: function (val) {
            let temp = val.map(item => item.classList)
            this.classData =  flatten(temp)

            let checkedCount = val.length
            this.checkAllSite = checkedCount === this.siteSelectData.length
            this.isAllSite = checkedCount > 0 && checkedCount < this.siteSelectData.length
        },
        classSelectList: function (val) {
            let checkedCount = val.length
            this.checkAllClass = checkedCount === this.classSelectData.length
            this.isAllClass = checkedCount > 0 && checkedCount < this.classSelectData.length
        }
    },
    created () {
        console.log(1)
        this.initData()
    },
    mounted () {
        this.SAVE_PAGE_THIS(this)
    },
    methods: {
        ...mapMutations(['SAVE_PAGE_THIS']),
        async initData () {
            // 考试批次
            const { data: plan} = await getCurrentPlanFn()
            this.planCode = plan.name
            this.planId = plan.id
            // 根据批次获取课程
            const { data: courseData } = await getPlanCourseFn({planId: plan.id})
            this.courseData = courseData
            
            // 考点数据
            this.getSiteData()

            
        },
        async initPage () {
            if (this.$route.query.id) {
                this.isEdit = true
                let id = this.$route.query.id
                const { data } = await getSingleSection({sessionId : id})
                this.sectionName = data.name
                this.form.beginTime = data.beginTime
                this.form.endTime = data.endTime
                let placeList = data.placeList
                
                // 考点教室
                this.siteSelectList = this.siteSelectData.filter(item => placeList.filter(bb => bb.placeId == item.id).length > 0)
                console.log(this.siteSelectList)
                let temp = this.siteSelectList.map(item => item.classList)
                this.classSelectList =  flatten(temp)

                // 课程试卷
                this.cpList = data.courseList

            } else {
                // 场次名称
                const { data: sectionName} = await getSessionName()
                this.sectionName = sectionName
            }
        },
        async getSiteData () {
            const { data } = await getSelectPlace()
            this.siteData = data
            // 判断编辑
            this.initPage()
        },
        handleCheckedSite (value) {
            let checkedCount = value.length;
            this.checkAllSite = checkedCount === this.siteSelectData.length;
            this.isAllSite = checkedCount > 0 && checkedCount < this.siteSelectData.length;
        },
        handleCheckedClass (value) {
            let checkedCount = value.length;
            this.checkAllClass = checkedCount === this.classSelectData.length;
            this.isAllClass = checkedCount > 0 && checkedCount < this.classSelectData.length;
        },
        handleCheckAllSite (val) {
            let allData = this.siteSelectData
            this.siteSelectList = val ? allData : []
            this.isAllSite = false
        },
        handleCheckAllClass (val) {
            let allData = this.classSelectData
            this.classSelectList = val ? allData : []
            this.isAllClass = false
        },
        addPaperDialog () {
            if (!this.curCourseId) {
                this.$message.error('请先选择课程')
                return false
            }
            this.getPaper()
            this.paperDialog = true
        },
        paperBatchOper (val) {
            let idList=[]
            val.forEach(item=>{
                idList.push(item)
            })
            this.paperSelectList = idList
        },
        paperChangeSize(num) {
            this.paperListParams.size=num
            this.getPaper()
        },
        paperChangePage(p) {
            this.paperListParams.page=p
            this.getPaper()
        },
        async getPaper () {
            this.paperListParams.courseIds = this.curCourseId
            const { data } = await getPaperFn(this.paperListParams)
            console.log(data)
            this.paperTableData = data.papers
        },
        dealCoursePaper () {
            let curCourseObj = this.courseData.filter(item => item.courseId === this.curCourseId)[0]
            console.log(curCourseObj)
            this.cpList = this.cpList.concat(this.paperSelectList.map(item => {
                return  {
                    planCourseId: curCourseObj.planCourseId,
                    courseName: curCourseObj.courseName,
                    paperId: item.id,
                    paperName: item.name
                }
            }))
            this.paperDialog = false
        },
        deleteCoursePaper () {

        },
        addOrEdit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.form.name = this.sectionName
                    this.form.planId = this.planId
                    if (!this.classSelectList.length) {
                        this.$message.error('请选择考点和教室')
                        return false
                    }
                    this.form.classIdList = this.classSelectList.map(item => item.id).join()
                    if (!this.cpList.length) {
                        this.$message.error('请设置课程和考卷')
                        return false
                    }
                    let temp = this.cpList.map(item => {
                        return {
                            planCourseId: item.planCourseId,
                            paperId: item.paperId,
                            paperName: item.paperName
                        }
                    })
                    this.form.coursePaperList = JSON.stringify(temp)
                    let params = this.form
                    if (this.isEdit) {
                        params.sessionId = this.$route.query.id
                    }
                    console.log(this.form)
                    const dealFn = this.isEdit ? editSection : addSection
                    const { code } = await dealFn(params)
                    if (code ==  1) {
                        this.$otsPopPro({
                            content: this.isEdit ? '修改成功' : '添加成功',
                            cancelName: '返回',
                            okName: '查看'
                        }).then(() => {
                        }).catch(() => {
                            this.goIndex()
                        })
                    }
                } else {
                    return false
                }
            })
        },
        goIndex () {
            this.$router.push({
                name: 'section'
            })
        }
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
}
.optionsBox {
    display: inline-block;
    background-color: #F8F9FC;
    width: 400px;
    height: 600px;
    // background-color: #ccc;
    overflow-y: auto;
    vertical-align: top;
    .top {
        display: flex;
        padding: 20px;
        border-bottom: 1px solid #F1F2F5;
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
    /deep/ .el-checkbox{
        display: block;
    }
}
.short {
    width: 120px;
}
</style>