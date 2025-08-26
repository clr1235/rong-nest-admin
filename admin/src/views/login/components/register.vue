<template>
	<div class="w-full">
		<div class="text-4xl font-bold mb-3">创建一个账号</div>
		<div class="text-base mb-6">让您的应用程序管理变得简单而有趣</div>
	</div>
	<div class="w-full">
		<el-form ref="registerformRef" label-width="80px" :model="registerForm" :rules="registerRules">
			<el-form-item label="账号" prop="username">
				<el-input v-model="registerForm.username" placeholder="请输入用户名" />
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="registerForm.password" placeholder="请输入密码" type="password"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input v-model="registerForm.password2" placeholder="请再次输入密码" type="password"></el-input>
			</el-form-item>
			<el-button class="w-full mt-10" type="primary" @click="handleRegister(registerformRef)">注册</el-button>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
const registerformRef = ref(null)

const registerForm = ref({
	username: '',
	password: '',
	password2: ''
})
const registerRules = ref({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	password2: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleRegister = async (formEl: FormInstance | null) => {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			const { username, password } = registerForm.value
			const fetchData = {
				username,
				password
			}
			axios.post('http://localhost:3000/api/user/register', fetchData).then((res) => {
				if (res.data.code === 200) {
					ElMessage.success('注册成功')
				}
			})
		}
	})
}
</script>

<style lang="scss" scoped></style>
