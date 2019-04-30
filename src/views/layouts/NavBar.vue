<template>
	<div class="navbar">
		<md-tabs
			class="md-primary"
			md-alignment="centered"
			md-sync-route>
			<md-tab
				id="tab-home"
				md-label="Dashboard"
				md-icon="home"
				to="/dashboard" />
			<md-tab
				id="tab-profile"
				:md-label="user.fullname"
				md-icon="account_circle"
				to="/profile" />
			<md-tab
				id="tab-users"
				md-label="Users"
				md-icon="supervisor_account"
				to="/users" />
			<md-tab
				id="tab-customers"
				md-label="Customers"
				md-icon="fiber_smart_record"
				to="/customers" />
			<md-tab
				id="tab-products"
				md-label="Products"
				md-icon="category"
				to="/products" />
			<md-tab
				id="tab-logout"
				md-label="Log Out"
				md-icon="call_missed_outgoing"
				to="/logout" />
		</md-tabs>
	</div>
</template>
<style scoped>
.navbar {
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 2;
}
</style>
<script>
export default {
	name: "TabIcons",
	data() {
		return {
			user: {
				fullname: "",
				username: ""
			}
		};
	},
	created() {
		this.user = this.$cookies.get("user");
	},
};
</script>
