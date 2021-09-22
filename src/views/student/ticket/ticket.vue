<template>
    <div class="mainBox">
        <div class="mainCon">
            <stu-main-title></stu-main-title>
            <div v-if="furl" class="ticketBox">
                <iframe  class="iframe" :src="furl" frameborder="0">111</iframe>
            </div>
            
            
            <!-- <pdf
                v-for="i in numPages"
                :key="i"
                :src="src"
                :page="i"
                style="display: inline-block; width: 25%"
            ></pdf> -->
            <div v-else class="noTicket">
                <img src="@/assets/stuImg/nothing.png" alt="">
                <span class="col_grayQ">暂无准考证信息，请在规定时间内下载</span>
            </div>
        </div>
        <div v-if="furl">
            <stu-foot confirmtext="下载准考证" cancelText="" @confirm="downTicket"></stu-foot>
        </div>
    </div>
</template>
<script>
import pdf from 'vue-pdf'
import StuFoot from '../components/stuFoot.vue';
import { printTicket, selectUserInfo } from '@/http/modules/student/ticket'
import request from '@/http/request'
// var loadingTask = pdf.createLoadingTask('@/assets/invoice.pdf');
export default {
    components: {
        pdf,
        StuFoot
    },
    name: 'ticket',
    data () {
        return {
            // furl: 'http://oweb.chinaedu.net/?furl=http://oms.demo.chinaedu.net/Upload/ChinaeduOMSEntities/12/%E5%BF%83%E7%90%86%E5%AD%A6(A).doc',
            furl: '',
            // src: loadingTask,
			numPages: undefined,
            userInfo: {}
        }
    },
    created () {
        this.initStuInfo()
    },
    mounted () {
        // this.src.promise.then(pdf => {

		// 	this.numPages = pdf.numPages;
		// })
    },
    methods: {
        async initStuInfo () {
            const { data } = await selectUserInfo()
            this.userInfo = data
            console.log(data)
            this.getTicket()
            
        },
        async getTicket () {
            const { data } = await printTicket({cardNo: this.userInfo.cardNo})
            this.ticketPdf = data
            if (data) {
                this.furl = `https://oweb.chinaedu.net/?ssl=1&furl=${data}`
            }
        },
        handlePdfLink (url, filename) {
            request({
                url: url,
                method: 'get',
                responseType: 'arraybuffer',
            })
            .then(function (res) {
                if (res.status !== 200) {
                    return res.json()
                }
                return res.arrayBuffer()
            })
            .then((blobRes) => {
                // 生成 Blob 对象，设置 type 等信息
                const e = new Blob([blobRes], {
                type: 'application/octet-stream',
                'Content-Disposition':'attachment'
            })
            // 将 Blob 对象转为 url
            const link = window.URL.createObjectURL(e)
            // handleFileDownload(link, filename)
                window.open(link)
            }).catch(err => {
                console.error(err)
            })
        },
        downTicket () {
            window.open(`${this.ticketPdf}?response-content-type=application/octet-stream`)
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .stuMain {
    min-width: 700pt;
}
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
    min-width: 700pt;
    
    background: rgba(255, 255, 255, 0.93);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    .ticketBox {
        width: 100%;
        padding-top: 20px;
        display: flex;
        justify-content: center;
        iframe {
            width: 600pt;
            height: 1000px;
        }
    }
    .noTicket {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 60px;
        padding-bottom: 100px;
    }
    
}
</style>