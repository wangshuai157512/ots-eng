import OtsUploadFile from './OtsUploadFile'
import OtsCustomDialog from './OtsCustomDialog'
import OtsMainTitle from './OtsMainTitle'
import LayoutOne from './LayoutOne'
import OtsTable from './OtsTable'
import OtsPagination from './OtsPagination'
import OtsTableGroup from './OtsTableGroup'
import OtsRefer from './OtsRefer'
import OtsTableNew from './OtsTableNew'
import OtsTableGroupNew from './OtsTableGroupNew'
import OtsPopPro from './OtsPopPro'
const packages = [
    OtsUploadFile,
    OtsCustomDialog,
    OtsMainTitle,
    LayoutOne,
    OtsTable,
    OtsPagination,
    OtsTableGroup,
    OtsRefer,
    OtsTableNew,
    OtsTableGroupNew,
]

const install = Vue => {
    Vue.use(OtsPopPro)
    packages.forEach(item => {
        Vue.component(item.name,item)
    })
}

export default install
