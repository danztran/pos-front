<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-large-size-25 md-medium-size-27 md-small-size-75 md-xsmall-size-100">
			<customer-form :customer="selected" />
		</div>
		<div class="md-layout-item md-large-size-70 md-medium-size-65 md-small-size-100 md-xsmall-size-100">
			<md-card>
				<md-progress-bar v-visible="loading" md-mode="query" />
				<md-table
					v-model="customers"
					md-sort="updatedAt"
					md-sort-order="desc"
					md-fixed-header
					:md-sort.sync="queryOption.sortField"
					:md-sort-order.sync="queryOption.order"
					:md-sort-fn="customSort"
					primary>
					<md-table-toolbar>
						<div class="md-toolbar-section-start">
							<h2 md-title>
								LIST OF CUSTOMERS
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
						<md-table-cell md-label="Full name" md-sort-by="fullname">
							{{ item.fullname }}
						</md-table-cell>
						<md-table-cell md-label="Phone" md-sort-by="phone">
							{{ item.phone }}
						</md-table-cell>
						<md-table-cell md-label="Point" md-sort-by="point">
							{{ item.point }}
						</md-table-cell>
						<md-table-cell md-label="Join date" md-sort-by="createdAt">
							{{ getLocaleDateTime(item.createdAt) }}
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
import CommonMixin from "@/components/CommonMixin";
import CustomerForm from "@/components/CustomerForm";
import TableBotBar from "@/components/TableBotBar";
export default {
	name: "CustomerManagement",
	components: {
		"customer-form": CustomerForm,
		"table-botbar": TableBotBar
	},
	mixins: [HandleMessage, CommonMixin],
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
			count: 0,
			customers: [],
			selected: {}
		};
	},
	created() {
		this.query();
	},
	mounted() {
		this.$root.$on("customerAdded", customer => {
			this.customers.unshift(customer);
		});
		this.$root.$on("customerEdited", customer => {
			this.customers = this.customers.map(e =>
				e._id == customer._id ? customer : e
			);
		});
	},
	methods: {
		select(item) {
			this.selected = item;
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
		queryMore(num) {
			this.queryOption.length = num;
			this.query(true);
		},
		query(more = false) {
			this.loading = true;
			if (!more) {
				this.queryOption.index = 0;
			}
			this.$axios
				.post(this.$api.customer.query, this.queryOption)
				.then(res => {
					let { customers, count } = res.data;
					if (count !== undefined) {
						this.count = count;
					}
					if (customers) {
						if (more) {
							this.customers = [...this.customers, ...customers];
						} else {
							this.customers = customers;
						}
						this.queryOption.index = this.customers.length;
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