<template>
    <div>
        <div class="stuMainTitle">
            <span class="title">{{$route.meta.title}}</span>
        </div>
    </div>
</template>


<script>
export default {
    name:"StuMainTitle",
    props: {
        mainTopBtn:{
            type:Array,
            default:()=> {

            }
        },
        mainSearch: {
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            // pageTitle:"",
            inputValue:"",
            oldInputValue: "",
            breadList: [],
        }
        
    },
    compouted: {
        
    },
    mounted() {
        // console.log(this.$route.matched)
        // this.pageTitle = this.$route.meta.title
        // this.breadList = this.$route.matched.filter(item => { return item.name !== 'Home'})
    },
    methods: {
        handleSearch () {
            if (this.inputValue == this.oldInputValue) {
                return
            }
            this.oldInputValue = this.inputValue
            this.$emit('searchFn', this.oldInputValue)
        }
    }
}
</script>

<style lang="less" scoped>
.stuMainTitle {
    font-size: 20px;
    height: 52px;
    line-height: 52px;
    font-weight: bold;
    border-bottom: 1px solid #DADDE6;
}
</style>