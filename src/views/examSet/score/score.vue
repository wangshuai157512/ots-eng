<template>
    <div>
        <template v-if="$route.name=='score'">
            <!-- 标题 -->
            <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
            <div class="mainCon">
                <ots-table
                    :tableHeader="tableHeader"
                    :tableData="tableData"
                ></ots-table>
            </div>
        </template>
        <template v-else>
            <router-view />
        </template>
        
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getCurrentPlanFn } from '@/http/modules/examSet/examBatch'
import { getPlanCoursePublishFn, publishStudentScoreFn } from '@/http/modules/examSet/score'
export default {
    name: 'score',
    data () {
        return {
            saveMethods: 'publishScore',
            backMethods: 'checkScore',
            cancelName: '成绩试算',
            okName: '一键发布',
            mainTopBtnList:  [
                {
                    title: '历史成绩查询',
                    fn: this.goHistory
                }
            ],
            tableHeader: [
                {
                    title:"考试课程",
                    prop: "courseName"
                },
                {
                    title:"成绩显示方式",
                    prop: "scoreType",
                },
                {
                    title:"试算结果",
                    prop: "scoreTotalTest",
                },
                {
                    title:"成绩发布状态",
                    prop: "placeNames",
                    formatter: (val) => val.row.scorePublish == 1 ? '已发布' : '未发布',
                },
                {
                    title:"操作",
                    type: 'button',
                    disableFn: (val) => false,
                    formatter: () => '查看详情',
                    click: this.currentScore
                },
            ],
            tableData: [],
            scoreListForm: {
                type: 0, // 0数据请求1试算数据请求
            }
        }
    },
    created () {
        this.initData()
    },
    mounted () {
        this.SAVE_PAGE_THIS(this)
    },
    methods: {
        ...mapMutations(['SAVE_PAGE_THIS']),
        goHistory () {
            this.$router.push({
                name: 'historyScore'
            })
        },
        async initData () {
            // 当前考试批次
            const { data: plan } = await getCurrentPlanFn()
            this.currentPlan = plan
            this.getScoreList()
        },
        async getScoreList () {
            const { data } = await getPlanCoursePublishFn(this.scoreListForm)
            this.tableData = data
        },
        checkStudent () {},
        async checkScore () {
            const { data } = await getPlanCoursePublishFn({type: 1})
            this.tableData = data
        },
        async publishScore () {
            this.$confirm('成绩发布后将无法撤销和修改，是否确定发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { code } = await publishStudentScoreFn({planId: this.currentPlan.id})
                if (code == 1) {
                    this.$message.success('发布成功')
                    this.getScoreList()
                }
            }).catch(() => {        
            })
            
        },
        currentScore (row) {
            console.log(row)
            this.$router.push({
                name: 'currentScore',
                query: {
                    planCode: this.currentPlan.code,
                    planId: this.currentPlan.id,
                    courseId: row.courseId,
                    courseName: row.courseName
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.mainCon {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    flex: 1;
}
</style>