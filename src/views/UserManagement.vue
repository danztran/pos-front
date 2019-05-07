<template>
	<div class="md-layout md-gutter md-alignment-top-center">
		<div class="md-layout-item md-large-size-25 md-medium-size-27 md-small-size-75 md-xsmall-size-100">
			<user-form :user="selected" />
		</div>
		<div class="md-layout-item md-large-size-70 md-medium-size-65 md-small-size-100 md-xsmall-size-100">
			<md-card>
				<md-progress-bar v-visible="loading" md-mode="query" />
				<md-table
					v-model="users"
					md-sort="updatedAt"
					md-sort-order="desc"
					md-fixed-header
					:md-sort.sync="queryOption.sortField"
					:md-sort-order.sync="queryOption.order"
					:md-sort-fn="customSort">
					<md-table-toolbar>
						<div class="md-toolbar-section-start">
							<h2 md-title>
								LIST OF USERS
							</h2>
						</div>
						<md-field md-clearable class="md-toolbar-section-end">
							<md-input v-model="queryOption.text" placeholder="Type to search..." @input="searching" />
						</md-field>
					</md-table-toolbar>
					<md-table-row
						slot="md-table-row"
						slot-scope="{ item }"
						table-header-color="purple"
						md-selectable="single"
						@click="select(item)">
						<md-table-cell md-label="Role" md-sort-by="isAdmin">
							{{ item.isAdmin ? "Admin" : item.isStaff ? "Staff" : "None" }}
						</md-table-cell>
						<md-table-cell md-label="Full name" md-sort-by="fullname">
							{{ item.fullname }}
						</md-table-cell>
						<md-table-cell md-label="Username" md-sort-by="username">
							{{ item.username }}
						</md-table-cell>
						<md-table-cell md-label="Phone" md-sort-by="phone">
							{{ item.phone }}
						</md-table-cell>
						<md-table-cell md-label="Join date" md-sort-by="createdAt">
							{{ item.createdAt }}
						</md-table-cell>
					</md-table-row>
				</md-table>
			</md-card>
			<table-botbar
				:loading="loading"
				:index="queryOption.index"
				:count="count"
				@queryMore="queryMore" />
		</div>
	</div>
</template>

<script>
import HandleMessage from "@/components/HandleMessage";
import UserForm from "@/components/UserForm";
import TableBotBar from "@/components/TableBotBar";
export default {
	name: "UserManagement",
	components: {
		"user-form": UserForm,
		"table-botbar": TableBotBar
	},
	mixins: [HandleMessage],
	data() {
		return {
			queryOption: {
				length: 10,
				index: 0,
				sortField: "updatedAt",
				order: "desc",
				text: ""
			},
			timer: null,
			loading: false,
			count: 0,
			users: [],
			selected: {}
		};
	},
	created() {
		this.query();
	},
	mounted() {
		this.$root.$on("userAdded", user => {
			this.users.unshift(user);
		});
		this.$root.$on("userEdited", user => {
			this.users = this.users.map(e =>
				e.username == user.username ? user : e
			);
		});
	},
	methods: {
		select(item) {
			this.selected = item;
		},
		searching() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.query();
			}, 500);
		},
		customSort() {
			this.query();
		},
		queryMore(num = 20) {
			this.queryOption.length = num;
			this.query(true);
		},
		query(more = false) {
			this.loading = true;
			if (!more) {
				this.queryOption.index = 0;
			}

			this.$axios
				.post(this.$api.user.query, this.queryOption)
				.then(res => {
					let { users, count } = res.data;
					if (count !== undefined) {
						this.count = count;
					}
					if (users) {
						if (more) {
							this.users = [...this.users, ...users];
						} else {
							this.users = users;
						}
						this.queryOption.index = this.users.length;
					}
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.queryOption.length = 10;
					this.loading = false;
				});
		}
	}
};
</script>