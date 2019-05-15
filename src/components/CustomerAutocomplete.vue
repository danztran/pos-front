<template>
	<div>
		<md-card>
			<md-progress-bar v-visible.hid="loading" md-mode="query" />
			<md-card-content>
				<md-autocomplete
					v-model="text"
					:class="{'md-invalid': message}"
					:md-options="customers"
					@md-changed="getDataComplete"
					@md-opened="customers = [...customers]"
					@md-selected="select">
					<label>Customer</label>

					<template slot="md-autocomplete-item" slot-scope="{ item }" :md-input-id="item._id">
						{{ item.phone }} - {{ item.fullname }}
					</template>
					<span v-if="text" class="md-helper-text">Phone: {{ customer.phone }} - Point: {{ customer.point }}</span>
					<span v-else class="md-helper-text">Enter name or phone</span>
					<span class="md-error">{{ message }}</span>
				</md-autocomplete>
			</md-card-content>
		</md-card>
	</div>
</template>
<style lang="scss" scoped>
.md-card {
	.md-card-content {
		padding-top: 0;
		padding-bottom: 10px;
	}
}
</style>
<script>
import HandleMessage from '@/components/HandleMessage';

export default {
	name: 'CustomerAutocomplete',
	mixins: [HandleMessage],
	props: {
		message: {
			type: String,
			default: ''
		},
		customer: {
			type: Object,
			default: () => {
				{}
			}
		}
	},
	data() {
		return {
			loading: false,
			text: '',
			disabled: false,
			customers: [],
			timer: 0
		};
	},
	watch: {
		customer(val) {
			if (this._cm.notEmpty(val)) {
				this.text = val.fullname;
			}
		}
	},
	methods: {
		update(prop, data) {
			this.$emit(`update:${prop}`, data);
		},
		select(item) {
			this.disabled = true;
			this.update('customer', item);
		},
		getDataComplete() {
			clearTimeout(this.timer);
			if (!this.disabled) {
				this.update('customer', {});
				this.update('message', '');
				if (this.text !== '') {
					this.timer = setTimeout(this.query, 500);
				}
			}
			else {
				this.disabled = false;
			}
		},
		query() {
			this.loading = true;
			this.$axios
				.post(this.$api.customer.query, {
					text: this.text,
					order: 'desc',
					sortField: 'updatedAt',
					index: 0,
					length: 10
				})
				.then((res) => {
					const { customers } = res.data;
					if (customers) {
						this.customers = customers;
						if (customers.length === 0) {
							this.update('message', 'Not found any customer');
						}
					}
				})
				.catch((err) => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		}
	}
};
</script>
