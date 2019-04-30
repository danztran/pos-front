<template>
	<div class="">
		<md-button class="none-pointer" style="float: right; z-index: 0">
			{{ index }} / {{ count }}
		</md-button>
		<md-button v-if="loading">
			Loading...
		</md-button>
		<md-button v-else-if="index == count" class="none-pointer">
			All records have been loaded
		</md-button>
		<div v-else>
			<md-button class="none-pointer">
				Load more:
			</md-button>
			<md-button class="md-primary" @click="queryMore(20)">
				20 records
			</md-button>
			<md-button class="md-primary" @click="queryMore(50)">
				50 records
			</md-button>
			<md-button class="md-primary" @click="queryMore(100)">
				100 records
			</md-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "TableBotBar",
	props: {
		index: {
			type: Number,
			default: 0
		},
		count: {
			type: Number,
			default: 0
		},
		loading: {
			type: Boolean,
			default: true
		},
	},
	methods: {
		queryMore(num) {
			this.$emit('queryMore', num);
		}
	}
}
</script>