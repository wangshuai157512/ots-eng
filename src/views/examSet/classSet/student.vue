<template>
    <div>
        <ots-main-title :mainTopBtn="mainTopBtnList" />
        <div class="topTip">
            <span class="f18 col_black mr20">{{`${planInfo.code}批次${planInfo.name}`}}</span>
            <span>{{`考试时间：${planInfo.beginTime}至${planInfo.endTime}`}}</span>
        </div>
        <ots-refer
            class="mb20"
            :selectList="selectList"
            :request-form="stuSelectParams"
            @search="getStuList"
        />
        <div class="mainCon">
            <ots-table-group
                :tableHeader="tableHeader"
                :tableData="tableData"
                @handleSelectionChange="bachOper"
                :pagination="pagination"
                @changeNum="changeSize"
                @changePage="changePage"
            ></ots-table-group>
        </div>
        <!-- 导出 -->
        <ots-custom-dialog :dialog.sync="exportDialog" title="导出设置" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="exportForm">
                        <el-form-item label="请选择数据范围">
                            <el-radio-group v-model="exportForm.exportType">
                                <el-radio-button label=1>全部数据</el-radio-button>
                                <el-radio-button label=2>查询结果数据</el-radio-button>
                                <el-radio-button label=3>选中数据</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round @click="exportDialog=false">取消</el-button>
                    <el-button round type="primary" @click="rightExport">确定</el-button>
            </template>
        </ots-custom-dialog>
        <!-- 查看考生 -->
        <ots-custom-dialog :dialog.sync="checkDialog" title="查看考生" width="50%">
            <template v-slot:content>
                <div>
                    <el-form label-width="160px" :inline="true">
                        <div class="sectionBox">
                            <el-form-item label="场次">
                                <span>{{studentInfo.sessionName}}</span>
                            </el-form-item>
                            <el-form-item label="教室">
                                <span>{{studentInfo.className}}</span>
                            </el-form-item>
                        </div>
                        <div class="sectionBox">
                            <el-form-item label="座位号">
                                <span>{{studentInfo.seatNo}}</span>
                            </el-form-item>
                            <el-form-item label="准考证号">
                                <span>{{studentInfo.entranceCode}}</span>
                            </el-form-item>
                        </div>
                        <div class="sectionBox">
                            <el-form-item label="姓名">
                                <span>{{studentInfo.realName}}</span>
                            </el-form-item>
                            <el-form-item label="学号">
                                <span>{{studentInfo.studyNo}}</span>
                            </el-form-item>
                        </div>
                        <div class="sectionBox">
                            <el-form-item label="身份证号码">
                                <span>{{studentInfo.cardNo}}</span>
                            </el-form-item>
                            <el-form-item label="考试批次">
                                <span>{{studentInfo.planName}}</span>
                            </el-form-item>
                        </div>
                        <div class="sectionBox">
                            <el-form-item label="课程">
                                <span>{{studentInfo.courseName}}</span>
                            </el-form-item>
                            <el-form-item label="考试时间">
                                <span>{{`${studentInfo.beginTime} 至 ${studentInfo.endTime}`}}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round type="primary" @click="checkDialog= false">关闭</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>
<script>
import { getClassStudentListFn, exportStudentFn, getStudentViewInfoFn } from '@/http/modules/examSet/planClass'
import { getPlanSite } from '@/http/modules/examSet/section'
export default {
    name: 'student',
    data () {
        return {
            exportDialog: false,
            checkDialog: false,
            planInfo: {},
            studentInfo: {},
            mainTopBtnList: [
                {
                    title: '导出',
                    fn: this.exportStudent
                }
            ],
            selectList: [
                {
                    title: "考点",
                    type: "select",
                    requestKey: "placeId",
                    label: 'name',
                    value: 'id',
                    data: [],
                },
                {
                    title: "教室",
                    type: "select",
                    requestKey: "classId",
                    label: 'name',
                    value: 'id',
                    data: [],
                },
                {
                    title: "关键词",
                    type: "input",
                    placeholder : '姓名/准考证/证件号',
                    requestKey: "searchKey",
                },
            ],
            stuSelectParams: {
                placeId: '',
                classId: '',
                searchKey: ''
            },
            tableHeader: [
                {
                    title: "姓名",
                    prop: "realName"
                },
                {
                    title:"准考证号",
                    prop: "entranceCode"
                },
                {
                    title:"证件号",
                    prop: "cardNo",
                },
                {
                    title:"考点",
                    prop: "placeName"
                },
                {
                    title:"教室",
                    prop: "className"
                },
                {
                    title:"座位号",
                    prop: "seatNo"
                },
                {
                    title:"考试课程",
                    prop: "courseName"
                },
                {
                    title:"操作",
                    type:"buttons",
                    width:"80",
                    btnList:[
                        {
                            title: "查看详情",
                            click: this.checkStudent
                        }
                    ]
                }
            ],
            tableData: [],
            tableOption: {
                multiple: true
            },
            pagination: {
                total: 0
            },
            stuListParams: {
                planId: '',
                sessionId: '',
                page: 1,
                size: 10
            },
            exportForm: {
                exportType: 1, //1 全部 2 查询结果数据 3选中数据
            },
            selectIds: []
        }
    },
    watch: {
        'stuSelectParams.placeId': function (val) {
            this.stuSelectParams.classId = ''
            this.selectList[1].data = this.selectList[0].data.filter(item => item.id == val)[0].placeClassList
        }
    },
    created () {
        this.initData()
    },
    methods: {
        bachOper (val) {
            let idList=[]
            val.forEach(item=>{
                idList.push(item.studentCourseId)
            })
            this.selectIds = idList
        },
        async initData () {
            let planInfo = JSON.parse(window.localStorage.getItem('checkPlan'))
            this.planInfo = planInfo
            this.stuListParams.planId = planInfo.planId
            
            const { data } = await getPlanSite({planId: planInfo.planId})
            this.selectList[0].data = data

            // 场次ID
            this.stuListParams.sessionId = this.$route.query.sessionId
            // 
            this.getStuList()
        },
        changeSize(num) {
            this.stuListParams.size=num
            this.getStuList()
        },
        changePage(p) {
            this.stuListParams.page=p
            this.getStuList(true)
        },
        async getStuList (page) {
            let params
            if (!page) {
                this.stuListParams.page = 1
                params = Object.assign(this.stuListParams, this.stuSelectParams)
            } else {
                params = Object.assign(this.stuTempParams, {page: this.stuListParams.page})
            }
            
            const { data } = await getClassStudentListFn(params)
            this.stuTempParams = params
            this.tableData = data.records
            this.pagination.total = data.total
        },
        exportStudent () {
            this.exportDialog = true
        },
        async rightExport () {
            let params = this.exportForm
            params.planId = this.planInfo.planId
            if (params.exportType == 1) {
                
            } else if (params.exportType == 2) {
                params = Object.assign(params, this.stuSelectParams)
            } else if (params.exportType == 3) {
                if (!this.selectIds.length){
                    this.$message.error('请选择要导出的学生')
                    return false
                }
                params.studentCourseIds = this.selectIds.join()
            }
            const { code, data } = await exportStudentFn(params)
            if (code == 1) {
                window.open(data)
                this.exportDialog = false
            }
        },
        async checkStudent (row) {
            console.log(row)
            const { data } = await getStudentViewInfoFn({ studentCourseId: row.studentCourseId })
            this.studentInfo = data
            this.checkDialog = true

        }
    }
}
</script>
<style lang="less" scoped>
.topTip {
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #EBF0FA;
    padding: 20px;
    box-sizing: border-box;
}
.mainCon {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    flex: 1;
}
</style>