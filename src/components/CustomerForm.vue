<template>
	<div>
		<form novalidate class="" @submit.prevent="handleSubmit">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2 v-if="formAdd" md-title>
						ADD NEW CUSTOMER
					</h2>
					<h2 v-if="formEdit" md-title>
						EDIT CUSTOMER
					</h2>
				</md-card-content>
				<md-card-content>
					<field-input :field="form.fullname" :disabled="loading" />
					<field-input :field="form.phone" :disabled="loading" />
					<md-content>
						<span class="md-body-1">Point: </span>
						<md-chip md-static>
							{{ form.point }}
						</md-chip>
					</md-content>
				</md-card-content>
				<md-card-actions>
					<md-button
						type="button"
						class="md-accent"
						:disabled="loading"
						@click="resetForm">
						Reset
					</md-button>
					<md-button
						v-if="formAdd"
						type="submit"
						class="md-primary"
						:disabled="loading">
						Add
					</md-button>
					<md-button
						v-else
						type="submit"
						class="md-primary"
						:disabled="loading">
						Edit
					</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>

<script>
import HandleMessage from "@/components/HandleMessage";
import FieldInput from "@/components/FieldInput";
export default {
	name: "CustomerForm",
	components: {
		"field-input": FieldInput
	},
	mixins: [HandleMessage],
	props: {
		customer: {
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
				_id: "",
				fullname: {
					label: "Full name",
					name: "fullname",
					type: "text",
					value: "",
					message: ""
				},
				phone: {
					label: "Phone number",
					name: "phone",
					type: "text",
					value: "",
					message: ""
				},
				point: 0
			}
		};
	},
	computed: {
		formEdit() {
			return !this.formAdd;
		}
	},
	watch: {
		customer(newVal, oldVal) {
			// watch it
			this.fillForm(newVal);
		}
	},
	methods: {
		resetForm() {
			this.form._id = "";
			this.form.fullname.value = "";
			this.form.phone.value = "";
			this.form.point = 0;
			this.formAdd = true;
		},
		fillForm(customer) {
			this.form.fullname.value = customer.fullname;
			this.form.phone.value = customer.phone;
			this.form._id = customer._id;
			this.form.point = customer.point;
			this.formAdd = false;
		},
		getFormData() {
			let formData = {
				fullname: this.form.fullname.value,
				phone: this.form.phone.value
			};
			if (this.formEdit) {
				formData._id = this.form._id;
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
				.post(this.$api.customer.add, this.getFormData())
				.then(res => {
					let { message, customer } = res.data;
					if (customer) {
						this.$root.$emit("customerAdded", customer);
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
				.post(this.$api.customer.edit, this.getFormData())
				.then(res => {
					let { message, customer } = res.data;
					if (customer) {
						this.$root.$emit("customerEdited", customer);
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