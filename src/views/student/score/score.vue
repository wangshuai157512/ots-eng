<template>
    <div class="mainCon">
        <stu-main-title></stu-main-title>
        <div class="content">
            <ots-table
                v-if="!showNull"
                :tableHeader="tableHeader"
                
                :tableData="tableData"
            ></ots-table>
            <div v-else class="noScore">
                <img src="@/assets/stuImg/nothing.png" alt="">
                <span class="col_grayQ">成绩暂未发布，请等待</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentPlanFn } from '@/http/modules/examSet/examBatch'
import { selectUserInfo } from '@/http/modules/student/ticket'
import { getScoreList, exportScoreList, exportCertificate } from '@/http/modules/student/score'
export default {
    name: 'stuScore',
    data () {
        return {
            showNull: false,
            tableHeader: [
                {
                    title: '考试批次',
                    prop: 'planName',
                },
                {
                    title: '考试科目',
                    prop: 'course',
                },
                {
                    title: '成绩',
                    prop: 'result',
                },
                {
                    title: '操作',
                    type: "buttons",
                    width: "200",
                    btnList:[
                        {
                            // title: "下载合格证",
                            prop: 'result',
                            formatter: (val) => val.row.result == '合格' ? '下载合格证' : '',
                            click: this.downCertificate
                        },
                        {
                            title: "下载成绩单",
                            click: this.downScore
                        },
                    ]
                },
            ],
            tableData: [],
        }
    },
    created () {
        this.getScoreData()
    },
    methods: {

        async getScoreData () {
            const { data: plan } = await getCurrentPlanFn()
            
            const { data: user } = await selectUserInfo()
            this.user = user
            let param = {
                planId: 'd403db7d-c9e5-4325-928c-b2b7f3df5acd',
                userId: user.id
            }
            const { data } = await getScoreList()
            if (data) {
                this.tableData = data
            } else {
                this.showNull = true
            }
            
        },
        async downScore () {
            const { data } = await exportScoreList({cardNo: this.user.cardNo})
            if (data) {
                window.location.href = data
            }
        },
        async downCertificate (row) {
            // console.log(row)
            const { data } = await exportCertificate({cardNo: this.user.cardNo, planId: row.planId})
            if (data) {
                window.open(data) 
            }
        }
        
    }
}
</script>
<style lang="less" scoped>
.mainCon {
    box-sizing: border-box;
    padding: 20px;
    padding-top: 16px;
    width: 100%;
    min-width: 700pt;
    background: rgba(255, 255, 255, 0.93);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    .content {
        padding-top: 20px;
        .noScore {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 40px;
            padding-bottom: 80px;
        }
    }
}
/deep/ .el-table th, .el-table tr {
    background-color: #EBECFF!important;
}
</style>