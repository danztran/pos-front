<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<md-dialog :md-active.sync="billDialog" class="bill-dialog">
			<md-dialog-content>
				<bill-form :bill="selected" />
			</md-dialog-content>
		</md-dialog>
		<div class="md-layout-item md-large-size-90 md-medium-size-95">
			<md-card>
				<md-progress-bar v-visible="loading" md-mode="query" />
				<md-table
					v-model="bills"
					md-sort="updatedAt"
					md-sort-order="desc"
					md-fixed-header
					:md-sort.sync="queryOption.sortField"
					:md-sort-order.sync="queryOption.order"
					:md-sort-fn="customSort">
					<md-table-toolbar>
						<div class="md-toolbar-section-start">
							<h2>
								LIST OF BILLS
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
						<md-table-cell md-label="Customer" md-sort-by="customer.fullname">
							{{ item.customer.fullname }}
						</md-table-cell>
						<md-table-cell md-label="Payment" md-sort-by="payment">
							{{ item.payment }}
						</md-table-cell>
						<md-table-cell md-label="Products">
							{{ item.products.map(e => e.product.name).join(', ') }}
						</md-table-cell>
						<md-table-cell md-label="Subpoint" md-sort-by="subpoint">
							{{ item.subpoint }}
						</md-table-cell>
						<md-table-cell md-label="Total" md-sort-by="total">
							{{ parseMoney(item.total) }}
						</md-table-cell>
						<md-table-cell md-label="Bonus" md-sort-by="bonus">
							{{ item.bonus }}
						</md-table-cell>
						<md-table-cell md-label="Added by" md-sort-by="user.fullname">
							{{ item.user.fullname }}
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
import TableBotBar from "@/components/TableBotBar";
import BillForm from "@/components/BillForm";
export default {
	name: "BillManagement",
	components: {
		"table-botbar": TableBotBar,
		"bill-form": BillForm
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
			bills: [],
			selected: {},
			billDialog: false,
			count: 0
		}
	},
	created() {
		this.query();
	},
	mounted() {
		this.$root.$on("billAdded", bill => {
			this.bills.unshift(bill);
		});
	},
	methods: {
		select(item) {
			this.selected = item;
			this.billDialog = true;
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
				.post(this.$api.bill.query, this.queryOption)
				.then(res => {
					let { bills, count } = res.data;
					if (count !== undefined) {
						this.count = count;
					}
					if (bills) {
						if (more) {
							this.bills = [...this.bills, ...bills];
						} else {
							this.bills = bills;
						}
						this.queryOption.index = this.bills.length;
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