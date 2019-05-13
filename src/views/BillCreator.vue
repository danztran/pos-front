<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-large-size-70 md-layout md-gutter">
			<div class="md-layout-item md-large-size-50">
				<customer-autocomplete :message.sync="form.customer.message" :customer.sync="form.customer.value" />
			</div>
			<div class="md-layout-item md-large-size-50">
				<product-autocomplete :message.sync="form.product.message" :product.sync="form.product.value" />
			</div>
			<div class="md-layout-item md-large-size-100">
				<product-list :products.sync="form.products" />
			</div>
		</div>

		<div class="md-layout-item md-large-size-30 md-layout md-gutter" style="padding-left: 0">
			<div class="md-layout-item md-large-size-100" style="padding-left: 0">
				<md-card>
					<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
					<md-card-content>
						<transition name="height">
							<div v-if="notEmpty(form.customer.value)">
								<h3>CUSTOMER:</h3>
								<h2 class="md-text-primary">
									{{ form.customer.value.fullname }} - {{ form.customer.value.phone }}
								</h2>
								<field-input :field="form.subpoint" :disabled="loading" />
							</div>
						</transition>
						<div class="">
							<h3>TOTAL ITEM:</h3>
							<h2 class="md-text-primary">
								{{ totalCount }} item{{ totalCount > 1 ? 's' : '' }}
							</h2>
						</div>
						<div class="">
							<h3>TOTAL PRICE:</h3>
							<h1 class="md-text-primary">
								{{ parseMoney(totalPrice) }}
							</h1>
						</div>
						<md-radio v-model="form.payment" value="cash" class="md-primary" :disabled="loading">
							Cash
						</md-radio>
						<md-radio v-model="form.payment" value="bank" class="md-primary" :disabled="loading">
							Bank
						</md-radio>
					</md-card-content>
					<div class="md-layout md-alignment-center-space-between">
						<md-button>VAT Included</md-button>
						<div class="">
							<md-button class="" :disabled="loading" @click="resetForm">
								Reset
							</md-button>
							<md-button class="md-primary" :disabled="loading" @click="add">
								Create
							</md-button>
						</div>
					</div>
				</md-card>
			</div>
		</div>
		<md-dialog :md-active.sync="billDialog" class="bill-dialog">
			<md-dialog-content>
				<bill-paid :bill="billPaid" />
			</md-dialog-content>
		</md-dialog>
	</div>
</template>

<script>
import HandleMessage from "@/components/HandleMessage";
import CommonMixin from "@/components/CommonMixin";
import FieldInput from "@/components/FieldInput";
import CustomerAutocomplete from "@/components/CustomerAutocomplete";
import ProductAutocomplete from "@/components/ProductAutocomplete";
import BillProductList from "@/components/BillProductList";
import BillPaid from "@/components/BillPaid";
const initForm = function() {
	return {
		customer: {
			value: {},
			message: ""
		},
		product: {
			value: {},
			message: ""
		},
		products: [],
		subpoint: {
			label: "Use point",
			type: "Number",
			value: 0,
			suffix: "/",
			max: 0,
			min: 0,
			message: ""
		},
		payment: "cash"
	}
}
export default {
	name: "BillCreator",
	components: {
		'field-input': FieldInput,
		'customer-autocomplete': CustomerAutocomplete,
		'product-autocomplete': ProductAutocomplete,
		'product-list': BillProductList,
		'bill-paid': BillPaid
	},
	mixins: [HandleMessage, CommonMixin],
	data() {
		return {
			loading: false,
			billDialog: false,
			billPaid: {},
			form: initForm()
		};
	},
	computed: {
		totalCount() {
			return this.form.products.reduce((v, e) => v += e.buyQuantity, 0);
		},
		totalPrice() {
			return this.form.products.reduce((v, e) => v += e.total, 0) - this.form.subpoint.value;
		},
	},
	watch: {
		"form.product.value": function(val, old) {
			if (this.notEmpty(val)) {
				if (!this.form.products.find(e => e.code == val.code)) {
					const date = Date.now();
					let sale = 0;
					if (val.sale && val.saleBegin && val.saleEnd) {
						if (date > new Date(val.saleBegin) && date < new Date(val.saleEnd)) {
							sale = val.sale;
						}
					}

					val.sale = sale;
					val.salePrice = val.price * (100 - sale) / 100;
					val.buyQuantity = 1;
					val.total = val.salePrice;
					this.form.products.unshift(val);
				} else {
					this.form.product.message = 'This product is exists in bill';
				}
			}
		},
		"form.customer.value": function(val, old) {
			if (this.notEmpty(val)) {
				this.form.subpoint.suffix = '/' + val.point;
				this.form.subpoint.max = val.point;
			}
		}
	},
	methods: {
		resetForm() {
			this.form = initForm();
		},
		getFormData() {
			return {
				customerId: this.form.customer.value._id,
				subpoint: this.form.subpoint.value,
				payment: this.form.payment,
				products: this.form.products
			};
		},
		add() {
			this.loading = true;
			this.$root.$emit("hideMsg");
			this.$axios
				.post(this.$api.bill.add, this.getFormData())
				.then(res => {
					const { message, bill, customer } = res.data;
					this.billPaid = bill;
					this.billDialog = true;
					this.resetForm();
					this.handleMessage(message);
					this.form.customer.value = customer;
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		},
	}
};
</script>