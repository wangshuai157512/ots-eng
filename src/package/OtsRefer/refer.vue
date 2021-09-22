<template>
  <div v-if="selectList.length">
    <!-- <div class="select-con"> -->
      <el-form :inline="true" ref="form" label-width="120px" class=" select-con refer-from">
        <!-- <div v-for="(item,index) in selectList" :key="item.title" style="display:inline-block"> -->
          <template v-for="(item,index) in selectList">
            <el-form-item :label="item.title + '：'" v-if="item.type === 'select' && index < showAdvanced" :key="item.title" class="change-label-calss">
              <el-select
                  v-model="requestForm[item.requestKey]"
                  label="item.lable"
                  placeholder="请选择"
                  :filterable="item.isSearch"
                  @change="item.change && item.change($event)"
              >
                <el-option
                    v-for="itemChild in item.data"
                    :key="itemChild[item.value]"
                    :label="itemChild[item.label]"
                    :value="itemChild[item.value]"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="item.title + '：'" v-if='item.type === "input" && index < showAdvanced' :key="item.title" class="change-label-calss">
              <el-input v-model="requestForm[item.requestKey]" :placeholder="item.placeholder"></el-input>
            </el-form-item>
            <el-form-item :label="item.title + '：'" v-if='item.type === "data" && index < showAdvanced' :key="item.title" class="change-label-calss">
              <el-date-picker
                v-model="requestForm[item.requestKey]"
                type="date"
                :placeholder="item.placeholder"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>

            </el-form-item>
          </template>
          <el-form-item>
            <el-button :type="colorType" round @click="search" plain>查询</el-button>
            <el-button type="text" round @click="advancedSearch" v-if="selectList.length > 3 && showAdvanced === 3">高级查询</el-button>
            <el-button type="text" round @click="closeAdvancedSearch" v-if="selectList.length > 3 && showAdvanced === 50">收起</el-button> 
          </el-form-item>
      </el-form>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "OtsRefer",
  props: {
    selectList: {
      type: Array,
      default: () => [],
    },
    requestForm : {
      type : Object,
      default : () => {}
    },
    // showAdvanced: {
    //   type: Number,
    //   default: 3
    // }
  },
  data() {
    return {
      colorType:'primary',
      colorTypeNo:'',
      showAdvanced:3
    };
  },
  methods :{
      search () {
          this.$emit('search')
          this.colorType = 'primary'
          this.colorTypeNo = ''
      },
      advancedSearch() {
        // this.colorType = ''
        this.colorTypeNo = 'primary'
        this.showAdvanced = 50
      },
      closeAdvancedSearch() {
        this.showAdvanced = 3
      }
  },
  mounted() {

  },
};
</script>

<style lang="less" scoped>
  .select-con {
    background: #fff;
    position: relative;
    border-radius: 8px;
  }
  .refer-from {
    padding: 20px 24px 0px 24px;
    .el-form-item {
        margin-bottom: 20px;
    }
  }
  .change-label-calss /deep/ .el-form-item__label{
        color: #626673;
        text-align: right;
        display: inline-block;
  }
  .change-label-calss /deep/ {
    margin-right: 40px!important;
    margin-bottom: 10px;
  }
   /deep/ .change-label-calss, /deep/ .el-form-item__label {
     height: 32px;
     line-height: 32px!important;
   }
   /deep/ .el-form-item__label {
     vertical-align: top;
   }
  /deep/ .change-label-calss .el-input__inner,/deep/ .el-select .el-input__inner,/deep/ .el-form-item__content,/deep/ .el-form-item__content .el-input{
    width: 200px!important;
    height: 32px!important;
    line-height: 32px!important;
  }
  /deep/ .el-input__icon {
     line-height: 32px;
   }
  .select-con /deep/ .el-button {
    padding: 7px 22px;
  }
   /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:auto
    }
   
</style>
