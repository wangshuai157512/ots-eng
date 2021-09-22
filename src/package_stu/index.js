
import StuMainTitle from './StuMainTitle'
const packages = [
    StuMainTitle,
]

const install = Vue => {
    packages.forEach(item => {
        Vue.component(item.name,item)
    })
}

export default install
