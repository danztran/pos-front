<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<form novalidate class="md-layout-item md-large-size-30 md-medium-size-50 md-small-size-100" @submit.prevent="edit">
			<md-card>
				<md-progress-bar v-visible.hid="loading" md-mode="indeterminate" />
				<md-card-content class="md-toolbar">
					<h2>Profile: {{ form.username.value }}</h2>
					<md-switch v-model="formEdit" class="md-primary sw-edit" style="float: right">
						Edit
					</md-switch>
				</md-card-content>
				<md-card-content>
					<md-list>
						<transition name="height">
							<div v-if="!formEdit">
								<md-list-item>
									<div class="md-list-item-text">
										Join Date:
									</div>
									<div class="md-list-item-text">
										{{ getLocaleDateTime(form.createdAt.value) }}
									</div>
								</md-list-item>
								<md-list-item>
									<div class="md-list-item-text">
										Last Edited Date:
									</div>
									<div class="md-list-item-text">
										{{ getLocaleDateTime(form.updatedAt.value) }}
									</div>
								</md-list-item>
							</div>
						</transition>
					</md-list>
					<field-input :field="form.username" :disabled="true" :tip2="formEdit" />
					<field-input :field="form.fullname" :disabled="disabledForm" />
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
.md-card-content, ul {
	padding-top: 0;
}
</style>
<script>
import HandleMessage from "@/components/HandleMessage";
import CommonMixin from "@/components/CommonMixin";
import FieldInput from "@/components/FieldInput";
const initForm = function() {
	return {
		createdAt: {
			value: ""
		},
		updatedAt: {
			value: ""
		},
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
			helper: "Enter only if you want to change your password",
			value: "",
			message: ""
		},
	}
};
export default {
	name: 'UserProfile',
	components: {
		'field-input': FieldInput
	},
	mixins: [HandleMessage, CommonMixin],
	data() {
		return {
			loading: false,
			formEdit: false,
			form: initForm()
		}
	},
	computed: {
		disabledForm() {
			return this.loading || !this.formEdit;
		}
	},
	watch: {
		formEdit(val) {
			if (!val) {
				this.resetForm();
			}
		}
	},
	created() {
		this.resetForm();
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