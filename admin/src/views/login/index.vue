<template>
	<div class="app-container">
		<div class="flex h-full">
			<div class="flex flex-col flex-auto">
				<div class="login-background absolute left-0 top-0 size-full"></div>
				<div class="flex-none h-[120px]">logo</div>
				<div class="flex-1 flex flex-col items-center justify-center">
					<SloganIcon class="animate-float h-64 w-2/5" />
				</div>
			</div>
			<div class="flex-none w-120">右</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SloganIcon from './icons/slogan.vue'
</script>

<style lang="scss" scoped>
.login-background {
	background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
	filter: blur(100px);
}
</style>
