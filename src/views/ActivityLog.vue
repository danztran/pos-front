<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-large-size-50 md-medium-size-70 md-small-size-100">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="query" />
				<md-switch v-model="autoUpdate" class="md-primary sw-title">
					Auto update
				</md-switch>
				<div class="text-center">
					<h2>ACTIVITY LOG</h2>
				</div>
				<ul is="transition-group" name="height" mode="out-in">
					<li v-for="log of aclogs" :key="log._id">
						<p class="text">
							{{ log.action }} - <span class="text-normal">{{ getLogNote(log) }}</span>
						</p>
					</li>
				</ul>
			</md-card>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.sw-title {
	position: absolute;
	top: 0;
	right: 0;
}
ul {
	height: 550px;
	padding: 5px 20px 20px 20px;
	li {
		margin: 8px;
		padding: 3px;
		list-style: none;
		background-color: rgba(0,0,0,.08);
		&:hover {
			background-color: rgba(0,0,0,.15);
		}
		p.text {
			margin: 5px;
			font-size: 15px;
			font-weight: bold;
		}
	}
}
</style>
<script>
import HandleMessage from "@/components/HandleMessage";
import CommonMixin from "@/components/CommonMixin";
export default {
	name: "ActivityLog",
	mixins: [CommonMixin, HandleMessage],
	data() {
		return {
			loading: false,
			queryOption: {
				text:	'',
				order: 'desc',
				sortField: 'updatedAt',
				index: 0,
				length: 20
			},
			autoUpdate: false,
			timer: null,
			delay: 5000,
			aclogs: []
		}
	},
	watch: {
		autoUpdate(val) {
			if (val) {
				this.query();
				this.timer = setInterval(() => {
					this.query();
				}, this.delay);
			} else {
				clearInterval(this.timer);
			}
		}
	},
	created() {
		this.autoUpdate = true;
	},
	beforeDestroy() {
		this.autoUpdate = false;
		clearInterval(this.timer);
	},
	methods: {
		getLogNote(log) {
			return this.replaceVars(log.note, {
				actor: log.actor.fullname,
				target: log.target.fullname || log.target.name || log.target.username || log.target._id,
			});
		},
		query() {
			this.loading = true;
			this.$axios
				.post(this.$api.activityLog.query, this.queryOption)
				.then(res => {
					let { aclogs } = res.data;
					if (aclogs) {
						this.aclogs = this.uniqBy('_id', [...aclogs, ...this.aclogs]);
					}
				})
				.catch(err => {
					this.autoUpdate = false;
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		}
	}
}
</script>