<template>
	<div>
		<md-snackbar
			md-position="left"
			:md-duration="Infinity"
			:md-active.sync="show"
			md-persistent
			@click="show = false">
			<span v-text="message" />
			<md-button
				class="md-primary"
				@click="show = false">
				&times;
			</md-button>
		</md-snackbar>
	</div>
</template>

<style lang="scss" scoped>
.md-snackbar {
	max-height: unset;
	white-space: pre;
}
</style>

<script>
export default {
	name: 'Notify',
	data() {
		return {
			message: '',
			show: false
		};
	},
	watch: {
		$route(to, from) {
			this.show = false;
		}
	},
	mounted() {
		this.$root.$on('showMsg', (message) => {
			this.message = message;
			this.show = true;
		});
		this.$root.$on('hideMsg', () => {
			this.show = false;
		});
	}
};
</script>
