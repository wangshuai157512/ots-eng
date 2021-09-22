<template>
    <div>
        <template v-if="isIndex">
            <div class="sectionBox">
                <!-- 标题 -->
                <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
                <ots-refer
                    class="mb20"
                    :selectList="selectList"
                    :request-form="sectionSelectParams"
                    @search="getSectionList"
                />
                <!-- 列表 -->
                <div class="mainCon">
                    <ots-table-group
                        :tableHeader="tableHeader"
                        :tableOption="tableOption"
                        :tableData="tableData"
                        :batchOperBtn="batchOperBtn"
                        :pagination="pagination"
                        @changeNum="changeSize"
                        @changePage="changePage"
                    ></ots-table-group>
                </div>
            </div>
        </template>
        <template v-else>
            <router-view />
        </template>
    </div>
</template>
<script>
import { getCurrentPlanFn, getSelectPlanFn } from '@/http/modules/examSet/examBatch'
import { getSectionList, getPlanSite, deleteSessionFn } from '@/http/modules/examSet/section'
export default {
    name: 'section',
    data () {
        return {
            mainTopBtnList: [
                {
                    title: '新增',
                    fn: this.addPlanDialog
                }
            ],
            tableHeader: [
                {
                    title: "考试批次",
                    prop: "code"
                },
                {
                    title:"考试场次",
                    prop: "name"
                },
                {
                    title:"考试时间",
                    formatter: (val) => `${val.row.beginTime} - ${val.row.endTime}`,
                },
                {
                    title:"考试课程",
                    prop: "courseNames"
                },
                {
                    title:"考点",
                    prop: "placeNames"
                },
                {
                    title:"操作",
                    type:"buttons",
                    width:"160",
                    btnList:[
                        {
                            title: "查看",
                            click: this.checkSection
                        },
                        {
                            title: "编辑",
                            disable: (val) => val.row.publish == 1 ? true : false,
                            click: this.editSection
                        },
                        {
                            title: "删除",
                            disable: (val) => val.row.publish == 1 ? true : false,
                            click: this.deleteSection
                        },
                    ]
                }
            ],
            tableOption: {
                multiple:true
            },
            tableData: [],
            batchOperBtn: [],
            pagination: {
                total: 0
            },
            sectionSelectParams: {
                planId: '',
                placeId: '',
            },
            sectionListParams: {
                page: 1,
                size: 10,
                
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
                {
                    title: "考点",
                    type: "select",
                    requestKey: "placeId",
                    label: 'name',
                    value: 'id',
                    data: [],
                },
            ]
        }
    },
    computed: {
        isIndex () {
            return this.$route.name == 'section'
        }
    },
    watch: {
        'sectionSelectParams.planId' (val) {
            this.getSiteData()
        },
        '$route':'getPath'
    },
    created () {
        this.initData()
    },
    methods: {
        async initData () {
            // 获取所有考试批次
            const { data: planData } = await getSelectPlanFn()
            this.selectList[0].data = planData

            // 当前考试批次
            const { data: plan } = await getCurrentPlanFn()
            this.sectionSelectParams.planId = plan.id
            this.getSectionList()

            
        },
        async getSiteData () {
            this.sectionSelectParams.placeId = ''
            const { data } = await getPlanSite({planId: this.sectionSelectParams.planId})
            let siteTemp = Array.isArray(data) ? data : []
            if (siteTemp.length) {
                this.selectList[1].data = [{id: '', name: '全部'}].concat(siteTemp)
            } else {
                this.selectList[1].data = []
            }
            
        },
        addPlanDialog () {
            this.$router.push({
                name: 'addSection'
            })
        },
        editSection (row) {
            this.$router.push({
                name: 'editSection',
                query: {
                    id: row.id
                }
            })
        },
        checkSection (row) {
            this.$router.push({
                name: 'checkSection',
                query: {
                    id: row.id
                }
            })
        },
        deleteSection (row) {
            this.$confirm('确定删除该考试批次?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { code } = await deleteSessionFn({sessionId: row.id})
                if (code == 1) {
                    this.$message.success('删除成功')
                    this.getSectionList()
                }
            }).catch(() => {        
            })
        },
        changeSize(num) {
            this.sectionListParams.size=num
            this.getSectionList()
        },
        changePage(p) {
            this.sectionListParams.page=p
            this.getSectionList()
        },
        async getSectionList () {
            let params = Object.assign(this.sectionListParams, this.sectionSelectParams)
            const { data } = await getSectionList(params)
            this.tableData = data.records
            this.pagination.total = data.total
        },
        getPath () {
            if (this.$route.name == 'section') {
                this.getSectionList()
            }
        },
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