<template>
    <div>
        <template v-if="$route.name=='classSet'">
            <!-- 标题 -->
            <ots-main-title :mainTopBtn="mainTopBtnList">
                <!-- <template v-slot:tabs v-if="$route.name!='student'">
                    <el-tabs v-model="activeName">
                        <el-tab-pane :label="currentPlan" name="curentPlan"></el-tab-pane>
                        <el-tab-pane label="历史批次" name="historyPlan"></el-tab-pane>
                    </el-tabs>
                </template> -->
            </ots-main-title>
            <div class="mainCon">
                <ots-table-group
                    :tableHeader="tableHeader"
                    :tableData="tableData"
                    :pagination="pagination"
                    @changeNum="changeSize"
                    @changePage="changePage"
                ></ots-table-group>
            </div>
            <!-- <div class="myFooter">
                <el-button size="small" round @click="setClass">{{cancelName}}</el-button>
                <el-button type="primary" size="small" round @click="publishClass">{{okName}}</el-button> 
            </div>  -->
        </template>
        <template v-else>
            <router-view/>
        </template>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getCurrentPlanFn } from '@/http/modules/examSet/examBatch'
import { getClassListFn, setStudentClassFn, publishPlanClassFn } from '@/http/modules/examSet/planClass'
export default {
    name: 'classSet',
    data () {
        return {
            saveMethods: 'publishClass',
            backMethods: 'setClass',
            cancelName: '自动安排',
            okName: '一键发布',
            currentPlan: 'qqqq',
            activeName: 'curentPlan',
            mainTopBtnList:  [
                {
                    title: '历史批次查询',
                    fn: this.goHistory
                }
            ],
            classForm: {
                planId: '',
                page: 1,
                size: 10
            },
            tableHeader: [
                {
                    title: "考试场次",
                    prop: "name"
                },
                {
                    title:"考试课程",
                    prop: "courseNames"
                },
                {
                    title:"考点",
                    prop: "placeNames",
                },
                {
                    title:"安排状态",
                    // prop: "courseNames",
                    formatter: (val) => val.row.classSetStudent == 1 ? '已安排' : '未安排',
                },
                {
                    title:"发布状态",
                    prop: "placeNames",
                    formatter: (val) => val.row.classPublish == 1 ? '已发布' : '未发布',
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
                total: 0
            }
        }
    },
    watch: {
        // 'activeName': function (val) {

        //     if (val == 'historyPlan') {
        //         this.$router.push({
        //             name: 'historyClass'
        //         })
        //     } else {
        //         this.$router.push({
        //             name: 'classSet'
        //         })
        //     }
        // }
    },
    created () {
        this.initData()
    },
    mounted () {
        this.SAVE_PAGE_THIS(this)
    },
    methods: {
        ...mapMutations(['SAVE_PAGE_THIS']),
        async initData () {
            // 当前考试批次
            const { data: plan } = await getCurrentPlanFn()
            this.currentPlan = `${plan.code}批次`
            this.classForm.planId = plan.id
            this.getClassList()
        },
        async getClassList () {
            const { data } = await getClassListFn(this.classForm)
            this.tableData = data.records
            this.pagination.total = data.total
        },
        changeSize(num) {
            this.classForm.size=num
            this.getClassList()
        },
        changePage(p) {
            this.classForm.page=p
            this.getClassList()
        },
        async publishClass () {
           const { code } = await publishPlanClassFn({planId: this.classForm.planId})

           if (code == 1) {
                this.$message.success('发布成功')
                this.getClassList()
            }
        },
        async setClass () {
            const { code } = await setStudentClassFn({planId: this.classForm.planId})
            
            if (code == 1) {
                this.$message.success('安排成功')
                this.getClassList()
            }
        },
        goHistory () {
            this.$router.push({
                name: 'historyClass'
            })
        },
        checkStudent (row) {
            // console.log(row)
            window.localStorage.setItem('checkPlan', JSON.stringify(row))
            this.$router.push({
                name: 'student',
                query: {
                    // id: row.id,
                    sessionId: row.id
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
.myFooter {
    width: 100%;
}
</style>