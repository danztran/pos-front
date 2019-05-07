<template>
	<div class="bill-form">
		<md-card>
			<md-card-content class="md-toolbar">
				<h2 md-title>
					BILL INFO
				</h2>
			</md-card-content>
			<md-card-content>
				<div class="md-layout md-gutter md-alignment-center-center">
					<span>
						ID: {{ bill._id }}
					</span>
				</div>
			</md-card-content>
		</md-card>
	</div>
</template>

<style scoped>
.bill-form .md-card-content {
	padding: 0 30px !important;
}
</style>

<script>
	export default {
		name: "BillForm",
		props: {
			bill: {
				type: Object,
				default () {
					return {};
				}
			}
		},
	};
</script>