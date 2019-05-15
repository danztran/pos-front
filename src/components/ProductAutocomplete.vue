<template>
	<div>
		<md-card>
			<md-progress-bar v-visible.hid="loading" md-mode="query" />
			<md-card-content>
				<md-autocomplete
					v-model="text"
					:class="{'md-invalid': message}"
					:md-options="products"
					@md-changed="getDataComplete"
					@md-opened="products = [...products]"
					@md-selected="select">
					<label>Add Product</label>

					<template slot="md-autocomplete-item" slot-scope="{ item }" :md-input-id="item._id">
						<span :disabled="!item.status">{{ item.code }} - {{ item.name }} - {{ _cm.parseMoney(item.price) }}</span>
					</template>
					<span class="md-helper-text">Enter product name or code</span>
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
	name: 'ProductAutocomplete',
	mixins: [HandleMessage],
	props: {
		message: {
			type: String,
			default: ''
		},
		product: {
			type: Object,
			default() {
				return {
					value: {}
				};
			}
		}
	},
	data() {
		return {
			loading: false,
			text: '',
			disabled: false,
			products: [],
			timer: 0
		};
	},
	watch: {
		product(val) {
			this.text = '';
		}
	},
	methods: {
		update(prop, data) {
			this.$emit(`update:${prop}`, data);
		},
		select(item) {
			this.disabled = true;
			if (item.status) {
				this.update('product', item);
				this.update('message', '');
			}
			else {
				this.text = `${item.name} - ${item.code}`;
				this.update('message', 'This product is currently unavailable for sale');
			}
		},
		getDataComplete() {
			clearTimeout(this.timer);
			if (!this.disabled) {
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
				.post(this.$api.product.query, {
					text: this.text,
					order: 'desc',
					sortField: 'updatedAt',
					index: 0,
					length: 10
				})
				.then((res) => {
					const { products } = res.data;
					if (products) {
						this.products = products.sort((a, b) => (`${b.status}`).localeCompare(`${a.status}`));
						if (products.length === 0) {
							this.update('message', 'Not found any product');
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
