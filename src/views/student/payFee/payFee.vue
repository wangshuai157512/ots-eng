<template>
    <div class="mainBox">
        <div class="mainCon">
            <stu-main-title></stu-main-title>
            <div class="content">

                <ots-table
                    v-if="tableData.length"
                    :tableOption="tableOption"
                    :tableHeader="tableHeader"
                    :tableData="tableData"
                    @handleSelectionChange="stubachOper"
                ></ots-table>
                <div v-else class="noPay">
                    <img src="@/assets/stuImg/nothing.png" alt="">
                    <span class="col_grayQ">暂无需要缴费的信息</span>
                </div>
            </div>
        </div>
        <div v-if="tableData.length">
            <stu-foot>
                <div class="bottomLine">
                    <div>
                        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
                    </div>
                    <div class="lineRight">
                        <span class="mr5">缴费总额:</span>
                        <span class="col_orange f24 mr20">{{totalMoney}}</span>
                        <el-button round type="primary" @click="goPay">立即支付</el-button>
                    </div>
                </div>
            </stu-foot>
        </div>
        <form id="cedupayForm" name="cedupayForm"  method="post">
            <input type="hidden" id="cdata" name="cdata" >
            <input type="hidden" id="merchantNo" name="merchantNo" >
        </form>
    </div>
</template>
<script>

import StuFoot from '../components/stuFoot.vue'
import { getCurrentPlanFn } from '@/http/modules/examSet/examBatch'
import { selectPayInfoFn, payFn } from '@/http/modules/student/payment'
export default {
    components: {
        StuFoot
    },
    name: 'payFee',
    data () {
        return {
            pay_cdata: '',
            pay_merchantNo: '',
            payUrl: '',
            checkAll: false,
            payDialog: false,
            iframeData: "",
            selectList: [],
            tableOption: {
                multiple:true
            },
            tableHeader: [
                {
                    title: '批次名称',
                    prop: 'planName',
                },
                {
                    title: '科目名称',
                    prop: 'course',
                },
                {
                    title: '报考费用(元)',
                    prop: 'money',
                },
                {
                    title: '缴费状态',
                    prop: 'isPay',
                },
                // {
                //     title: '缴费状态',
                //     type:"buttons",
                //     width:"60",
                //     btnList:[
                //         {
                //             title: "下载合格证",
                //             click: this.deleteCoursePaper
                //         },
                //         {
                //             title: "下载成绩单",
                //             click: this.deleteCoursePaper
                //         },
                //     ]
                // },
            ],
            tableData: [],
            payForm: {
                courseId: '',
                planId: '',
                amount: '',
                returnUrl: '',
            }
        }
    },
    computed: {
        totalMoney () {
            let money = this.selectList.filter(item => item.isPay == "未缴费").reduce((a, b) => a + b.money, 0)
            return parseFloat(money).toFixed(2)
        }
    },
    watch: {
        payUrl: () => {
            // document.getElementById('cedupayForm').submit(function(event) {
            //     console.log('------ok-------');
            // })
        }
    },
    created () {
        this.getPayData()
    },
    methods: {
        async getPayData () {
            const { data: plan } = await getCurrentPlanFn()
            this.payForm.planId = plan.id

            const { data } = await selectPayInfoFn()
            if (data) {
                this.tableData = data
            } else {
                this.tableData = []
            }
        },
        // handleCheckAllChange (value) {
        //     console.log(value)
        //     this.checkAll = true
            
        // },
        stubachOper (val) {
            let idList=[]
            val.forEach(item=>{
                idList.push(item)
            })
            this.selectList = idList
        },
        async goPay () {
            this.payForm.returnUrl = window.location.href
            let temp = this.selectList.filter(item => item.isPay == '未缴费')
            if (!temp.length) {
                this.$message.warning('请选择未缴费课程')
                return
            }
            this.payForm.courseId = temp.map(item => item.courseId).join()
            this.payForm.amount = this.totalMoney
            const { data } = await payFn(this.payForm)
            this.pay_cdata = data.cdata
            this.payUrl = data.payCenterGateway
            this.pay_merchantNo = data.merchantNo
            document.getElementById('cedupayForm').action=data.payCenterGateway
            document.getElementById('cdata').value=data.cdata
            document.getElementById('merchantNo').value=data.merchantNo
            let param = {
                payCenterGateway: data.payCenterGateway,
                cdata: data.cdata,
                merchantNo: data.merchantNo
            }
            // alert(JSON.stringify(param))
            // return
            document.getElementById('cedupayForm').submit()

        }
    }
}
</script>
<style lang="less" scoped>
.mainBox {
    width: 100%;
    min-width: 700pt;
    background-color: #fff;
    border-radius: 8px;
}
.mainCon {
    box-sizing: border-box;
    padding: 20px;
    padding-top: 16px;
    width: 100%;
    background: rgba(255, 255, 255, 0.93);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    .content {
        padding-top: 20px;
        .noPay {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 40px;
            padding-bottom: 80px;
        }
    }
}
.bottomLine {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .lineRight{
        display: flex;
        align-items: center;
    }
}
/deep/ .el-table th, .el-table tr {
    background-color: #EBECFF!important;
}
</style>