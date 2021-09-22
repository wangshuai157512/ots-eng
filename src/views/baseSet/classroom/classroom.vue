<template>
    <div class="ClassBox">
        <!-- 标题 -->
        <ots-main-title :mainTopBtn="mainTopBtnList"></ots-main-title>
        <!-- 搜索框 -->
        <div class="searchCon">
          <div class="searchMain">
            <ots-refer
                :selectList="selectList"
                :request-form="selectForm"
                @search="getResult"
            />
          </div>
        </div>
        <!-- 列表 -->
        <div class="mainCon">
          <ots-table-group
            :tableHeader="tableHeader"
            :tableOption="tableOption"
            :tableData="tableData"
            :batchOperBtn="batchOperBtn"
            @handleSelectionChange="bachOper"
            :pagination="pagination"
            @changeNum="changeSize"
            @changePage="changePage"
          ></ots-table-group>
        </div>
        <!-- 弹窗 -->
        <ots-custom-dialog :dialog.sync="addDialog" :title="form.id?'修改':'添加教室'" width="40%">
            <template v-slot:content>
                <div>
                    <el-form ref="form" :model="form" :rules="rules">
                        
                        <el-form-item label="所属考点"  prop="placeId">
                            <el-select v-model="form.placeId" placeholder="请选择">
                              <el-option
                                v-for="item in siteData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                            
                            <span class="col_blue ml16 cp" @click="addSite">新增考点</span>
                        </el-form-item>
                        
                        <el-form-item label="教室名称">
                          <div v-for="(item, index) in form.form_classList" :key="index" class="mb10">
                            <el-input class="long"  placeholder="请输入" v-model="item.name"></el-input>
                            <el-input class="short ml16" placeholder="坐位数" v-model="item.seatNumber">
                              <template slot="suffix">个</template>
                            </el-input>
                            <i v-if="index > 0" class="ml10 el-icon-delete col_blue cp" @click="deleteClassObj(index)"></i>
                          </div>
                          <p class="col_blue mt10 cp" v-show="!form.id" @click="addClassObj"><i class="el-icon-plus mr5"></i><span>增加教室</span></p>
                        </el-form-item>
                        <!-- <el-form-item label="启用状态">
                            <el-radio-group v-model="form.state">
                                <el-radio-button label=1>启用</el-radio-button>
                                <el-radio-button label=0>停用</el-radio-button>
                            </el-radio-group>
                        </el-form-item> -->
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round @click="addDialog=false">取消</el-button>
                <el-button round type="primary" @click="addClass">确定</el-button>
            </template>
        </ots-custom-dialog>
        <ots-custom-dialog :dialog.sync="importDialog" title="导入教室" width="40%">
            <template v-slot:content>
                <div class="exportDialog">
                    <el-form ref="exportForm" :model="importForm">
                        <el-form-item label="1.模板下载">
                            <span style="color:#006AFF;" @click="$getStaticFile('教室导入.xlsx')" class="cp">
                                <i class="el-icon-download"></i>
                                下载教室导入数据模板
                            </span>
                        </el-form-item>
                        <el-form-item label="2.教室名相同时处理方式">
                            <el-radio-group v-model="importForm.style">
                                <el-radio-button label=0>提示重复</el-radio-button>
                                <el-radio-button label=1>更新数据</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="3.选择文件" v-model="importForm.file">
                            <ots-upload-file :httpRequest="handleFormData" fileType="xlsx" />
                        </el-form-item>
                        
                    </el-form>
                    <div class="impExplain">
                        <span class="tipTitle"><i></i>提示：</span>
                        <div>
                            <div>1：模板中<span class="col_red">*</span>字段为必填项</div>
                            <div>2：只能上传扩展名为<span class="col_red">.xlsx</span>的文件；</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button round @click="importDialog=false">取消</el-button>
                <el-button round type="primary" @click="rightImport">确定</el-button>
            </template>
        </ots-custom-dialog>
    </div>
