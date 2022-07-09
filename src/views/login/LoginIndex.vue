<template>
  <!-- login/register container -->
  <div class="login_container">
    <div class="container" :class="{active:active}">
        <!-- register -->
        <div class="form-container sign-up-container">
            <div class="form">
                <h2>注册</h2>
                <div class="email-container">
                  <input class="email" type="email" placeholder="请输入您的QQEmail..." v-model="email">
                  <input @click="getCode" class="get-code" :value="time" type="button">
                </div>
                <input type="text" placeholder="请输入验证码" v-model="validateCode">
                <input type="password" placeholder="请输入7至15位的密码" v-model="password">
                <input type="password"  placeholder="请重复输入密码" v-model="repeatPassword">
                <button class="signUp" @click="reguser">注册</button>
            </div>
        </div>
        <!-- login -->
        <div class="form-container sign-in-container">
            <div class="form">
                <h2>登入</h2>
                <input type="email" placeholder="请输入您的QQEmail..." v-model="email">
                <input type="password"  placeholder="请输入7至15位的密码" v-model="password">
                <a href="javascript:;" class="forget-password">忘了密码？</a>
                <button class="signIn" @click="login">登入</button>
            </div>
        </div>
        <!-- overlay container -->
        <div class="overlay_container">
            <div class="overlay">
                <!-- overlay left -->
                <div class="overlay_panel overlay_left_container">
                    <h2>欢迎回来！</h2>
                    <p>要与我们保持联系，请使用您的个人信息登录</p>
                    <button id="sign-in" @click="removeActive">登入</button>
                </div>
                <!-- overlay right -->
                <div class="overlay_panel overlay_right_container">
                    <h2>hello friend!</h2>
                    <p>注册你的账号，开始吧</p>
                    <button id="sign-up" @click="addActive">注册</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { userLogin, userCode, userReguser } from '@/API/user'
import { debounce } from 'lodash'
import { ElMessage } from 'element-plus'
const active = ref(false) // 控制active类的添加和去除
const email = ref('') // email
const password = ref('') // 密码
const repeatPassword = ref('') // 重复密码
const validateCode = ref('') // 验证码
const time = ref('获取验证码') // 验证码的提示文字
const i = ref(60) // 验证码的有效时间
// 增加active类
function addActive () {
  active.value = true
  email.value = ''
  password.value = ''
}
// 去除active类
function removeActive () {
  active.value = false
  email.value = ''
  password.value = ''
  repeatPassword.value = ''
  validateCode.value = ''
}
// 获取验证码
const getCode = debounce(async function () {
  try {
    const { data } = await userCode(email.value)
    const { message, status } = data
    // 成功发送验证码
    if (status === 0) {
      const timer = setInterval(function () {
        time.value = `还剩${i.value}秒`
        i.value--
        if (i.value <= 0) {
          time.value = '请获取验证码'
          i.value = 60
          clearInterval(timer)
        }
      }, 1000)
    } else {
      ElMessage.error(message)
    }
  } catch (error) {
    ElMessage.error(`${error}`)
  }
}, 500)
// 登入
const login = debounce(async function () {
  try {
    const { data: results } = await userLogin(email.value, password.value)
    const { message, data, status } = results
    // 登入成功
    if (status === 0) {
      localStorage.setItem('token', data.token)
      email.value = ''
      password.value = ''
      ElMessage.success(message)
    } else {
      ElMessage.error(message)
    }
  } catch (error) {
    ElMessage.error(`${error}`)
  }
}, 500)
// 注册
const reguser = debounce(async function () {
  try {
    const { data } = await userReguser({ email: email.value, password: password.value, repeatPassword: repeatPassword.value, validateCode: validateCode.value })
    const { message, status } = data
    // 用户注册成功
    if (status === 0) {
      ElMessage.success(message)
      email.value = ''
      password.value = ''
      repeatPassword.value = ''
      validateCode.value = ''
    } else {
      ElMessage.error(message)
    }
  } catch (error) {
    ElMessage.error(`${error}`)
  }
}, 500)
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.login_container{
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 480px;
  background-image: url(./img/bg.png);
  background-size: 100% 100%;
}
h2 {
    margin-bottom: 10px;
    font-size: 32px;
    text-transform: capitalize;
}

.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 51%;
    height: 480px;
    background-color: white;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
}

.form-container {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    background-image: linear-gradient(to right, #ecaf49 , #f5d566);
    transition: all 0.6s ease-in-out;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 0 50px;
}

input {
    width: 100%;
    margin: 8px 0;
    padding: 12px;
    background-color: #eee;
    border: none;
    outline: none;
    border-radius: 12px;
     &:hover{
      box-shadow: 0 0 10px #ecaf49 inset,0 0 30px #ecaf49;
    }
}

.forget-password {
    display: inline-block;
    height: 20px;
    text-decoration: none;
    color: #fff;
    text-transform: capitalize;
    font-size: 12px;
}

.forget-password:hover {
    color: lightslategray;
}

button {
    background: #ecaf49;
    padding: 10px 50px;
    border: 1px solid white;
    border-radius: 20px;
    text-transform: uppercase;
    color: white;
    margin-top: 10px;
    outline: none;
    transition: transform 80;
    &:hover{
      cursor: pointer;
      border-color: #e29818;
    }
}

button:active {
    transform: scale(0.95);
}

.overlay_container {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    z-index: 100;
    right: 0;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
}

.overlay {
    position: absolute;
    width: 200%;
    height: 100%;
    left: -100%;
     background-image: linear-gradient(to right, #1d6e67 , #144245);
    filter: blur(1);
}

.overlay_panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    color: white;
    padding: 0 40px;
    text-align: center;
}

.overlay_panel button {
    background-color: transparent;
    border: 1px solid white;
    &:hover{
      border-color: #2f969d;
    }
}

.overlay_panel p {
    font-size: 12px;
    margin: 10px 0 15px 0;
}

.overlay_right_container {
    right: 0;
}

.container.active .sign-up-container {
    transform: translateX(100%);
    z-index: 5;
    background-image: linear-gradient(to right, #1d6e67 , #144245);

}

.container.active .sign-in-container {
    transform: translateX(100%);
}

.container.active .overlay_container {
    transform: translateX(-100%);
}

.container.active .overlay {
    transform: translateX(50%);
}
.get-code{
 flex: 20%;
 margin: 0;
border-radius:0;
padding: 12px;

}
.email{
margin: 0;
border-radius:0;
&:hover{
  box-shadow: none;
}
}
.email-container{
  display: flex;
  width: 100%;
  height: 40px;
  overflow: hidden;
  border-radius: 12px;
  overflow: hidden;
  margin: 8px 0;
  background-color: #eee;
   &:hover{
       box-shadow: 0 0 10px #ecaf49 inset,0 0 30px #ecaf49;
    }
}
.signUp,#sign-up{
 background-image: linear-gradient(to right, #1d6e67 , #144245);
}
.signIn,.overlay_left_container{
   background-image: linear-gradient(to right, #ecaf49 , #f5d566);
}
#sign-in{
  &:hover{
    border-color: #e29818;
  }
}
.signUp{
&:hover{
    border-color: #2f969d;
  }
}
</style>
