<template>
    <div>
        <ots-main-title :mainTopBtn="mainTopBtnList" />
        <div class="topTip">
            <span class="f18 col_black mr20">{{`${$route.query.planCode}批次${$route.query.courseName}`}}</span>
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
    </div>
</template>
<script>
import { getClassStudentListFn, exportStudentFn, getStudentViewInfoFn } from '@/http/modules/examSet/planClass'
import { getPlanSite } from '@/http/modules/examSet/section'
import { getStudentScoreListFn, getOtsUrlFn } from '@/http/modules/examSet/score'
const photoState = {
    0: '不通过',
    1: '通过',
    2: '未审核'
}
export default {
    name: 'currentScore',
    data () {
        return {
            exportDialog: false,
            checkDialog: false,
            planInfo: {},
            studentInfo: {},
            mainTopBtnList: [
                // {
                //     title: '导出',
                //     fn: this.exportStudent
                // }
            ],
            selectList: [
                // {
                //     title: "考点",
                //     type: "select",
                //     requestKey: "placeId",
                //     label: 'name',
                //     value: 'id',
                //     data: [],
                // },
                // {
                //     title: "教室",
                //     type: "select",
                //     requestKey: "classId",
                //     label: 'name',
                //     value: 'id',
                //     data: [],
                // },
                {
                    title: "关键词",
                    type: "input",
                    placeholder : '姓名/准考证/证件号',
                    requestKey: "searchKey",
                },
            ],
            stuSelectParams: {
                // placeId: '',
                // classId: '',
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
                    title:"成绩",
                    prop: "result",
                    // formatter: (val) => val.row.classSetStudent == 1 ? '已安排' : '未安排',
                },
                // {
                //     title:"签到状态",
                //     // prop: "placeNames",
                //     formatter: (val) => val.row.signState == 1 ? '已发布' : '未发布',
                // },
                {
                    title:"人脸验证状态",
                    prop: "photoCheckState",
                    formatter: (val) => photoState[val.row.photoCheckState] || '数据错误',
                },
                {
                    title:"成绩状态",
                    prop: "placeNames",
                    formatter: (val) => val.row.scorePublish == 1 ? '已发布' : '未发布',
                },
                {
                    title:"作答详情",
                    type: 'button',
                    prop: "studentCount",
                    formatter: () => '查看',
                    disableFn: (val) => val.row.result == '-' ? true : false,
                    click: this.goOTS
                },
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
        // 'stuSelectParams.placeId': function (val) {
        //     this.stuSelectParams.classId = ''
        //     this.selectList[1].data = this.selectList[0].data.filter(item => item.id == val)[0].placeClassList
        // }
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
            const { planId, courseId } = this.$route.query
            this.stuListParams.planId = planId
            this.stuListParams.courseId = courseId
            
            // const { data } = await getPlanSite({planId: planInfo.planId})
            // this.selectList[0].data = data
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
            
            const { data } = await getStudentScoreListFn(params)
            this.stuTempParams = params
            this.tableData = data.records
            this.pagination.total = data.total
        },
        async goOTS (row) {
            console.log(row)
            let params = {
                action: 'getTReviewDetails',
                parames: `argumentsId=${row.recordId}&curPage=JudgeLib`
            }
            const { code, data } = await getOtsUrlFn(params)
            if (code==1) {
                window.open(data)
            }
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