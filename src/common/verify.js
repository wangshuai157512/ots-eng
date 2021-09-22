export const checkEnglishName = (rule, value, callback)=> {
    if(value) {
        let reg = new RegExp("^[a-zA-Z]+$")
        if(!reg.test(value)) {
            callback(new Error('输入内容必须未纯英文'))
        }else {
            callback();
        }
    }
    callback();
}
export function checkPwd (rule, value, callback) {
    var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/
    if (value) {
      if (!reg.test(value)) {
        callback(new Error('长度在6-20之间，以字母开头且只能包含字母和数字'));
      } else {
        callback();
      }
    }
    callback();

}

export const checkPhone = (rule, value, callback) => {
  let phoneReg = /^1[3456789]\d{9}$/
  if (phoneReg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号格式错误'))
  }
}

export function checkCardId (rule,value,callback,itemValue) {
  if (itemValue === '1') {
    let cardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    if (cardReg.test(value)) {
      callback()
    } else {
      callback(new Error('身份证格式错误'))
    }
  } else {
    callback()
  }
}
