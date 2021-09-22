<template>
  <div class="stu-foot">
    <div class="btn-list" v-if="isSlot">
      <div class="btn-item cancel-btn" v-if="cancelText">
        <el-button round @click="cancelEvent($event)">{{cancelText}}</el-button>
      </div>
      <div class="btn-item confirm-btn" v-if="confirmtext">
        <el-button round @click="confirmEvent($event)" :disabled='confirmDisabled'>{{confirmtext}}</el-button>
      </div>
    </div>
    <div v-else class="slotClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "stuFoot",
    props : {
      cancelText : {
        type : String,
        default : '取消'
      },
      confirmtext : {
        type : String,
        default : '提交报名信息'
      },
      confirmDisabled : {
        type : Boolean,
        default : false
      }
    },
    computed : {
      isSlot () {
        let slot = this.$slots.default
        return  slot ? false : true
      }
    },
    methods : {
      cancelEvent ($event) {
        this.$emit('cancel',$event)
      },
      confirmEvent ($event) {
        this.$emit('confirm',$event)
      }
    }
  }
</script>

<style scoped lang="less">
  .stu-foot {
    width: 100%;
    height: 68px;
    box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: center;
    align-items: center;
    .slotClass {
      width: 100%;
      height: 100%;
    }
  }
  .btn-list {
    display: flex;
    justify-content: center;
    .btn-item:first-child {
      margin-right: 16px;
    }
    .btn-item {
      /deep/.el-button.is-round {
        padding: 10px 36px;
        font-size: 14px;
      }
    }
    .btn-item.confirm-btn {
      /deep/.el-button.is-disabled.is-round {
        background-color: #ccc;
      }
      /deep/.el-button.is-round {
        background-color: #006AFF;
        color: #fff;
      }
    }
  }
</style>
