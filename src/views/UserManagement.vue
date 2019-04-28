<template>
	<div class="md-layout">
		<div class="md-layout-item md-large-size-25 md-medium-size-25 md-small-size-50 md-xsmall-size-100">
			<user-form :user="userSelected" />
		</div>
		<div class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-50 md-xsmall-size-100">
			<md-card>
				<md-progress-bar v-visible="queryLoading" md-mode="query" />
				<md-table
					v-model="users"
					md-sort="updatedAt"
					md-sort-order="desc"
					md-fixed-header
					:md-sort.sync="queryOption.sortField"
					:md-sort-order.sync="queryOption.order"
					:md-sort-fn="customSort"
				>
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
						@click="select(item)"
					>
						<md-table-cell md-label="Role" md-sort-by="isAdmin">
							{{ item.isAdmin ? "Admin" : "Staff" }}
						</md-table-cell>
						<md-table-cell md-label="Name" md-sort-y="fullname">
							{{ item.fullname }}
						</md-table-cell>
						<md-table-cell md-label="Username" md-sort-by="username">
							{{ item.username }}
						</md-table-cell>
						<md-table-cell md-label="Phone" md-sort-by="phone">
							{{ item.phone }}
						</md-table-cell>
						<md-table-cell md-label="Join Date" md-sort-by="createdAt">
							{{ item.createdAt }}
						</md-table-cell>
					</md-table-row>
				</md-table>
			</md-card>
			<div class="">
				<md-button v-if="queryOption.index == count" class="md-primary" disabled>
					All have been loaded
				</md-button>
				<md-button v-else class="md-primary" @click="loadMoreEntries">
					Load more entries
				</md-button>
				<md-button class="" style="float: right; z-index: 0">
					{{ queryOption.index }} / {{ count }}
				</md-button>
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
import HandleMessage from "@/components/HandleMessage.vue";
import UserForm from "@/components/UserForm.vue";
export default {
	name: "App",
	components: {
		"user-form": UserForm
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
			queryTimer: null,
			queryLoading: false,
			users: [],
			userSelected: {},
			count: 0
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
		select(user) {
			this.userSelected = user;
		},
		searching() {
			clearTimeout(this.queryTimer);
			this.queryTimer = setTimeout(() => {
				this.query();
			}, 500);
		},
		customSort() {
			this.query();
		},
		loadMoreEntries() {
			this.query(true);
		},
		query(concat = false) {
			this.queryLoading = true;
			if (!concat) {
				this.queryOption.index = 0;
			}

			this.$axios
				.post(this.$api.user.query, this.queryOption)
				.then(res => {
					let { users, count } = res.data;
					if (users) {
						if (concat) {
							this.users = [...this.users, ...users];
						} else {
							this.users = users;
						}
						this.queryOption.index = this.users.length;
					}
					if (count) {
						this.count = count;
					}
				})
				.catch(err => {
					this.handleMessage(err.message);
				})
				.then(() => {
					this.queryLoading = false;
				});
		}
	}
};
</script>