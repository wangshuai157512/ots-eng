<template>
    <div>
        <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
        <ots-refer
            class="mb20"
            :selectList="selectList"
            :request-form="stuSelectParams"
            @search="getStudentList"
        />
        <div class="mainCon">
            <ots-table-group
                :tableHeader="tableHeader"
                :tableData="tableData"
                :pagination="pagination"
                @changeNum="changeSize"
                @changePage="changePage"
            ></ots-table-group>
        </div>
    </div>
</template>
<script>
import { getCurrentPlanFn, getSelectPlanFn } from '@/http/modules/examSet/examBatch'
import { getPlanCourseFn } from '@/http/modules/baseSet/course'
import { getStudentScoreListFn, getOtsUrlFn } from '@/http/modules/examSet/score'
const photoState = {
    0: '不通过',
    1: '通过',
    2: '未审核'
}
export default {
    name: '',
    data () {
        return {
            mainTopBtnList: [],
            selectList: [
                {
                    title: "考试批次",
                    type: "select",
                    requestKey: "planId",
                    label: 'name',
                    value: 'id',
                    data: [],
                },
                {
                    title: "课程",
                    type: "select",
                    requestKey: "courseId",
                    label: 'courseName',
                    value: 'courseId',
                    data: [],
                },
                {
                    title : '关键词',
                    type : 'input',
                    placeholder : '姓名/准考证号/证件号',
                    requestKey: "searchKey"
                }
            ],
            stuSelectParams: {
                planId: '',
                courseId: '',
                searchKey: ''
            },
            stuListParams: {
                page: 1,
                size: 10,
            },
            tableHeader: [
                {
                    title: "考试批次",
                    prop: "planCode"
                },
                {
                    title:"姓名",
                    prop: "realName"
                },
                {
                    title:"准考证号",
                    prop: "entranceCode",
                },
                {
                    title: "证件号",
                    prop: "cardNo"
                },
                {
                    title: "考点",
                    prop: "placeName"
                },
                {
                    title: "考试课程",
                    prop: "courseName",
                },
                {
                    title:"成绩",
                    prop: "publishResult",
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
                    formatter: () => '查看',
                    disableFn: (val) => val.row.publishResult == '-' ? true : false,
                    click: this.goOTS
                },
            ],
            tableData: [],
            pagination: {
                total: 0
            }
        }
    },
    watch: {
        'stuSelectParams.planId': async function (val) {
            this.stuSelectParams.courseId = ''
            // 根据批次获取课程
            const { data: courseData } = await getPlanCourseFn({planId: val})
            this.selectList[1].data = courseData
            // this.selectList[1].data = this.selectList[0].data.filter(item => item.id == val)[0].placeClassList
        }
    },
    created () {
        this.initData()
    },
    methods: {
        async initData () {
            // 当前考试批次
            const { data: plan } = await getCurrentPlanFn()
            // this.currentPlan = `${plan.code}批次`
            // this.classForm.planId = plan.id
            
            const { data: allPlan } = await getSelectPlanFn()
            this.selectList[0].data = allPlan.filter(item => item.id != plan.id)
            
            this.getStudentList()
        },
        changeSize(num) {
            this.stuListParams.size=num
            this.getStudentList()
        },
        changePage(p) {
            this.stuListParams.page=p
            this.getStudentList(true)
        },
        async getStudentList (page) {
            let params
            if (!page) {
                this.stuListParams.page = 1
                params = Object.assign(this.stuListParams, this.stuSelectParams)
            } else {
                params = Object.assign(this.stuTempParams, {page: this.stuListParams.page})
            }
            // let params = Object.assign(this.stuListParams, this.stuSelectParams)
            const { data } = await getStudentScoreListFn(params)
            this.stuTempParams = params
            this.tableData = data.records
            this.pagination.total = data.total
        },
        async goOTS (row) {
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
</style>