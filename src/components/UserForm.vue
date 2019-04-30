<template>
	<div>
		<form novalidate class="" @submit.prevent="handleSubmit">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2 v-if="formAdd">
						ADD NEW USER
					</h2>
					<h2 v-if="formEdit">
						EDIT USER
					</h2>
				</md-card-content>
				<md-card-content>
					<field-input :field="form.fullname" :disabled="loading" />
					<field-input :field="form.username" :disabled="loading || formEdit" :tip2="formEdit" />
					<field-input :field="form.password" :disabled="loading" :tip2="formEdit" />
					<field-input :field="form.phone" :disabled="loading" />

					<md-checkbox v-model="form.isAdmin" class="md-primary"
						:disabled="loading">
						Admin
					</md-checkbox>
					<md-checkbox v-model="form.isStaff" class="md-primary"
						:disabled="loading">
						Staff
					</md-checkbox>
				</md-card-content>
				<md-card-actions>
					<md-button type="button" class="md-accent"
						:disabled="loading"
						@click="resetForm">
						Reset
					</md-button>
					<md-button v-if="formAdd" type="submit"
						class="md-primary"
						:disabled="loading">
						Add
					</md-button>
					<md-button v-else type="submit"
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
	name: "UserForm",
	components: {
		"field-input": FieldInput
	},
	mixins: [HandleMessage],
	props: {
		user: {
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
				isAdmin: false,
				isStaff: true,
				fullname: {
					label: "Full name",
					name: "fullname",
					type: "text",
					value: "",
					message: ""
				},
				username: {
					label: "Username",
					name: "username",
					type: "text",
					tooltip2: "Username can not be edited",
					value: "",
					message: ""
				},
				password: {
					label: "Password",
					name: "password",
					type: "password",
					tooltip2: "Current password has been hashed",
					value: "",
					message: ""
				},
				phone: {
					label: "Phone number",
					name: "phone",
					type: "text",
					value: "",
					message: ""
				}
			}
		};
	},
	computed: {
		formEdit() {
			return !this.formAdd;
		}
	},
	watch: {
		user: function(newVal, oldVal) {
			// watch it
			this.fillForm(newVal);
		}
	},
	methods: {
		resetForm() {
			this.form.fullname.value = "";
			this.form.password.value = "";
			this.form.username.value = "";
			this.form.phone.value = "";
			this.form.isAdmin = false;
			this.form.isStaff = true;
			this.formAdd = true;
		},
		fillForm(user) {
			this.form.fullname.value = user.fullname;
			this.form.username.value = user.username;
			this.form.phone.value = user.phone;
			this.form.password.value = user.password;
			this.form.isAdmin = user.isAdmin;
			this.form.isStaff = user.isStaff;
			this.formAdd = false;
		},
		getFormData() {
			return {
				fullname: this.form.fullname.value,
				username: this.form.username.value,
				password: this.form.password.value,
				phone: this.form.phone.value,
				isAdmin: this.form.isAdmin,
				isStaff: this.form.isStaff
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
				.post(this.$api.user.add, this.getFormData())
				.then(res => {
					let { message, user } = res.data;
					if (user) {
						this.$root.$emit("userAdded", user);
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
				.post(this.$api.user.edit, this.getFormData())
				.then(res => {
					let { message, user } = res.data;
					if (user) {
						this.$root.$emit("userEdited", user);
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