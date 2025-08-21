<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'default' | 'large'>('default')
const zIndex = ref<number>(3000)
</script>

<template>
	<el-config-provider :size="size" :z-index="zIndex">
		<RouterView />
	</el-config-provider>
</template>

<style scoped></style>
