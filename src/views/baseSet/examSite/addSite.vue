<template>
    <div>
        <layout-one>
          <el-form :model="form" label-width="100px" :inline="true" ref="form" :rules="rules">
            <div class="section">
              <h4>基本信息</h4>
              <div class="sectionBox">
                  <el-form-item label="考点名称" prop="name">
                      <el-input placeholder="请输入" v-model="form.name"></el-input>
                  </el-form-item>
              </div>
              <div class="sectionBox">
                  <el-form-item label="启用状态" :required="true">
                      <el-radio-group v-model="form.state">
                          <el-radio-button label=1>启用</el-radio-button>
                          <el-radio-button label=0>停用</el-radio-button>
                      </el-radio-group>
                  </el-form-item>
              </div>
              <div class="sectionBox">
                  <el-form-item label="联系人">
                      <el-input placeholder="请输入" v-model="form.contact"></el-input>
                  </el-form-item>
              </div>
              <div class="sectionBox">
                  <el-form-item label="联系人电话">
                      <el-input placeholder="请输入" v-model="form.phone"></el-input>
                  </el-form-item>
              </div>
            </div>
            <div class="section mt20">
              <h4>关联函授站</h4>
              <div class="sectionBox">
                  <el-form-item label="请选择">
                      <div class="stationBox">
                        <div class="stationTop">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <div class="searchCourse ml30">
                                <el-input  placeholder="快捷搜索" v-model="stationStr"></el-input>
                                <div class="searchPos">
                                    <i class="iconfont icon-sousuo"></i>
                                </div>   
                            </div>
                        </div>
                        <el-checkbox-group v-model="form.form_stationIds" @change="handleCheckedCitiesChange">
                          <el-checkbox v-for="station in stationSelectData" :label="station.id" :key="station.id" :title="station.name">{{station.name}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                  </el-form-item>
              </div>
            </div>
            <div class="section mt20">
              <h4>地址信息</h4>
              <div class="sectionBox">
                  <el-form-item label="所属区域">
                      <el-select v-model="form.province" placeholder="请选择省">
                        <el-option
                          v-for="item in provinceData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.city" placeholder="请选择" class="ml20">
                        <el-option
                          v-for="item in cityData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                      <el-select v-model="form.county" placeholder="请选择" class="ml20">
                        <el-option
                          v-for="item in countyData"
                          :key="item.code"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                  </el-form-item>
              </div>
              <div class="sectionBox">
                  <el-form-item label="详细地址" prop="address">
                      <el-input class="lang" placeholder="请输入" v-model="form.address"></el-input>
                  </el-form-item>
              </div>
              <div class="sectionBox">
                  <el-form-item label="坐标">
                      <el-input class="lang"  v-model="form.site"></el-input>
                  </el-form-item>
              </div>
              <div id="mapContainer">
              </div>
            </div>
          </el-form>
        </layout-one>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { AllStation } from '@/http/modules/baseSet/station'
import { addPlaceFn, getSinglePlace, updatePlaceFn } from '@/http/modules/baseSet/examSite'
var cityData = require('./citys.json')
export default {
  name: 'addSite',
  data () {
    return {
      saveMethods: 'addOrEdit',
      backMethods: 'cancelPage',
      isEdit: false,
      checkAll: false,
      isIndeterminate: true,
      checkedCities: [],
      stationStr: '',
      stationData: [],
      provinceData: cityData,
      cityData: cityData[0].cityList,
      countyData: cityData[0].cityList[0].areaList,
      form: {
        name: '',
        state: 1,
        contact: '',
        phone: '',
        province: '',
        city: '',
        county: '',
        address: '',
        site: '',
        form_stationIds: []
      },
      rules: {
        name: [
          {required: true, message: '请填写考点名称', trigger: 'blur'},
        ],
        contact: [
          {required: true, message: '请填写联系人', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请填写考点地址', trigger: 'blur'},
        ]
      }
    }
  },
  computed: {
      stationSelectData () {
        if (this.stationStr) {
            return this.stationData.filter(item => item.name.indexOf(this.stationStr) > -1)
        }
        return this.stationData
      }
  },
  watch: {
    'form.province' (val) {
      this.cityData = this.provinceData.filter(item  => item.name == val)[0] ? this.provinceData.filter(item  => item.name == val)[0].cityList : []
      if (this.cityData.length) {
        this.form.city = this.cityData[0].name
      }
    },
    'form.city' (val) {
      this.countyData = this.cityData.filter(item  => item.name == val)[0] ? this.cityData.filter(item  => item.name == val)[0].areaList : []
      if (this.countyData.length) {
        this.form.county = this.countyData[0].name
      }
    },
  },
  created () {
    this.initStatus()
    this.initSelect()
    this.initStationData()
    
  },
  methods: {
    ...mapMutations(['SAVE_PAGE_THIS']),
    async addOrEdit () {
      
      this.$refs['form'].validate(async (valid) => {
          if (valid) {
              let params = {...this.form}
              params.stationIds = params.form_stationIds.join()
              for (let key in params) {
                if (key.startsWith('form_')) {
                  delete params[key]
                }
              }
              const dealFn = this.isEdit ? updatePlaceFn : addPlaceFn
              const { code } = await dealFn(params)
              if (code ==  1) {
                this.$otsPopPro({
                    content: this.isEdit ? '修改成功' : '添加成功',
                    cancelName: '返回',
                    okName: this.isEdit ? '查看' : '去添加教室'
                }).then(() => {
                  if (!this.isEdit) {
                      this.$router.push({
                        name: 'classroom'
                      })
                  } else {
                    this.goIndex()
                  }
                }).catch(() => {
                    this.goIndex()
                })
              }
          } else {
              return false;
          }
      })
    },
    cancelPage () {
      this.$router.go(-1)
    },
    goIndex () {
        this.$router.push({
            name: 'examSite'
        })
    },
    async initStatus () {
      if (this.$route.query.id) {
        this.isEdit = true
        let id = this.$route.query.id
        const { data } = await getSinglePlace({id: id})
        console.log(data)
        for (let item in this.form) {
          this.form[item] = data[item] ? data[item] : this.form[item]
        }
        this.form.id = data.id
        this.form.form_stationIds = data.stationMap.map(item => item.id)
      }
    },
    async initStationData () {
      const { data } = await AllStation()
      this.stationData = data
    },
    initSelect () {
      this.form.province = this.provinceData[0].name
      this.form.city = this.cityData[0].name
      this.form.county = this.countyData[0].name
    },
    handleProvince (obj) {
      console.log(obj)
      this.cityData = obj.cityList
    },
    initMap() {
        let that = this
        //定义地图中心点坐标
        var center = new TMap.LatLng(39.984120, 116.307484)
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        this.map = new TMap.Map(document.getElementById('mapContainer'), {
            center: center,//设置地图中心点坐标
            zoom: 17.2,   //设置地图缩放级别
            pitch: 43.5,  //设置俯仰角
            rotation: 45,    //设置地图旋转角度
            // viewMode: '2D'
        });
        this.map.on("click",function(evt){
            var lat = evt.latLng.getLat().toFixed(6);
            var lng = evt.latLng.getLng().toFixed(6);
            that.form.site = lat + "," + lng;
        })
        
    },
    handleCheckAllChange(val) {
      console.log(val)
      let allData = this.stationSelectData.map(item => item.id)
      // console.log(allData)
      this.form.form_stationIds = val ? allData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.stationSelectData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.stationSelectData.length;
    }
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy()
    }
  },
  mounted () {
    this.SAVE_PAGE_THIS(this)
    this.initMap()
    
  }
}
</script>
<style lang="less" scoped>
#mapContainer {
    /*地图(容器)显示大小*/
    width:1200px;
    height:400px;
    margin-bottom: 30px;
}
.section {
  border-bottom: 1px solid #F1F2F5;
  h4{
    margin-bottom: 30px;
  }
  .sectionBox {
      .lang {
        width: 512px;
      }
  }
  .stationBox {
      width: 1000px;
      max-height: 300px;
      background-color: #F8F9FC;
      overflow-y: auto;
      padding: 20px;
      .stationTop {
        display: flex;
        margin-bottom: 20px;
      }
      .searchCourse {
          position: relative;
          /deep/ .el-input{
              width: 240px;
              .el-input__inner {
                  height: 32px!important;
                  line-height: 32px!important;
                  border-radius: 40px!important;
              }
          }
          .searchPos {
              width: 40px;
              height: 18px;
              line-height: 18px;
              border-left: 1px solid #E1E6ED;
              position: absolute;
              right: 0;
              top: 11px;
              color: #C2C6CC;
              font-size: 14px;
              i {
                  margin-left: 10px;
                  cursor: pointer;
              }
          }
      }
  }
  /deep/ .el-form-item {
      margin-bottom: 30px!important;
  }
  /deep/ .el-radio-button__inner {
      margin-right: 16px;
      color: #45494D!important;
      background: #F4F5F8!important;
      font-size: 13px;
      border-radius: 4px!important;
      border: 1px solid #DADDE6!important;
      width: 64px;
      height: 32px;
      line-height: 32px;
      padding: 0;
  }
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background: #EBF5FF!important;
      border: 1px solid #006AFF!important;
      color: #006AFF!important;
      box-shadow:none;
  }
  /deep/ .el-checkbox {
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
  }
}

</style>