<template>
	<div class="md-layout">
		<div class="md-layout-item md-large-size-25 md-medium-size-25 md-small-size-50 md-xsmall-size-100">
			<form novalidate class="" @submit.prevent="handleSubmit">
				<md-card>
					<md-progress-bar md-mode="indeterminate" v-show="form.loading"/>
					<md-card-content class="md-toolbar">
						<h2 v-if="formAdd">ADD NEW USER</h2>
						<h2 v-if="formEdit">EDIT USER</h2>
					</md-card-content>

					<md-card-content>

						<md-field :class="getFieldClass('fullname')">
							<label for="fullname">Full name</label>
							<md-input v-model="form.fullname.value" name="fullname" id="fullname" :disabled="form.loading" @focus.keydown="resetFieldMsg('fullname')"/>
							<span class="md-error">{{ form.fullname.message }}</span>
						</md-field>

						<md-field :class="getFieldClass('username')">
							<label for="username">
								Username
								<span v-if="formEdit">
									<md-icon style="font-size: 15px !important">help_outline</md-icon>
									<md-tooltip md-direction="top">Username can not be edited</md-tooltip>
								</span>
							</label>
							<md-input v-model="form.username.value" name="username" id="username" :disabled="form.loading || formEdit" @focus.keydown="resetFieldMsg('username')"/>
							<span class="md-error">{{ form.username.message }}</span>
						</md-field>

						<md-field :class="getFieldClass('password')">
							<label for="password">
								Password
								<span v-if="formEdit">
									<md-icon style="font-size: 15px !important">help_outline</md-icon>
									<md-tooltip md-direction="top">Current password has been hashed</md-tooltip>
								</span>
							</label>

							<md-input v-model="form.password.value" type="password" name="password" id="password" :disabled="form.loading" @focus.keydown="resetFieldMsg('password')"/>
							<span class="md-error">{{ form.password.message }}</span>

						</md-field>

						<md-field :class="getFieldClass('phone')">
							<label for="phone">Phone</label>
							<md-input v-model="form.phone.value" name="phone" id="phone" :disabled="form.loading" @focus.keydown="resetFieldMsg('phone')"/>
							<span class="md-error">{{ form.phone.message }}</span>
						</md-field>

						<md-checkbox v-model="form.isAdmin" class="md-primary">Admin</md-checkbox>
						<md-checkbox v-model="form.isStaff" class="md-primary">Staff</md-checkbox>
					</md-card-content>


					<md-card-actions>
						<md-button type="button" class="md-accent" @click="resetForm">Reset</md-button>
						<md-button type="submit" class="md-primary" v-if="formAdd">Add</md-button>
						<md-button type="submit" class="md-primary" v-else>Edit</md-button>
					</md-card-actions>


				</md-card>
			</form>
		</div>
		<div class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-50 md-xsmall-size-100">
			<md-card>
				<md-progress-bar md-mode="indeterminate" v-show="queryLoading"/>
			</md-card>
			<md-table
				v-model="users"
				md-sort="updatedAt"
				md-sort-order="desc"
				md-card md-fixed-header
				:md-sort.sync="queryOption.sortField"
				:md-sort-order.sync="queryOption.order"
				:md-sort-fn="customSort"
			>
				<md-table-toolbar>
					<div class="md-toolbar-section-start">
						<h2 md-title>USER LIST</h2>
					</div>
					<md-field md-clearable class="md-toolbar-section-end">
						<md-input placeholder="Search by name..." v-model="queryOption.text" @input="searching"/>
					</md-field>
				</md-table-toolbar>

				<md-table-row slot="md-table-row" slot-scope="{ item }" table-header-color="purple" md-selectable="single" @click="fillForm(item)">
					<md-table-cell md-label="Role" md-sort-by="isAdmin">{{ item.isAdmin ? 'Admin' : 'Staff' }}</md-table-cell>
					<md-table-cell md-label="Name" md-sort-by="fullname">{{ item.fullname }}</md-table-cell>
					<md-table-cell md-label="Username" md-sort-by="username">{{ item.username }}</md-table-cell>
					<md-table-cell md-label="Phone" md-sort-by="phone">{{ item.phone }}</md-table-cell>
					<md-table-cell md-label="Join Date" md-sort-by="createdAt">{{ item.createdAt }}</md-table-cell>
				</md-table-row>

			</md-table>
			<div class="">
				<md-button class="md-primary" v-if="queryOption.index==count" disabled>All have been loaded</md-button>
				<md-button class="md-primary" v-else @click="loadMoreEntries">Load more entries</md-button>
				<md-button class="md-primary" style="float: right;">{{ queryOption.index }} / {{ count }}</md-button>
			</div>
		</div>
	</div>
