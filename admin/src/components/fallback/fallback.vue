<script setup lang="ts">
import type { FallbackProps } from './fallback'

import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

type Props = FallbackProps

defineOptions({
	name: 'Fallback'
})

const props = withDefaults(defineProps<Props>(), {
	description: '',
	homePath: '/',
	image: '',
	showBack: true,
	status: 'coming-soon',
	title: ''
})

const Icon403 = defineAsyncComponent(() => import('./icons/icon-403.vue'))
const Icon404 = defineAsyncComponent(() => import('./icons/icon-404.vue'))
const Icon500 = defineAsyncComponent(() => import('./icons/icon-500.vue'))
const IconHello = defineAsyncComponent(() => import('./icons/icon-coming-soon.vue'))
const IconOffline = defineAsyncComponent(() => import('./icons/icon-offline.vue'))

const titleText = computed(() => {
	if (props.title) {
		return props.title
	}

	switch (props.status) {
		case '403': {
			return '403 权限不足'
		}
		case '404': {
			return '404 页面不存在'
		}
		case '500': {
			return '服务器内部错误'
		}
		case 'coming-soon': {
			return '马上回来'
		}
		case 'offline': {
			return '网络连接失败'
		}
		default: {
			return ''
		}
	}
})

const descText = computed(() => {
	if (props.description) {
		return props.description
	}
	switch (props.status) {
		case '403': {
			return '403 权限不足'
		}
		case '404': {
			return '404 页面不存在'
		}
		case '500': {
			return '服务器内部错误'
		}
		case 'offline': {
			return '网络连接失败'
		}
		default: {
			return ''
		}
	}
})

const fallbackIcon = computed(() => {
	switch (props.status) {
		case '403': {
			return Icon403
		}
		case '404': {
			return Icon404
		}
		case '500': {
			return Icon500
		}
		case 'coming-soon': {
			return IconHello
		}
		case 'offline': {
			return IconOffline
		}
		default: {
			return null
		}
	}
})

const showBack = computed(() => {
	return props.status === '403' || props.status === '404'
})

const showRefresh = computed(() => {
	return props.status === '500' || props.status === 'offline'
})

const { push } = useRouter()

// 返回首页
function back() {
	push(props.homePath)
}

function refresh() {
	location.reload()
}
</script>

<template>
	<div class="flex size-full flex-col items-center justify-center duration-300">
		<img v-if="image" :src="image" class="md:1/3 w-1/2 lg:w-1/4" />
		<component :is="fallbackIcon" v-else-if="fallbackIcon" class="md:1/3 h-1/3 w-1/2 lg:w-1/4" />
		<div class="flex-col-center">
			<slot v-if="$slots.title" name="title"></slot>
			<p v-else-if="titleText" class="text-foreground mt-8 text-2xl md:text-3xl lg:text-4xl">
				{{ titleText }}
			</p>
			<slot v-if="$slots.describe" name="describe"></slot>
			<p v-else-if="descText" class="text-muted-foreground md:text-md my-4 lg:text-lg">
				{{ descText }}
			</p>
			<slot v-if="$slots.action" name="action"></slot>
			<el-button v-else-if="showBack" type="primary" @click="back">
				<el-icon class="mr-2 size-4"><ArrowLeft /></el-icon>
				返回首页
			</el-button>
			<el-button v-else-if="showRefresh" type="primary" @click="refresh">
				<el-icon class="mr-2 size-4"><Refresh /></el-icon>
				刷新
			</el-button>
		</div>
	</div>
</template>
