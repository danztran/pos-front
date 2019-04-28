<template>
	<div>
		<form novalidate class="" @submit.prevent="handleSubmit">
			<md-card>
				<md-progress-bar v-show="form.loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2 v-if="formAdd">
						ADD NEW CUSTOMER
					</h2>
					<h2 v-if="formEdit">
						EDIT CUSTOMER
					</h2>
				</md-card-content>
				<md-card-content>
					<md-field v-for="field in [form.fullname]" :key="field.name" :class="getFieldClass(field.name)">
						<label :for="field.name">{{ field.label }}</label>
						<md-input
							:id="field.name"
							v-model="field.value"
							:type="field.type"
							:name="field.name"
							:disabled="form.loading"
							@keydown="clearFieldMessage(field.name)"
						/>
						<span class="md-error">{{ field.message }}</span>
					</md-field>
					<md-field v-for="field in [form.phone]" :key="field.name" :class="getFieldClass(field.name)">
						<label :for="field.name">{{ field.label }}</label>
						<md-input
							:id="field.name"
							v-model="field.value"
							:type="field.type"
							:name="field.name"
							:disabled="form.loading"
							@keydown="clearFieldMessage(field.name)"
						/>
						<span class="md-error">{{ field.message }}</span>
					</md-field>
					<md-content>
						<span class="md-body-1">Point: </span>
						<md-chip md-static>
							{{ form.point }}
						</md-chip>
					</md-content>
				</md-card-content>
				<md-card-actions>
					<md-button type="button" class="md-accent" @click="resetForm">
						Reset
					</md-button>
					<md-button v-if="formAdd" type="submit" class="md-primary">
						Add
					</md-button>
					<md-button v-else type="submit" class="md-primary">
						Edit
					</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>
<script>
import HandleMessage from "@/components/HandleMessage";
export default {
	name: "CustomerForm",
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
			formAdd: true,
			form: {
				loading: false,
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
		customer: function(newVal, oldVal) {
			// watch it
			this.fillForm(newVal);
		}
	},
	methods: {
		resetForm() {
			function clear(...inp) {
				for (let i of inp) {
					i.value = "";
					i.message = "";
				}
			}
			clear(this.form.fullname, this.form.phone);
			this.form._id = "";
			this.form.point = 0;
			this.formAdd = true;
		},
		clearFieldMessage(field) {
			let key = this.form[field];
			if (key) {
				key.message = "";
			}
		},
		getFieldClass(field) {
			let key = this.form[field];
			let hasMsg = false;
			if (key) {
				hasMsg = Boolean(key.message);
			}
			return hasMsg ? "md-invalid" : "";
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
			this.form.loading = true;
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
					this.handleMessage(message);
					if (customer) {
						this.$root.$emit("customerAdded", customer);
					}
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.form.loading = false;
				});
		},
		edit() {
			this.$axios
				.post(this.$api.customer.edit, this.getFormData())
				.then(res => {
					let { message, customer } = res.data;
					this.handleMessage(message);
					if (customer) {
						this.$root.$emit("customerEdited", customer);
					}
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.form.loading = false;
				});
		}
	}
};
</script>