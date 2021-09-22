<template>
  <div class="otstablenew">
    <div class="batchOperation" v-if="batchOperBtn.length>0">
      <ul>
        <li class="batchBtn" v-for="item in batchOperBtn" :key="item.title" @click="item.click()">
          <a href="javascript:;">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="ots-table">
      <el-table
        ref="el-table"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          v-if="tableOption.multiple"
          type="selection"
          width="55"
          :selectable="isDisabledMultiple"
        ></el-table-column>
        <template v-for="(item,index) in tableHeader">
          <el-table-column
            :key="index"
            v-if="!item.type"
            v-bind="setAttribute(item,index)"
          >
            <template slot-scope="scope">
                            <span class="table-text" v-html="getTableText(item,scope)">
                            </span>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-else-if="item.type==='img'"
            v-bind="setAttribute(item,index)"
          >
            <template slot-scope="scope">
              <div class="table-img-container">
                <div class="big-img" :style="{display:'none',top : scope.$index > tableData.length - 3 ? '-120px':'0'}">
                  <img :src="scope.row[item.prop]" alt="">
                </div>
                <img
                  class="table-img"
                  :src="scope.row[item.prop]"
                >
                <span></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-else-if="item.type==='switch'"
            v-bind="setAttribute(item,index)"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[item.prop]"
                :active-value=1
                :inactive-value=0
                @change="item.switchChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-bind="setAttribute(item,index)"
            v-else-if="item.type==='tag'"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.color"
                :color="scope.row.color"
              >{{scope.row[item.prop]}}
              </el-tag>
              <el-tag
                v-else-if="scope.row.tagType"
                :type="scope.row.tagType"
              >{{scope.row[item.prop]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            class="operate"
            v-else-if="item.type==='buttons'"
            v-bind="setAttribute(item,index)"
            align="right"
            headerAlign="right"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-for="(itemBtn,index) in item.btnList"
                :key="index"
                :type="itemBtn.type || 'text'"
                :size="itemBtn.size || 'mini'"
                :disabled="itemBtn.formatter?itemBtn.formatter(scope):itemBtn.disabled"
                @click="itemBtn.click(scope.row,itemBtn)"
              >{{typeof itemBtn.title === 'function'?itemBtn.title(scope) : itemBtn.title}}
              </el-button>
            </template>
          </el-table-column>
        </template>

      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OtsTableNew',
    props: {
      tableHeader: {
        type: Array,
        default: () => []
      },
      tableData: {
        type: Array,
        default: () => []
      },
      tableOption: {
        type: Object,
        default: () => ({})
      },
      batchOperBtn: {
        type: Array,
        default: () => []
      },
      isDisabledMultiple :  {
        type : Function,
        default : () => true,
      }
    },
    methods: {
      mouseenterImg (e,img) {
        let targetDom = e.target.previousSibling
        let imgDom = new Image()
        imgDom.src = img
        targetDom.appendChild(imgDom)
      },
      removeImg (e) {
        let targetDom = e.target.previousSibling
        let img = targetDom.getElementsByTagName('img')[0]
        console.log(img)
        img.remove()
      },
      setAttribute(item, index) {
        return {
          headerAlign: index === 0 ? 'left' : item.headerAlign || 'center',
          prop: item.prop,
          fixed: item.fixed,
          label: item.title,
          width: item.width || 'auto',
          align: index === 0 ? 'left' : item.align || 'center',
        }
      },
      getTableText(item, scope) {

        let text = (item.formatter ? item.formatter(scope) : scope.row[item.prop])
        if (text === 'Invalid date') {
          return '-'
        } else {
          return (text || text == '0') ? text : '-'
        }
      },
      handleSelectionChange(tableCol) {
        this.$emit('handleSelectionChange', tableCol)
      }
    },
  };
</script>

<style lang="less" scoped>

  /deep/ .el-table__row .el-button--mini {
    font-size: 13px !important;
    min-width: auto !important;
    padding: 0 !important;
  }

  .otstablenew {
    margin-top: 16px;
    padding: 24px;
    background: #fff;
  }

  .batchOperation {
    margin-bottom: 16px;
    ul {
      display: flex;
      li {
        a {
          display: block;
          margin-right: 24px;
          font-size: 14px;
          color: #6D6F73;
          i {
            margin-right: 8px;
          }
        }

      }
    }
  }

  /deep/ .el-table th > .cell {
    padding-left: 14px;
    padding-right: 14px;
  }

  .table-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .table-img-container:hover .big-img{
    display: block!important;
  }
  .table-img-container {
    .big-img {
      left: 0;
      position: absolute;
      z-index: 1000;
      img {
        width: 116px;
        height: 152px;
      }
    }
  }
</style>
