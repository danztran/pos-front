<template>
	<div>
		<form novalidate class="" @submit.prevent="handleSubmit">
			<md-card>
				<md-progress-bar v-visible="form.loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2 v-if="formAdd">
						ADD NEW USER
					</h2>
					<h2 v-if="formEdit">
						EDIT USER
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
					<md-field v-for="field in [form.username]" :key="field.name" :class="getFieldClass(field.name)">
						<label :for="field.name">
							{{ field.label }}
							<span v-if="formEdit">
								<md-icon style="font-size: 15px !important">help_outline</md-icon>
								<md-tooltip md-direction="top">Username can not be edited</md-tooltip>
							</span>
						</label>
						<md-input
							:id="field.name"
							v-model="field.value"
							:type="field.type"
							:name="field.name"
							:disabled="form.loading || formEdit"
							@keydown="clearFieldMessage(field.name)"
						/>
						<span class="md-error">{{ field.message }}</span>
					</md-field>
					<md-field v-for="field in [form.password]" :key="field.name" :class="getFieldClass(field.name)">
						<label :for="field.name">
							{{ field.label }}
							<span v-if="formEdit">
								<md-icon style="font-size: 15px !important">help_outline</md-icon>
								<md-tooltip md-direction="top">Current password has been hashed</md-tooltip>
							</span>
						</label>
						<md-input
							:id="field.name"
							v-model="field.value"
							:type="field.type"
							:name="field.name"
							:disabled="form.loading || formEdit"
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
					<md-checkbox v-model="form.isAdmin" class="md-primary">
						Admin
					</md-checkbox>
					<md-checkbox v-model="form.isStaff" class="md-primary">
						Staff
					</md-checkbox>
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
	name: "UserForm",
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
			formAdd: true,
			form: {
				isAdmin: false,
				isStaff: true,
				loading: false,
				role: "staff",
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
					value: "",
					message: ""
				},
				password: {
					label: "Password",
					name: "password",
					type: "password",
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
			function clear(...inp) {
				for (let i of inp) {
					i.value = "";
					i.message = "";
				}
			}
			clear(this.form.fullname, this.form.username);
			clear(this.form.password, this.form.phone);
			this.form.isAdmin = false;
			this.form.isStaff = true;
			this.formAdd = true;
		},
		clearFieldMessage(...fields) {
			for (let field of fields) {
				let key = this.form[field];
				if (key) {
					key.message = "";
				}
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
			this.form.loading = true;
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
					this.handleMessage(message);
					if (user) {
						this.$root.$emit("userAdded", user);
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
				.post(this.$api.user.edit, this.getFormData())
				.then(res => {
					let { message, user } = res.data;
					this.handleMessage(message);
					if (user) {
						this.$root.$emit("userEdited", user);
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