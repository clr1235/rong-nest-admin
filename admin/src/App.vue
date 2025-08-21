<script setup lang="ts">
import Axios from 'axios'
import { onMounted, ref, type Ref } from 'vue'

let str: Ref<string> = ref('')

const msg = async () => {
	return await Axios.get('http://localhost:3000/api/').then((res) => {
		console.log(res.data)
		return res.data
	})
}

onMounted(async () => {
	str.value = await msg()
})
</script>

<template>
	<div>
		{{ str }}
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
