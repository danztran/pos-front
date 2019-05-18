<template>
	<div id="page-activitylog" class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-large-size-55 md-medium-size-70 md-small-size-100">
			<md-card>
				<md-progress-bar v-visible="loading" md-mode="query" />
				<md-switch v-model="autoUpdate" class="md-primary sw-title">
					Auto update
				</md-switch>
				<div class="text-center">
					<h2 style="margin-bottom: 5px;">
						ACTIVITY LOG
					</h2>
					<md-field style="width: 30%; margin: 0 auto 10px auto;">
						<label>
							Action filter
						</label>
						<md-input v-model="queryOption.text" type="text" @input="searching" @keydown.esc="queryOption.text=''" />
						<md-icon>filter_list</md-icon>
					</md-field>
				</div>
				<div style="padding: 0 20px 20px 20px;">
					<div style="height: 500px; overflow-y: scroll;">
						<table>
							<tbody is="transition-group" tag="tbody" name="rowfly" mode="out-in">
								<tr v-for="log of aclogs" :key="log._id">
									<td>
										<span>{{ _cm.getTime(log.createdAt) }}</span>
										<md-tooltip md-direction="top">
											{{ _cm.getDate(log.createdAt) }}
										</md-tooltip>
									</td>
									<td>
										<p class="text">
											{{ log.action }} —
											<span class="text-normal">{{ getLogNote(log) }}</span>
										</p>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</md-card>
		</div>
	</div>
</template>
<style lang="scss" scoped>
#page-activitylog {
	overflow: hidden;
	.rowfly-leave-active {
		position: absolute;
		opacity: 0;
	}
	.rowfly-enter, .rowfly-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}
	.sw-title {
		position: absolute;
		top: 0;
		right: 0;
	}
	table {
		width: 100%;
		tbody {
			tr {
				transition: all .4s;
				padding: 3px;
				td {
					margin: 8px;
					padding: 3px;
					background-color: rgba(0,0,0,.07);
					&:nth-of-type(1) {
						width: 1%;
					}
					p.text {
						margin: 5px;
						font-size: 15px;
						font-weight: bold;
					}
				}
				&:hover {
					background-color: rgba(0,0,0,.15);
				}
			}
		}
	}
}
</style>
<script>
import HandleMessage from '@/components/HandleMessage';
export default {
	name: 'ActivityLog',
	mixins: [HandleMessage],
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
			autoUpdate: true,
			interval: null,
			timeout: null,
			delay: 5000,
			aclogs: []
		};
	},
	watch: {
		autoUpdate(val) {
			if (val) {
				this.query();
				this.interval = setInterval(() => {
					this.query();
				}, this.delay);
			}
			else {
				clearInterval(this.interval);
			}
		}
	},
	created() {
		this.query();
		this.autoUpdate = false;
	},
	beforeDestroy() {
		this.autoUpdate = false;
		clearInterval(this.interval);
	},
	methods: {
		getLogNote(log) {
			return this._cm.replaceVars(log.note, {
				actor: log.actor.fullname,
				target: log.target.fullname || log.target.name || log.target.username || log.target._id
			});
		},
		searching() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.query(false);
			}, 400);
		},
		query(merge = true) {
			this.loading = true;
			this.$axios
				.post(this.$api.activityLog.query, this.queryOption)
				.then((res) => {
					const { aclogs } = res.data;
					if (aclogs) {
						this.aclogs = !merge ? aclogs : this._cm.uniqBy('_id', [...aclogs, ...this.aclogs]);
					}
				})
				.catch((err) => {
					this.autoUpdate = false;
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		}
	}
};
</script>
