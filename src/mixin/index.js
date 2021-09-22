export default {
    data() {
        return {
            showFooterPage:['systemSet','applyManageAdd', 'addSite', 'addBatch', 'addSection', 'editSection', 'classSet', 'score'],
            timer: null
        }
    },
    methods:{
        clearTimer() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
        },
       
    },
}