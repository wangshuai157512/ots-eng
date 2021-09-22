<template>
    <div>
        <ots-main-title></ots-main-title>
		
		<div>
		    <el-form ref="form" :model="form" :rules="rules">
		        <el-form-item label="输入内容"  prop="sqlString">
		            <el-input :rows="10" type="textarea" v-model="form.sqlString" placeholder="请输入"></el-input>
		        </el-form-item>
				<el-button round type="primary" @click="e">确定</el-button>
		    </el-form>
		</div>	
			<div id="divlist" v-html="form.result" style="overflow:auto;width:auto;height:800px;">
				{{form.result}}
			</div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
		   form: {
		     sqlString: '',
			 result:''
		   },
		   rules: {
		     name: [
		       { required: true, message: '请输入', trigger: 'blur'},
		     ]
		   }
        }
    },
    methods: {
		e () {
		  this.$refs['form'].validate(async (valid) => {
		      if (valid) {
		          let params = {...this.form}
		          for (let key in params) {
		              if (key.startsWith('form_')) {
		                  delete params[key]
		              }
		          }
				  this.form.result = ''; 
				  this.$api.system.systemM(params).then(res => {
				  	if (res.code) {
						var aHeadNameList = [];
						var oComSel = res.data;
						 if(oComSel.length>0){
							 var str ="<table border='1px' class='divtable'>";
							 var sHeadDef = "<thead>";
							 var sTbodyDef = "<tbody>";
							 var sTrDef = "<tr>";
							 var jsonObj = oComSel[0];
							 var sTody = "",sHead="";
							 var oTR  = "";
							 for(var item in jsonObj){ 
								 aHeadNameList.push(item);
							 }
							 for(var j =0;j<aHeadNameList.length;j++){
								 sHead +="<td class='w150'>"+aHeadNameList[j]+"</td>";
							 }
							 for(var i=0;i<oComSel.length;i++){
								 oTR+="<tr>";
								 sTody = "";
								 for(var j =0;j<aHeadNameList.length;j++){
									 sTody +="<td>"+oComSel[i][aHeadNameList[j]]+"</td>";
								 }
								 oTR +=sTody+"</tr>";
							 }
							 sHeadDef += sHead+"</tr></thead>";
							 sTbodyDef+=  oTR+"</tbody>";
							 str +=sHeadDef + sTbodyDef +"</table>";
							 this.form.result = str; 
						 }
				  	}
				  })
		      } else {
		          return false;
		      }
		  });
		}
    },
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
	 .w150{width:300px;}
	 .divtable tr td{line-height:26px;border:1px solid #000000;}

 }

</style>