</template>
<script>
import { getAllClass, addClassFn, updateClassFn, deleteClassFn, updateClassStateFn, importClassFn } from '@/http/modules/baseSet/classroom'
import { getSelectPlace } from '@/http/modules/baseSet/examSite'
export default {
  name: 'classroom',
  data () {
    return {
      siteData: [],
      selectIds: [],
      selectList: [
        {
          title: "状态",
          type: "select",
          requestKey: "state",
          label: 'key',
          value: 'value',
          data: [
            {
              key : '全部',
              value : -1
            },
            {
              key : '启用',
              value : 1
            },
            {
              key : '停用',
              value : 0
            }
          ],
        },
        {
          title: "考点",
          type: "select",
          requestKey: "placeId",
          label: 'name',
          value: 'id',
          data: [],
        },
        {
          title : '教室名称',
          type : 'input',
          placeholder : '请输入教室名称',
          requestKey: "searchKey"
        }
      ],
      selectForm: {
        state : -1,
        searchKey : '',
        placeId: ''
      },
      tableHeader: [
          {
              title: "教室名称",
              prop: "name"
          },
          {
              title: "所属考点",
              prop: "placeName"
          },
          {
              title: "考位数量",
              prop: "seatNumber"
          },
          {
              title:"启用状态",
              prop:"state",
              type:"switch",
              switchChange:this.changeClassState
          },
          {
              title:"操作",
              type:"buttons",
              width:"100",
              btnList:[
                  {
                      title:"编辑",
                      click: this.editClass
                  },
                  {
                      title:"删除",
                      click: this.deleteClass
                  },
              ]
          }
      ],
      tableOption: {
          multiple:true
      },
      batchOperBtn:[
          // {
          //     title: "导出",
          //     icon: "iconfont icon-daochu",
          //     click: this.exportClass
          // },
          {
              title: "删除",
              icon: "iconfont icon-shanchu",
              click: this.deleteClass
          },
      ],
      tableData: [],
      form: {
        placeId: '',
        form_classList: [{name: '', seatNumber: '', state: 1}]
      },
      importForm: {
        file: '',
        style: 0
      },
      rules: {
        placeId: [
          { required: true, message: '请选择考点', trigger: 'change'}
        ]
      },
      mainTopBtnList: [
        {
          title: '新增',
          fn: this.addClassDialog,
          plain: true
        },
        {
          title: '导入',
          fn: this.importClassDialog
        }
      ],
      addDialog: false,
      importDialog: false,
      pagination: {
        total: 0
      },
      ClassListParams: {
        orders: 'createDate desc',
        page: 1, 
        size: 10
      }
    }
  },
  created () {
    // this.getAllClassFn()
    this.initSiteData()
  },
  mounted () {
    
  },
  methods: {
    addSite () {
      this.$router.push({
        name: 'addSite'
      })
    },
    async initSiteData () {
      const { data } = await getSelectPlace()
      this.siteData = data
      this.selectList[1].data = data

      // 判断是否从考点过来的
      this.dealFromSite()
      this.getAllClassFn()
    },
    dealFromSite () {
      // 判断是否从考点过来的
      if (this.$route.query && this.$route.query.type == 'add') {
        this.addDialog = true
        this.form.placeId = this.$route.query.siteId
      } else if (this.$route.query.type == 'search') {
        this.selectForm.placeId = this.$route.query.siteId
      }
    },
    bachOper (val) {
      let idList=[]
      val.forEach(item=>{
          idList.push(item.id)
      })
      this.selectIds = idList
    },
    addClassDialog () {
      this.resetForm()
      this.addDialog = true
    },
    importClassDialog () {
      this.importDialog = true
    },
    addClassObj () {
      let obj = {
        name: '',
        seatNumber: '',
        state: 1
      }
      this.form.form_classList.push(obj)
    },
    deleteClassObj (index) {
      this.form.form_classList.splice(index, 1)
    },
    addClass () {
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              
              let classList = this.form.form_classList.filter(item => item.name && parseFloat(item.seatNumber))
              if (classList.length < 1) {
                this.$message.error('请正确填写教室信息')
                return false
              }
              
              let params = {...this.form}
              
              for (let key in params) {
                  if (key.startsWith('form_')) {
                      delete params[key]
                  }
              }
              if (this.form.id) {
                params = Object.assign(params, classList[0])
              } else {// 新增
                params.classes = JSON.stringify(classList)
              }
              const useFn = params.id ? updateClassFn : addClassFn
              const { code } = await useFn(params)
              if (code ==  1) {
                this.$message.success('操作成功')
                this.addAfter()
              }
          } else {
              return false;
          }
      });
    },
    editClass (row) {
      console.log(row)
      let obj = {
        id: row.id,
        placeId: row.placeId,
        form_classList: [{
          name: row.name,
          seatNumber: row.seatNumber,
          state: row.state
        }]
      }
      this.form = Object.assign(this.form, obj)
      this.addDialog = true
    },
    beforeBatch () {
      if (this.selectIds.length > 0) {
        return true
      } else {
        this.$message.warning('请先选择教室')
        return false
      }
    },
    exportClass () {
      if (this.beforeBatch()) {

      }
    },
    deleteClass (row) {
      if (row || this.beforeBatch()) {
      } else {
        return false
      }
      let param = {
        ids: row ? row.id : this.selectIds.join()
      }
      this.$confirm('确定删除该教室?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await deleteClassFn(param)
          if (code == 1) {
            this.$message.success('删除成功')
            this.getAllClassFn()
          }
        }).catch(() => {        
        });
    },
    async changeClassState (row) {
      let param = {
        id: row.id,
        state: row.state
      }
      const { code } = await updateClassStateFn(param)
      if (code == 1) {
        this.$message.success('修改成功')
        // this.getAllClassFn()
      }
    },
    async getAllClassFn () {
      this.ClassListParams = Object.assign(this.ClassListParams, this.selectForm)
      const { data } = await getAllClass(this.ClassListParams)
      this.tableData = data.records
      this.pagination.total = data.total
    },
    resetForm() {
      this.form = {
        placeId: '',
        form_classList: [{name: '', seatNumber: '', state: 1}]
      }
    },
    addAfter () {
      this.addDialog = false
      this.resetForm()
      this.getAllClassFn()
    },
    changeSize(num) {
        this.ClassListParams.size=num
        this.getAllClassFn()
    },
    changePage(p) {
        this.ClassListParams.page=p
        this.getAllClassFn()
    },
    getResult () {
      this.ClassListParams.page = 1
      this.getAllClassFn()
    },
    handleFormData (val) {
        this.importForm.file = val.file
    },
    async rightImport () {
        if (!this.importForm.file) {
            this.$message.error('请选择文件')
            return
        }
        const fd = new FormData()
        for (let item in this.importForm) {
            fd.append(item,this.importForm[item])
        }
        const { code, data } = await importClassFn(fd)
        if (code == 1) {
            const failNum = data.errorCount ? parseInt(data.errorCount) : 0
            const totalNum = parseInt(data.allCount)
            const successNum = totalNum - failNum
            
            let message = `导入完成，成功导入${successNum}，失败人员数${failNum}`
            this.importDialog = false

            this.$confirm(message, '导入结果', {
                confirmButtonText: failNum > 0 ? '查看错误记录' :'确定',
                 cancelButtonText: '取消',
                type: failNum > 0 ? 'warning' :'success'
            }).then(async () => {
                if (failNum > 0) {
                    window.location.href = data.address
                }
            }).catch(() => {          
            });
            this.getAllClassFn()
        }
    },
  }
}
</script>
<style lang="less" scoped>
.ClassBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .searchCon {
    // padding: 20px;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    .searchMain {
      flex: 1;
    }
    .searchBtn {
      flex-shrink: 0;
      width: 72px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .mainCon {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    flex: 1;
  }
}
.tipIcon{
    position: relative;
    .tips {
      font-size: 13px;
      position: absolute;
      color: #fff;
      width: 176px;
      text-align: center;
      padding: 10px;
      top: -48px;
      left: -90px;
      background: rgba(0, 0, 0, 0.85);
    }
    .tips::after{
      content: '';
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.85);
      position: absolute;
      top: 33px;
      left: 96px;
    }
}
.el-input.long{
    width: 160px;
    height: 36px;
}
.el-input.short{
    width: 120px;
    height: 36px;
    /deep/ .el-input__suffix {
      right: 8px;
    }
    /deep/ .el-input__suffix{
      top: 10px;
    }
}
/deep/ .el-input__inner {
    padding: 8px !important;
}

</style>