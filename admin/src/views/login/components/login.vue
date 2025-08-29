<template>
	<div class="w-full">
		<div class="text-4xl font-bold mb-3">欢迎回来</div>
		<div class="text-base mb-6">请输入您的账户信息以开始管理您的项目</div>
	</div>
	<div class="w-full">
		<el-form ref="loginFormRef" label-width="80px" :model="loginForm" :rules="loginRules">
			<el-form-item label="账号" prop="username">
				<el-input v-model="loginForm.username" placeholder="请输入用户名" />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
			</el-form-item>
			<el-button class="w-full mt-10" type="primary" @click="handleLogin(loginFormRef)">登录</el-button>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus'
import { ref } from 'vue'
import { user } from '@/api'

const loginFormRef = ref(null)

const loginForm = ref({
	username: '',
	password: ''
})
const loginRules = ref({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录
const handleLogin = async (formEl: FormInstance | null) => {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			const { username, password } = loginForm.value
			const fetchData = {
				username,
				password
			}

			user.login(fetchData).then((res) => {
				if (res.data.code === 200) {
					ElMessage.success('登录成功')
				}
			})
		}
	})
}
</script>

<style lang="scss" scoped></style>
