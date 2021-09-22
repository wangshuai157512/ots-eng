<template>
    <div class="index">
		    <el-alert
            title=""
            type="warning"
            show-icon>
            <div class="importantNote">
                您有<span>358</span>报名信息待审核 ,<i @click="handleClick">去审核</i>
            </div>
        </el-alert>
        <div class="titleCard">
            <div class="titleCardItem">
              <div>
                <h3>报名人数</h3>
                <span>5866</span>
              </div>
              <div>
                <img src="" alt="">
              </div>
            </div>
        </div>
        <div class="quickFun">
          <h1>快捷功能</h1>
          <div class="quickFunCard">
            <div class="quickFunCardItem">
              <img src="../assets/img/quickFunImg01.png" alt="">
              <h2>基础信息设置</h2>
              <ul>
                <li>
                  学校管理
                </li>
                <li>
                  学校管理
                </li>
                <li>
                  学校管理
                </li>
                <li>
                  学校管理
                </li>
              </ul>
            </div>
          </div>
        </div>

    </div>


</template>
<script>
export default {
    name:"index",
    data(){
    	return {
    		
	    }
    },
    mounted() {
      //  this.$router.push({name:'stuHome'})
      // this.$api.applyManage.getCurrentPlan().then(res=> {
      //     console.log(res,9632)
      //   this.endAudit = moment(res.data.endAudit).format('YYYY年MM月DD日 HH时mm分ss秒')
      // })
      
    },
    methods:{
      handleClick() {
        this.$router.push({name:'applyAudit'})
      }
    }
   
}

</script>
<style lang="less"  scoped>
  .index {
    .el-alert {
        margin-bottom: 24px;
        .importantNote {
            font-size: 14px;
            color: #45494D;
            line-height: 1.4;
            span {
                color: #F27900;
                margin-left: 3px;
            }
            i {
              font-style: normal;
              color: #006AFF;
            }
        }
    }
    .titleCard {
      display: flex;
      justify-content: space-between;
      color: #fff;
      .titleCardItem {
        display: flex;
        justify-content: space-between;
        width: 399px;
        height: 114px;
        background: linear-gradient(133deg, #4D89FF 0%, #0F60FE 100%);
        box-shadow: 0px 6px 24px 0px rgba(0, 69, 166, 0.15);
        border-radius: 8px;
        padding: 25px 58px 23px 80px;
        box-sizing: border-box;
        h3 {
          font-size: 14px;
          margin-bottom: 8px;
        }
        span {
          font-size: 36px;
        }
      }
    }
    h1 {
      font-size: 20px;
      color: #2D2F33;
      padding: 32px 0 16px 0;
    }
    .quickFun {
      .quickFunCard {
        display: flex;
        justify-content: space-between;
        .quickFunCardItem {
          text-align: center;
          width: 538px;
          background: #fff;         
          border-radius: 8px;
          padding: 24px 20px;
          box-sizing: border-box;
          h2 {
            color: #45494D;
            font-size: 16px;
            margin-top: 8px;
          }
          ul {
            // display: flex;
            // justify-content: space-around;
            // flex-wrap:wrap
            text-align: left;
            li {
              margin-top: 16px;
              display: inline-block;
              padding: 0 45px;
              font-size: 14px;
              color: #737780;
              position: relative;
              margin-left: 10px;
              &:after {
                  content: ' ';
                  position: absolute;
                  left: 32px;
                  top: 8px;
                  width: 5px;
                  height: 5px;
                  background-color: #C2C6CC;
                  border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
  
</style>
