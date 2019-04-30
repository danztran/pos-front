<template>
	<div class="product-form">
		<form @submit.prevent="handleSubmit">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2 v-if="formAdd" md-title>
						ADD NEW PRODUCT
					</h2>
					<h2 v-if="formEdit" md-title>
						EDIT PRODUCT
					</h2>
				</md-card-content>
				<md-card-content>
					<div class="md-layout md-gutter md-alignment-center-center">
						<div class="md-layout-item">
							<field-input :field="form.name" :disabled="loading" />
							<field-input :field="form.code" :disabled="loading || formEdit" />
							<field-input :field="form.origin" :disabled="loading" />
							<field-input :field="form.price" :disabled="loading" />
						</div>
						<div class="md-layout-item">
							<field-input :field="form.quantity" :disabled="loading" />
							<field-input :field="form.sale" :disabled="loading" />
							<div class=" md-layout">
								<md-datepicker v-model="form.saleBegin" md-immediately :disabled="loading">
									<label>Begin date</label>
								</md-datepicker>
								<md-datepicker v-model="form.saleEnd" md-immediately :disabled="loading">
									<label>End date</label>
								</md-datepicker>
							</div>
						</div>
						<div class="md-layout-item" style="margin-top: 0">
							<md-checkbox v-model="form.status" class="md-primary">
								Available
							</md-checkbox>
						</div>
					</div>
				</md-card-content>
				<md-card-actions>
					<md-button
						type="button"
						class="md-accent"
						@click="resetForm"
						@disabled="loading">
						Reset
					</md-button>
					<md-button
						v-if="formAdd"
						type="submit"
						class="md-primary"
						@disabled="loading">
						Add
					</md-button>
					<md-button
						v-else
						type="submit"
						class="md-primary"
						@disabled="loading">
						Edit
					</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>

<style scoped>
.product-form .md-card-content {
	padding: 0 30px !important;
}
</style>

<script>
import HandleMessage from "@/components/HandleMessage";
import FieldInput from "@/components/FieldInput";
export default {
	name: "ProductForm",
	components: {
		'field-input': FieldInput
	},
	mixins: [HandleMessage],
	props: {
		product: {
			type: Object,
			default () {
				return {};
			}
		}
	},
	data() {
		return {
			loading: false,
			formAdd: true,
			form: {
				status: true,
				saleBegin: null,
				saleEnd: null,
				name: {
					label: "Name",
					name: "name",
					type: "text",
					value: "",
					message: ""
				},
				code: {
					label: "Code",
					name: "code",
					type: "text",
					value: "",
					message: ""
				},
				origin: {
					label: "Origin Price",
					name: "origin",
					type: "number",
					value: "0",
					message: "",
					prefix: "$"
				},
				price: {
					label: "Price",
					name: "price",
					type: "number",
					value: "0",
					message: "",
					prefix: "$"
				},
				sale: {
					label: "Sale",
					name: "sale",
					type: "number",
					value: "0",
					message: "",
					prefix: "%"
				},
				quantity: {
					label: "Quantity",
					name: "quantity",
					type: "number",
					value: "",
					message: ""
				},
			}
		};
	},
	computed: {
		formEdit() {
			return !this.formAdd;
		}
	},
	created() {
		this.formAdd = !this.product.code;
		if (this.product.code) {
			this.fillForm(this.product);
		}
	},
	methods: {
		resetForm() {
			this.form.name.value = "";
			this.form.code.value = "";
			this.form.origin.value = 0;
			this.form.price.value = 0;
			this.form.sale.value = 0;
			this.form.saleBegin = new Date();
			this.form.saleEnd = new Date();
			this.form.quantity.value = "";
			this.form.status = true;
			this.formAdd = true;
		},
		fillForm(item) {
			this.form.name.value = item.name;
			this.form.code.value = item.code;
			this.form.origin.value = item.origin;
			this.form.price.value = item.price;
			this.form.sale.value = item.sale;
			this.form.saleBegin = item.saleBegin;
			this.form.saleEnd = item.saleEnd;
			this.form.quantity.value = item.quantity;
			this.form.status = item.status;
		},
		getFormData() {
			return {
				name: this.form.name.value,
				code: this.form.code.value,
				origin: this.form.origin.value,
				price: this.form.price.value,
				sale: this.form.sale.value,
				saleBegin: this.form.saleBegin,
				saleEnd: this.form.saleEnd,
				quantity: this.form.quantity.value,
				status: this.form.status,
			};
		},
		handleSubmit() {
			this.$root.$emit("hideMsg");
			this.loading = true;
			if (this.formAdd) {
				this.add();
			} else {
				this.edit();
			}
		},
		add() {
			this.$axios
				.post(this.$api.product.add, this.getFormData())
				.then(res => {
					let { message, product } = res.data;
					if (product) {
						this.$root.$emit("productAdded", product);
					}
					this.handleMessage(message);
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		},
		edit() {
			this.$axios
				.post(this.$api.product.edit, this.getFormData())
				.then(res => {
					let { message, product } = res.data;
					if (product) {
						this.$root.$emit("productEdited", product);
					}
					this.handleMessage(message);
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.loading = false;
				});
		}
	}
};
</script>