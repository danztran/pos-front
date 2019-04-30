<template>
	<div class="">
		<md-button v-if="loading" class="md-primary" disabled>
			Loading...
		</md-button>
		<md-button v-else-if="index == count" class="md-primary" disabled>
			All records have been loaded
		</md-button>
		<md-button v-else class="md-primary" @click="$emit('queryMore')">
			Load more records
		</md-button>
		<md-button class="" style="float: right; z-index: 0">
			{{ index }} / {{ count }}
		</md-button>
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
		}
	}
}
</script>