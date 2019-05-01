<template>
	<div class="">
		<transition name="rotate">
			<md-button v-if="index && count" class="none-pointer" style="float: right; z-index: 0">
				{{ index }} / {{ count }}
			</md-button>
		</transition>
		<md-button v-if="loading">
			Loading...
		</md-button>
		<md-button v-else-if="index == count" class="none-pointer">
			No more records
		</md-button>
		<div v-else>
			<md-button class="none-pointer">
				Load more:
			</md-button>
			<span v-for="(item, i) in lengths" :key="item">
				<md-button v-if="i == 0" class="md-primary" @click="queryMore(getQueryLength(item))">
					{{ getQueryLength(item) }} records
				</md-button>
				<span v-else>
					<!-- hide current item if previous item is less than the ress -->
					<md-button v-if="count - index > lengths[i - 1]" class="md-primary" @click="queryMore(getQueryLength(item))">
						{{ getQueryLength(item) }} records
					</md-button>
				</span>
			</span>
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
	data() {
		return {
			lengths: [20, 50, 100]
		}
	},
	methods: {
		getQueryLength(num) {
			return this.index + num > this.count ? this.count - this.index : num;
		},
		queryMore(num) {
			this.$emit('queryMore', num);
		}
	}
}
</script>