import { userAjax } from '@/axios/ajax'
// 登入的接口
export const userLogin = (email:string, password:string) => { return userAjax.post('/login', { email, password }) }
export const userCode = (email:string) => { return userAjax.get('/getCode', { params: { email } }) }
export const userReguser = (data:{email:string, validateCode:string, password:string, repeatPassword:string}) => { return userAjax.post('/reguser', data) }
