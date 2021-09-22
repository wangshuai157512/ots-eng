<template>
    <div>
        <ots-main-title></ots-main-title>
        <div class="systemBox">
            <div class="basicCon">
                <h1>基本设置</h1>
                <div v-for="item in basicsSetList" :key="item.title" class="setState">
                    <span>{{item.title}}</span>
                    <el-switch v-model="basicsMap[item.prop]" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div class="personalCheck">
                    <span>考生人身核验最多</span>
                    <el-input v-model="basicsMap['uploadTimes']" placeholder="请输入" @blur="uploadTimeBlur"></el-input><em>次</em>
                </div>
                <p class="numExplit">考生上传照片时会和公安部身份证照片进行比对，确认照片是考生本人，建议设置3次，如果确认有近照和身份证照片差别巨大的，由老师人工核验。</p>
            </div>
            <div class="ipSetCon">
               <h1>IP设置</h1>
                <div class="setState">
                    <span>验证IP范围</span>
                    <el-switch v-model="basicsMap['needIPCheck']" :active-value="1" :inactive-value="0"></el-switch>
                </div>
                <div class="ipScope" v-if="basicsMap['needIPCheck'] === 1">
                    <h6>IP范围设置</h6>
                    <div v-for="(item,index) in ipSetLits" :key="index" class="inputBox">
                        <el-input v-model="item.ipBegin" placeholder="请输入"></el-input>
                        <span> 至</span>
                        <el-input v-model="item.ipEnd" placeholder="请输入"></el-input>
                        <i v-if="index !== 0" class="el-icon-delete" @click="deletIp"></i>
                    </div>
                    <span class="addIp" @click="addIp">+ 增加IP范围</span>
                </div> 
            </div>
             

        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            cancelName:"",
            basicsSetList:[
                {
                    title:"报名人工审核",
                    prop :'needAudit'
                }, 
                {
                    title:"设置考试范围",
                    prop :'needRegion'
                },
                {
                    title:"使用巡考系统",
                     prop :'needOIS'
                }
            ],
            ipSetLits:[
                {
                    ipBegin:'',
                    ipEnd:'',   
                }
            ],
            basicsMap : {}
        }
    },
    methods: {
        
        deletIp() {
            this.ipSetLits = this.ipSetLits.filter((item,index,arr)=> {
                return index !== arr.length-1
            })
        },

        checkedIp() {
            let ipItem = {
                ipBegin:'',
                ipEnd:'',
            }
            if(!this.ipSetLits[0].ipBegin || !this.ipSetLits[0].ipEnd) {
                this.$confirm('请设置完整的IP范围', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    roundButton:true
                })
                return
            }
            this.ipSetLits.push(ipItem)
        },
        
        addIp() {
            this.checkedIp()
        },
        uploadTimeBlur() {
            if(!this.basicsMap['uploadTimes'] || this.basicsMap['uploadTimes'] >3 || this.basicsMap['uploadTimes'] <1 ) {
                this.$message({
                    message: '考生人身核验建议设置3次',
                    type: 'warning'
                });
                this.basicsMap['uploadTimes'] = 3
            }
        },
        getConfigData(){
            this.$api.system.getConfigData().then(res=> {
                let configList = res.data.configList
                let basicsMap = {}
                configList.forEach(item => {
                    basicsMap[item.setName] = item.setValue
                })
                this.basicsMap = basicsMap
                this.ipSetLits = res.data.ipList
            })
        },
        goBack() {
            this.$router.go(-1)
        },
        ...mapMutations(['SAVE_PAGE_THIS']),
        save() {
            this.uploadTimeBlur()
            if(!this.basicsMap.needIPCheck) {
                this.ipSetLits = [
                    {
                        ipStart:'',
                        ipEnd:'',   
                    }
                ]
            }else {
                if(!this.ipSetLits[0].ipBegin || !this.ipSetLits[0].ipEnd) {
                    this.$confirm('请设置完整的IP范围', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        roundButton:true
                    })
                    return
                }
            }
           
            let queryAddConfig = {
                ...this.basicsMap,
                ipJsonString : JSON.stringify(this.ipSetLits)
            }
            // console.log(JSON.stringify(this.ipSetLits))
            this.$api.system.addConfig(queryAddConfig).then(res=>{
                if(res.code) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }
            })
        }
    },
    mounted() {
        this.SAVE_PAGE_THIS(this)
        this.getConfigData()
    }
}
</script>

<style lang="less" scoped>
 .systemBox {
     background: #fff;
     padding: 20px 24px;
     .basicCon {
         padding-bottom: 30px;
         border-bottom: 1px solid #F1F2F5;
     }
     h1 {
         color:#2D2F33;
         font-size: 16px;
         font-weight: 500;
         margin-bottom: 40px;
     }
     .setState,.personalCheck {
         display: flex;
         align-items: center;
        margin-bottom: 40px;
         span {
             display: block;
            width: 144px;
            color: #45494D;
            text-align:right;
            margin-right: 16px;
         }
         .el-input {
             width: 160px;
             height: 36px;
         }
        em {
            position: relative;
            margin-left: -25px;
            z-index: 1;
            font-style:normal
        }
     }
     .personalCheck {
         margin-bottom: 16px!important;
     }
     .numExplit {
        font-size: 14px;
        color: #9299A6;
        margin-left: 160px;
     }
     .ipSetCon {
         padding-top: 32px;
     }
     .ipScope {
        padding: 24px 32px;
        box-sizing: border-box;
        margin-left: 160px;
        background: #F8F9FC;
        border-radius: 8px;
        h6 {
            color: #45494D;
            font-size: 14px;
            margin-bottom: 16px;
        }
        .inputBox {
            display: flex;
            height: 36px;
            line-height: 36px;
            justify-items: center;
            vertical-align: middle;
            margin-bottom: 8px;
            /deep/ .el-input {
                width: 240px;
                height: 36px;
                line-height: 36px;
            }
            span {
                margin: 0 11px;
            }
            i {
                margin: 12px 0 0 20px;
                color:#006AFF;
            }
        }
        .addIp {
           color: #006AFF;
           font-size: 14px;
        }

     }

 }

</style>