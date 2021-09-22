import mainUrl from './main_url'
const baseUrlConfig = {
    'development' : '/dev/api/sign/',
    // 'test' : 'http://172.16.6.130:8080/oxer',
    'production' : `${mainUrl}/api/sign/`,
}
const getBaseurl = mode => baseUrlConfig[mode];
const domainName = getBaseurl(process.env.NODE_ENV)
let environment = process.env.NODE_ENV === 'development'?'/dev':mainUrl

// 登录
export const testLogin = domainName + 'auth/login'
export const outLogin = `${environment}/logout`
export const imageCheckCodeOne = `${environment}/imageCheckCode`
export const editPsd = domainName + 'auth/changePwd'
export const verification = domainName + 'auth/verification'
export const queryInfo = domainName + 'auth/queryInfo'



// 学校
export const addSchool = domainName + 'school/addSchool'
export const updateSchool = domainName + 'school/updateSchool'
export const deleteSchool = domainName + 'school/deleteSchool'
export const updateSchoolState = domainName + 'school/updateSchoolState'
export const querySchool = domainName + 'school/querySchool'
export const querySchoolList = domainName + 'school/querySchoolList'
export const queryAllSchool = domainName + 'school/queryAllSchool'

// 函授站
export const addStation = domainName + 'station/addStation'
export const updateStation = domainName + 'station/updateStation'
export const deleteStation = domainName + 'station/deleteStation'
export const updateStationState = domainName + 'station/updateStationState'
export const queryStation = domainName + 'station/queryStation'
export const queryStationList = domainName + 'station/queryStationList'
export const queryAllStation = domainName + 'station/queryAllStation'

// 专业
export const addSubject = domainName + 'subject/addSubject'
export const updateSubject = domainName + 'subject/updateSubject'
export const deleteSubject = domainName + 'subject/deleteSubject'
export const updateSubjectState = domainName + 'subject/updateSubjectState'
export const querySubject = domainName + 'subject/querySubject'
export const querySubjectList = domainName + 'subject/querySubjectList'
export const queryAllSubject = domainName + 'subject/queryAllSubject'
export const importSubject = domainName + 'subject/importSubject'

// 课程
export const addCourse = domainName + 'course/addCourse'
export const updateCourse = domainName + 'course/updateCourse'
export const deleteCourse = domainName + 'course/deleteCourse'
export const updateCourseState = domainName + 'course/updateCourseState'
export const queryCourse = domainName + 'course/queryCourse'
export const queryCourseList = domainName + 'course/queryCourseList'
export const queryAllCourse = domainName + 'course/queryAllCourse'
export const getPlanCourse = domainName + 'planCourse/getPlanCourse'

// 考点
export const addPlace = domainName + 'place/addPlace'
export const updatePlace = domainName + 'place/updatePlace'
export const deletePlace = domainName + 'place/deletePlace'
export const updatePlaceState = domainName + 'place/updatePlaceState'
export const queryPlace = domainName + 'place/queryPlace'
export const queryPlaceList = domainName + 'place/queryPlaceList'
export const queryAllPlace = domainName + 'place/queryAllPlace'
export const importPlace = domainName + 'place/importPlace'

// 教室
export const addClass = domainName + 'class/addClass'
export const updateClass = domainName + 'class/updateClass'
export const deleteClass = domainName + 'class/deleteClass'
export const updateClassState = domainName + 'class/updateClassState'
export const queryClass = domainName + 'class/queryClass'
export const queryClassList = domainName + 'class/queryClassList'
export const importClass = domainName + 'class/importClass'

// 考试批次
export const addPlan = domainName + 'plan/addPlan'
export const deletePlan = domainName + 'plan/deletePlan'
export const editPlan = domainName + 'plan/editPlan'
export const editPlanState = domainName + 'plan/editPlanState'
export const getList = domainName + 'plan/getPlanList'
export const getPlan = domainName + 'plan/getPlan'
// export const getCurrentPlan = domainName + 'plan/getCurrentPlan'
export const getSelectPlan = domainName + 'plan/getSelectPlan'
export const getPlanCode = domainName + 'plan/getPlanCode'
export const getPlanStudent = domainName + 'planRegion/getPlanRegionList'
export const regionImport = domainName + 'planRegion/regionImport'
export const deleteRegion = domainName + 'planRegion/deleteRegion'
export const editRegion = domainName + 'planRegion/editRegion'
export const queryPaperByCourseCode = domainName + 'planClass/queryPaperByCourseCode'

// 场次设置
export const getSessionAddName = domainName + 'planSession/getSessionAddName'
export const addSession = domainName + 'planSession/addSession'
export const editSession = domainName + 'planSession/editSession'
export const deleteSession = domainName + 'planSession/deleteSession'
export const getPlanSessionList = domainName + 'planSession/getPlanSessionList'
export const getPlanPlaceList = domainName + 'planSession/getPlanPlaceList'
export const getEditSession = domainName + 'planSession/getEditSession'

// 考场安排
export const getClassList = domainName + 'planSession/getClassList'
export const setStudentClass = domainName + 'planStudent/setStudentClass'
export const getClassStudentList = domainName + 'planStudent/getClassStudentList'
export const exportStudent = domainName + 'planStudent/exportStudent'
export const getStudentViewInfo = domainName + 'planStudent/getStudentViewInfo'
export const publishPlanClass = domainName + 'planSession/publishPlanClass'

// 成绩管理
export const getPlanCoursePublish = domainName + 'studentCourse/getPlanCoursePublish'
export const publishStudentScore = domainName + 'studentCourse/publishStudentScore'
export const getStudentScoreList = domainName + 'studentCourse/getStudentScoreList'
export const getOtsUrl = domainName + 'studentCourse/getOtsUrl'

// 准考证
export const entrancePrint = domainName + 'entrance/entrancePrint'
export const certificatePrint = domainName + 'entrance/certificatePrint'
// 成绩查询
export const score = domainName + 'signUp/score'
export const getResultList = domainName + 'signUp/getResultList'
// 账户设置
export const updateInfo = domainName + 'signUp/updateInfo'
// 缴费
export const selectPayInfo = domainName + 'payment/selectPayInfo'
export const cashierInfo = domainName + 'payment/cashierInfo'

// 报缴信息管理
export const savePhoto = domainName + 'photo/savePhoto'
export const selectList = domainName + 'registration/selectList'
export const del = domainName + 'registration/delete'
export const registerUser = domainName + 'signUp/registerUser'
export const addStudengt = domainName + 'registration/addStudengt'
export const planStudentImport = domainName + 'planStudent/planStudentImport'
export const studentExport = domainName + 'planStudent/studentExport'
export const selectOneSignUp = domainName + 'registration/selectOneSignUp'
export const UpdateRegistration = domainName + 'signUp/UpdateRegistration'
export const batchImportUserPhoto = domainName + 'photo/batchImportUserPhoto'
export const getCurrentPlan = domainName + 'plan/getCurrentPlan'

// 报名审核
export const examineList = domainName + 'registration/examineList'
export const examine = domainName + 'registration/examine'
export const examineByOne = domainName + 'registration/examineByOne'
export const batchExamine = domainName + 'registration/batchExamine'
export const selectByOne = domainName + 'signUp/selectByOne'

// 系统配置
export const getConfigData = domainName + 'config/getConfigData'
export const addConfig = domainName + 'config/addConfig'

export const execute = domainName + 'operate/execute'

//报考
export const registerAgain = domainName  + 'signUp/registerAgain'
