<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-layout-item md-large-size-90 md-medium-size-95">
			<md-card>
				<md-progress-bar v-visible="loading" md-mode="query" />
				<md-table
					v-model="products"
					md-sort="updatedAt"
					md-sort-order="desc"
					md-fixed-header
					:md-sort.sync="queryOption.sortField"
					:md-sort-order.sync="queryOption.order"
					:md-sort-fn="customSort">
					<md-table-toolbar>
						<div class="md-toolbar-section-start">
							<h2>
								LIST OF PRODUCTS
							</h2>
						</div>
						<md-field md-clearable class="md-toolbar-section-end">
							<md-input v-model="queryOption.text" placeholder="Type to search..." @input="searching" />
						</md-field>
					</md-table-toolbar>
					<md-table-row
						slot="md-table-row"
						slot-scope="{ item }"
						table-header-color="purple"
						md-selectable="single"
						@click="select(item)">
						<md-table-cell md-label="Status" md-sort-by="status">
							{{ item.status ? "On" : "Off" }}
						</md-table-cell>
						<md-table-cell md-label="Name" md-sort-by="name">
							{{ item.name }}
						</md-table-cell>
						<md-table-cell md-label="Code" md-sort-by="code">
							{{ item.code }}
						</md-table-cell>
						<md-table-cell md-label="Quantity" md-sort-by="quantity">
							{{ item.quantity }}
						</md-table-cell>
						<md-table-cell md-label="Origin Price" md-sort-by="origin">
							{{ item.origin.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
						</md-table-cell>
						<md-table-cell md-label="Price" md-sort-by="price">
							{{ item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
						</md-table-cell>
						<md-table-cell md-label="Sale" md-sort-by="sale">
							{{ item.sale + '%' }}
						</md-table-cell>
					</md-table-row>
				</md-table>
			</md-card>
			<table-botbar
				:loading="loading"
				:index="queryOption.index"
				:count="count"
				@queryMore="queryMore" />
		</div>
	</div>
</template>

<script>
import HandleMessage from "@/components/HandleMessage";
import TableBotBar from "@/components/TableBotBar";
export default {
	name: "ProductManagement",
	components: {
		"table-botbar": TableBotBar
	},
	mixins: [HandleMessage],
	data() {
		return {
			queryOption: {
				length: 10,
				index: 0,
				sortField: "updatedAt",
				order: "desc",
				text: ""
			},
			timer: null,
			loading: false,
			products: [],
			selected: {},
			count: 0
		}
	},
	created() {
		this.query();
	},
	mounted() {
		this.$root.$on("productAdded", product => {
			this.products.unshift(product);
		});
		this.$root.$on("productEdited", product => {
			this.products = this.products.map(e =>
				e.code == product.code ? product : e
			);
		});
	},
	methods: {
		select(item) {
			this.selected = item;
			this.$root.$emit('productSelect', item);
		},
		searching() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.query();
			}, 500);
		},
		customSort() {
			this.query();
		},
		queryMore(num = 20) {
			this.queryOption.length = num;
			this.query(true);
		},
		query(more = false) {
			this.loading = true;
			if (!more) {
				this.queryOption.index = 0;
			}

			this.$axios
				.post(this.$api.product.query, this.queryOption)
				.then(res => {
					let { products, count } = res.data;
					if (count) {
						this.count = count;
					}
					if (products) {
						if (more) {
							this.products = [...this.products, ...products];
						} else {
							this.products = products;
						}
						this.queryOption.index = this.products.length;
						// if (products.length < this.queryOption.length) {
						// 	this.count = this.queryOption.index;
						// }
					}
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.queryOption.length = 10;
					this.loading = false;
				});
		}
	}
};
</script>