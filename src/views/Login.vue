<script setup name="Login">
import { ref, h, resolveComponent } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const form = ref({
  username: 'admin',
  password: '123456'
})
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ min: 6, message: '密码不能少于6位', trigger: 'blur' }]
})
const SvgIcon = resolveComponent('SvgIcon')
const User = h(SvgIcon, { name: 'login-user' })
const Password = h(SvgIcon, { name: 'login-password' })
const loading = ref(false)
const formEl = ref()
const store = useUserStore()
const router = useRouter()

const handleLogin = () => {
  formEl.value
    .validate()
    .then(() => {
      loading.value = true
      return store.loginAct(form.value)
    })
    .then(({ message }) => {
      loading.value = false
      ElMessage.success(message)
      router.push('/')
    })
    .catch((err) => {
      console.log(err)
      loading.value = false
    })
}
</script>

<template>
  <div class="container">
    <el-form :model="form" :rules="rules" size="large" class="form" ref="formEl">
      <div class="header">
        <h3>用户登录</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          :prefix-icon="User"
          v-model="form.username"
          type="text"
          placeholder="username"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :prefix-icon="Password"
          v-model="form.password"
          type="password"
          placeholder="password"
          show-password
        />
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" :loading="loading" @click="handleLogin">登 录</el-button>
      </el-form-item>
      <div class="sub-btn">
        <el-link href="/register">注册</el-link>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: $bg;
  :deep(.form) {
    margin-top: 160px;
    width: 420px;
    .header {
      text-align: center;
      font-size: 26px;
      margin-bottom: 40px;
      color: $light_gray;
    }
    .el-input__wrapper {
      background: rgba(0, 0, 0, 0.1);
      input {
        color: $light_gray;
        caret-color: $cursor;
      }
    }
    .btn .el-button {
      width: 100%;
    }
    .sub-btn {
      text-align: center;
    }
  }
}
</style>
