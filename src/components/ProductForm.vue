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
							<field-date :field="form.saleBegin" :disabled="loading" />
							<field-date :field="form.saleEnd" :disabled="loading" />
						</div>
						<div class="md-layout-item" style="margin-top: 0">
							<md-checkbox v-model="form.status.value" class="md-primary">
								{{ form.status.label }}
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
import FieldDate from "@/components/FieldDate";
const initForm = function() {
	return {
		status: {
			label: "Available",
			value: true,
		},
		saleBegin: {
			label: "Sale Begin",
			value: null,
			message: ""
		},
		saleEnd: {
			label: "Sale End",
			value: null,
			message: ""
		},
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
			maxlength: 6,
			message: ""
		},
		origin: {
			label: "Origin Price",
			name: "origin",
			type: "number",
			value: 0,
			message: "",
			prefix: "$"
		},
		price: {
			label: "Price",
			name: "price",
			type: "number",
			value: 0,
			message: "",
			prefix: "$"
		},
		sale: {
			label: "Sale",
			name: "sale",
			type: "number",
			value: "",
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
}
export default {
	name: "ProductForm",
	components: {
		'field-input': FieldInput,
		'field-date': FieldDate
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
			form: initForm()
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
		clearAllMessages() {
			for (let key in this.form) {
				if (this.form[key].hasOwnProperty("message")) {
					this.form[key].message = "";
				}
			}
		},
		resetForm() {
			this.clearAllMessages();
			this.form.name.value = "";
			this.form.code.value = "";
			this.form.origin.value = 0;
			this.form.price.value = 0;
			this.form.sale.value = "";
			this.form.saleBegin.value = new Date();
			this.form.saleEnd.value = new Date();
			this.form.quantity.value = "";
			this.form.status.value = true;
			this.formAdd = true;
		},
		fillForm(item) {
			for (let key in this.form) {
				if (this.form[key].hasOwnProperty("value")) {
					this.form[key].value = item[key];
				}
			}
		},
		getFormData() {
			const formData = {};
			for (let key in this.form) {
				if (this.form[key].hasOwnProperty("value")) {
					formData[key] = this.form[key].value;
				}
			}
			return formData;
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