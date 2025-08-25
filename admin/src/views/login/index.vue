<template>
	<div class="app-container">
		<div class="flex h-full">
			<div class="flex flex-col flex-auto relative mr-20">
				<div class="login-background absolute left-0 top-0 size-full"></div>
				<div class="flex-none h-16">logo</div>
				<div class="flex-1 flex-col-center">
					<SloganIcon class="animate-float h-64 w-2/5" />
				</div>
			</div>
			<div class="flex-none w-120 flex-col-center px-6 py-10 relative z-[2] bg-white border-l border-l-white">
				<div class="w-full">
					<div class="text-4xl font-bold mb-3">欢迎回来</div>
					<div class="text-base mb-6">请输入您的账户信息以开始管理您的项目</div>
				</div>
				<div class="w-full">
					<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
						<el-form-item label="账号" prop="username">
							<el-input v-model="loginForm.username" placeholder="请输入用户名" />
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
						</el-form-item>
						<el-button class="w-full mt-10" type="primary">登录</el-button>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SloganIcon from './icons/slogan.vue'
import { ref } from 'vue'

const loginFormRef = ref(null)
const loginForm = ref({
	username: '',
	password: ''
})
const loginRules = ref({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
</script>

<style lang="scss" scoped>
.login-background {
	background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
	filter: blur(100px);
}
</style>
