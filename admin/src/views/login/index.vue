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
				<Login v-if="isLoginPage" />
				<Register v-else />
				<div class="w-full mt-5">
					<div v-if="isLoginPage">
						还没有账号？
						<el-button type="text" @click="handleRegister">去注册</el-button>
					</div>
					<div v-else>
						已有账号？
						<el-button type="text" @click="handleLogin">去登录</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SloganIcon from './icons/slogan.vue'
import { ref } from 'vue'
import Login from './components/login.vue'
import Register from './components/register.vue'

const isLoginPage = ref(true)

const handleRegister = () => {
	isLoginPage.value = false
}
const handleLogin = () => {
	isLoginPage.value = true
}
</script>

<style lang="scss" scoped>
.login-background {
	background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
	filter: blur(100px);
}
</style>
