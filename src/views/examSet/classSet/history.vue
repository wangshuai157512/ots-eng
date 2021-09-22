<template>
    <div>
        <ots-main-title :mainTopBtn="mainTopBtnList" />
        <ots-refer
            class="mb20"
            :selectList="selectList"
            :request-form="classSelectParams"
            @search="getClassList"
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
import { getClassListFn, setStudentClassFn } from '@/http/modules/examSet/planClass'
export default {
    name: 'history',
    data () {
        return {
            mainTopBtnList: [],
            tableHeader: [
                {
                    title: "考试批次",
                    prop: "code"
                },
                {
                    title: "考试场次",
                    prop: "name"
                },
                {
                    title:"考试课程",
                    prop: "courseNames"
                },
                {
                    title: "考点",
                    prop: "placeNames"
                },
                {
                    title:"考生数",
                    type: 'button',
                    prop: "studentCount",
                    disableFn: (val) => val.row.studentCount > 0 ? false : true,
                    click: this.checkStudent
                },
                
            ],
            tableData: [],
            pagination: {
                total: 0,
            },
            selectList: [
                {
                    title: "考试批次",
                    type: "select",
                    requestKey: "planId",
                    label: 'name',
                    value: 'id',
                    data: [],
                },
                // {
                //     title: "场次",
                //     type: "select",
                //     requestKey: "sessionId",
                //     label: 'name',
                //     value: 'id',
                //     data: [],
                // },
            ],
            classSelectParams: {
                planId: '',
                // sessionId: ''
            },
            classListParams: {
                page: 1,
                size: 10,
            }
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
            
            this.getClassList()
        },
        async getClassList (page) {
            let params
            if (!page) {
                this.classListParams.page = 1
                params = Object.assign(this.classListParams, this.classSelectParams)
            } else {
                params = Object.assign(this.classTempParams, {page: this.classListParams.page})
            }
            const { data } = await getClassListFn(params)
            this.classTempParams = params
            this.tableData = data.records
            this.pagination.total = data.total
        },
        changeSize(num) {
            this.classListParams.size=num
            this.getClassList()
        },
        changePage(p) {
            this.classListParams.page=p
            this.getClassList(true)
        },
        checkStudent (row) {
            window.localStorage.setItem('checkPlan', JSON.stringify(row))
            this.$router.push({
                name: 'student',
                query: {
                    id: row.id
                }
            })
        }   
    }
}
</script>
<style lang="less" scoped>
</style>