</template>
<style>
.md-layout-item {
	margin: 15px;
}
</style>
<script>
export default {
	name: "App",
	data() {
		return  {
			api: {
				query: '/user/query',
				add: '/user/add',
				edit: '/user/edit'
			},
			queryOption: {
				length: 10,
				index: 0,
				sortField: 'updatedAt',
				order: 'desc',
				text: ''
			},
			queryTimer: null,
			queryLoading: false,
			users: [],
			count: 0,
			formAdd: true,
			form: {
				isAdmin: false,
				isStaff: true,
				loading: false,
				role: 'staff',
				fullname: {
					value: "",
					message: "",
				},
				username: {
					value: "",
					message: ""
				},
				password: {
					value: "",
					message: ""
				},
				phone: {
					value: "",
					message: ""
				}
			}
		}
	},
	created() {
		this.queryUsers();
	},
	computed: {
		formEdit() {
			return !this.formAdd;
		}
	},
	methods: {
		resetTable() {
			this.queryOption.text = "";
			this.queryOption.sortField = 'updatedAt';
			this.queryOption.order = 'desc';
			this.queryUsers();
		},
		resetForm() {
			function clear(...inp) {
				for (let i of inp) {
					i.value = '';
					i.message = '';
				}
			}
			clear(this.form.fullname, this.form.username);
			clear(this.form.password, this.form.phone)
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
		resetFieldMsg(field) {
			let key = this.form[field];
			if (key) {
				key.message = '';
			}
		},
		handleObjectMsg(objectMsg) {
			if (objectMsg) {
				let message = '';
				for (let key in objectMsg) {
					if (this.form.hasOwnProperty(key)) {
						this.form[key].message = objectMsg[key];
					} else {
						message += objectMsg[key] + '. \n';
					}
				}
				if (message.trim()) {
					this.$root.$emit('showMsg', message);
				} else {
					this.$root.$emit('hideMsg');
				}
			}
		},
		getFieldClass(field) {
			let key = this.form[field];
			let hasMsg = false;
			if (key) {
				hasMsg = Boolean(key.message);
			}
			return hasMsg ? 'md-invalid' : '';
		},
		searching() {
			clearTimeout(this.queryTimer);
			this.queryTimer = setTimeout(() => {
				this.queryUsers();
			}, 500);
		},
		customSort() {
			this.queryUsers();
		},
		loadMoreEntries() {
			this.queryUsers(true);
		},
		queryUsers(concat = false) {
			this.queryLoading = true;
			if (!concat) {
				this.queryOption.index = 0;
			}

			this.$axios.post(this.api.query, this.queryOption)
			.then(res => {
				let {users, count} = res.data;
				if (users) {
					if (concat)
						this.users = [...this.users, ...users];
					else
						this.users = users;
					this.queryOption.index =  this.users.length;
				}
				if (count) {
					this.count = count;
				}
			})
			.catch(err => {
				this.handleObjectMsg(err.message);
			})
			.then(() => {
				this.queryLoading = false;
			});
			return;
		},
		getFormData() {
			return {
				fullname: this.form.fullname.value,
				username: this.form.username.value,
				password: this.form.password.value,
				phone: this.form.phone.value,
				isAdmin: this.form.isAdmin,
				isStaff: this.form.isStaff
			}
		},
		handleSubmit() {
			this.$root.$emit('hideMsg');
			this.form.loading = true;
			if (this.formAdd) {
				this.addUser();
			} else {
				this.editUser();
			}
		},
		addUser() {
			this.$axios.post(this.api.add, this.getFormData())
			.then(res => {
				let {message, user} = res.data;
				this.handleObjectMsg(message);
				if (user) {
					this.users.unshift(user);
					this.resetForm();
				}
			})
			.catch(err => {
				this.handleObjectMsg(err.message);
			})
			.then(() => {
				this.form.loading = false;
			});
		},
		editUser() {
			this.$axios.post(this.api.edit, this.getFormData())
			.then(res => {
				let {message, user} = res.data;
				this.handleObjectMsg(message);
				if (user) {
					this.users = this.users.map(e => e.username == user.username ? user : e);
					this.resetForm();
				}
			})
			.catch(err => {
				this.handleObjectMsg(err.message);
			})
			.then(() => {
				this.form.loading = false;
			});
		}
	}
};
</script>
