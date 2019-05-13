<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<form novalidate class="md-layout-item md-large-size-30 md-medium-size-50 md-small-size-100" @submit.prevent="edit">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2>Profile</h2>
					<md-switch v-model="formEdit" class="md-primary sw-edit" style="float: right">Edit</md-switch>
				</md-card-content>
				<md-card-content>
					<field-input :field="form.fullname" :disabled="disabledForm" />
					<field-input :field="form.username" :disabled="true" :tip2="formEdit" />
					<field-input :field="form.phone" :disabled="disabledForm" />
					<transition name="height">
						<div v-if="formEdit">
							<field-input :field="form.curpassword" :disabled="disabledForm" />
							<field-input :field="form.password" :disabled="disabledForm" />
						</div>
					</transition>
				</md-card-content>
				<md-card-actions v-if="formEdit">
					<md-button type="button" class="md-accent"
						:disabled="loading"
						@click="resetForm">
						Reset
					</md-button>
					<md-button type="submit" class="md-accent" :disabled="loading">
						Edit
					</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>
<style lang="scss" scoped>
.sw-edit {
	position: absolute;
	top: 0;
	right: 0;
}
.height-enter-active,
.height-leave-active {
	transition: all .3s;
	max-height: 130px;
}
.height-enter,
.height-leave-to {
	opacity: 0;
	max-height: 0;
	overflow: hidden;
}
</style>
<script>
import HandleMessage from "@/components/HandleMessage";
import FieldInput from "@/components/FieldInput";
const initForm = function() {
	return {
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
		phone: {
			label: "Phone number",
			name: "phone",
			type: "text",
			value: "",
			message: ""
		},
		curpassword: {
			label: "Current Password",
			name: "curpassword",
			type: "password",
			value: "",
			message: ""
		},
		password: {
			label: "New Password",
			name: "password",
			type: "password",
			helper: "Enter if only you want to change your password",
			value: "",
			message: ""
		},
	}
};
export default {
	name: 'UserProfile',
	mixins: [HandleMessage],
	components: {
		'field-input': FieldInput
	},
	data() {
		return {
			loading: false,
			formEdit: false,
			form: initForm()
		}
	},
	created() {
		this.resetForm();
	},
	watch: {
		formEdit(val) {
			if (!val) {
				this.resetForm();
			}
		}
	},
	computed: {
		disabledForm() {
			return this.loading || !this.formEdit;
		}
	},
	methods: {
		resetForm() {
			initForm();
			this.fillForm(this.$cookies.get("user"));
		},
		fillForm(item) {
			for (let key in this.form) {
				if (this.form[key].hasOwnProperty("value")) {
					this.form[key].value = item[key];
				}
			}
		},
		getFormData() {
			const data = {
				fullname: this.form.fullname.value,
				phone: this.form.phone.value,
				curpassword: this.form.curpassword.value
			};
			if (this.form.password.value) {
				data.password = this.form.password.value;
			}
			return data;
		},
		edit(item) {
			this.loading = true;
			this.$axios
				.post(this.$api.user.selfEdit, this.getFormData())
				.then(res => {
					const { message, user } = res.data;
					if (user) {
						this.$cookies.set("user", user);
						this.$root.$emit("selfEdit", user);
						this.resetForm();
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
}
</script>